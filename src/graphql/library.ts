import {enumType, extendType, objectType} from "nexus"
import {Person} from "./person"
import {libraryRepository} from "../tempDependencyInjection"
import {fromLibrary} from "../mapper"

export const LibraryTypeEnum = enumType({
    name: "LibraryTypeEnum",
    members: ["Simple", "Distributed", "BuyNothing"]
})

export const LocationType = enumType({
    name: "LocationTypeEnum",
    members: ["Physical", "Distributed", "Virtual"]
})

export const Library = objectType({
    name: "Library",
    definition(t) {
        t.nonNull.string("id")
        t.nonNull.field("type", {type: LibraryTypeEnum})
        t.nonNull.string("name")
        t.nonNull.field("administrator", {
            type: Person
        })
    }
})

export const LibrariesQuery = extendType({
    type: "Query",
    definition(t){
        t.nonNull.list.nonNull.field("libraries", {
            type: "Library",
            resolve(parent, args, context, info) {
                const allLibraries = libraryRepository.getAll()
                return Array.from(allLibraries).map(l => fromLibrary(l))
            }
        })
    }
})