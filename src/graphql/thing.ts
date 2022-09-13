import {enumType, objectType} from "nexus"
import {Location} from "./location"
import {Lender} from "./lender"
import {BorrowerVerificationFlags, IThing, ThingStatus} from "@meansofproduction/domain"

export const ThingTitle = objectType({
    name: "ThingTitle",
    definition(t) {
        t.nonNull.string("name")
        t.nullable.string("isbn")
        t.nullable.string("upc")
        t.nullable.string("description")
    }
})

function getNamesFromEnum(t: typeof BorrowerVerificationFlags | typeof ThingStatus): string[] {
    // @ts-ignore
    return Object.keys(t).filter(enumMember => parseInt(enumMember, 10) >= 0).map(e => t[e])
}

export const BorrowerVerificationFlagsObj = enumType({
        name: "BorrowerVerificationFlags",
        members: getNamesFromEnum(BorrowerVerificationFlags)
    }
)

export const ThingStatusObj = enumType({
    name: "ThingStatus",
    members: getNamesFromEnum(ThingStatus)
})

export const Thing = objectType({
    name: "Thing",
    definition(t) {
        t.nonNull.string("id")
        t.nonNull.field("title", {type: ThingTitle})
        t.nonNull.field("storageLocation", {type: Location})
        t.nonNull.list.nonNull.string("imageUrls")
        t.nonNull.field("owner", {type: Lender})
        t.nonNull.list.nonNull.field("requiredBorrowerFlags", {
            type: BorrowerVerificationFlagsObj,
            resolve(thing: IThing){
                return thing.requiredBorrowerFlags.map(f => BorrowerVerificationFlags[f])
            }
        })
        t.nonNull.field("status", {
            type: ThingStatusObj,
            resolve(thing: IThing){
                return ThingStatus[thing.status]
            }
        }
        )
    }
})