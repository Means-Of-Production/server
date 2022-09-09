import {objectType} from "nexus"

export const Lender = objectType({
    name: "Lender",
    definition(t) {
        t.nonNull.string("id")
    }
})