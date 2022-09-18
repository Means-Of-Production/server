import {enumType, extendType, interfaceType, nonNull, objectType} from "nexus"
import {Person, PersonInput} from "./person"
import {DistributedLibrary, ILibrary, ILibraryRepository, SimpleLibrary} from "@meansofproduction/domain"
import {Location} from "./location"
import {getCurrentUser} from "../services/getCurrentUser"


export const LocationType = enumType({
    name: "LocationTypeEnum",
    members: ["Physical", "Distributed", "Virtual"]
})

export const Library = interfaceType({
    name: "Library",
    definition(t) {
        t.nonNull.string("id")
        t.nonNull.string("name")
        t.nonNull.field("administrator", {
            type: Person
        })
        t.nonNull.field("location", {type: Location})
        t.nonNull.list.field("items", {
            type: "Thing",
            resolve(source, args, ctx, info) {
                return source.getAllThings();
            }
        })
    },
    resolveType(entity: ILibrary){
        // note this matches the NAME, not the object variable name!
        return (entity instanceof DistributedLibrary) ? "DistributedLibrary":
            (entity instanceof  SimpleLibrary) ? "SimpleLibrary": ""
    }
})


export const SimpleLibraryObj = objectType({
    name: "SimpleLibrary",
    definition(t) {
        t.implements("Library")
    }
})

export const DistributedLibraryObj = objectType({
    name: "DistributedLibrary",
    definition(t) {
        t.implements("Library")
    },
})

export const AllLibrariesQuery = extendType({
    type: "Query",
    definition(t){
        t.nonNull.list.nonNull.field("allLibraries", {
            type: "Library",
            resolve(parent, args, context, _info) {
                const libraryRepository: ILibraryRepository = context.libraryRepository
                return libraryRepository.getAll()
            }
        })
    }
})

export const LibrariesForPersonQuery = extendType({
    type: "Query",
    definition(t){
        t.nonNull.list.nonNull.field("librariesForPerson", {
            type: "Library",
            args: {
                person: nonNull(PersonInput)
            },
            resolve(parent, args, context, _info){
                const libraryRepository: ILibraryRepository = context.libraryRepository
                const person = getCurrentUser(context, args)
                return libraryRepository.getLibrariesPersonCanUse(person)
            }
        })
    }
})