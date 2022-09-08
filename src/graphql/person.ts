import {objectType} from "nexus"

export const Email = objectType({
    name: "Email",
    definition(t) {
        t.nonNull.string("value")
    }
})

export const PersonName = objectType({
    name: "PersonName",
    definition(t) {
        t.nonNull.string("firstName")
        t.nullable.string("middleName")
        t.nonNull.string("lastName")
    }
})

export const Person = objectType({
    name: "Person",
    definition(t) {
        t.nonNull.string("id")
        t.nonNull.field("name", {type:PersonName})
        t.nonNull.list.nonNull.field("emails", {type: Email})
    }
})