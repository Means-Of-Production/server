import {objectType} from "nexus"

export const Person = objectType({
    name: "Person",
    definition(t) {
        t.nonNull.string("id")
        t.nonNull.string("firstName")
        t.nullable.string("middleName")
        t.nonNull.string("lastName")
        t.nonNull.list.nonNull.string("emails")
    }
})