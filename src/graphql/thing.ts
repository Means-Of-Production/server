import {enumType, objectType} from "nexus"
import {Location} from "./location"
import {Lender} from "./lender"
import {BorrowerVerificationFlags, ThingStatus} from "@meansofproduction/domain"

export const ThingTitle = objectType({
    name: "ThingTitle",
    definition(t) {
        t.nonNull.string("name")
        t.nullable.string("isbn")
        t.nullable.string("upc")
        t.nullable.string("description")
    }
})
/*
export const BorrowerVerificationFlagsObj = enumType({
        name: "BorrowerVerificationFlags",
        members: Object.values(BorrowerVerificationFlags).map(e => e.toString())
    }
)

export const ThingStatusObj = enumType({
    name: "ThingStatus",
    members: Object.values(ThingStatus).map(e => e.toString())
})*/

export const Thing = objectType({
    name: "Thing",
    definition(t) {
        t.nonNull.string("id")
        t.nonNull.field("title", {type: ThingTitle})
        t.nonNull.field("storageLocation", {type: Location})
        t.nonNull.list.nonNull.string("imageUrls")
        t.nonNull.field("owner", {type: Lender})
        //t.nonNull.list.nonNull.field("requiredBorrowerFlags", {type: BorrowerVerificationFlagsObj})
        //t.nonNull.field("status", {type: ThingStatusObj})
    }
})