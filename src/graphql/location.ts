import {objectType, unionType} from "nexus"

export const PhysicalLocation = objectType({
    name: "PhysicalLocation",
    definition(t) {
        t.nullable.string("latitude")
        t.nullable.string("longitude")
        t.nullable.string("streetAddress")
        t.nullable.string("apartment")
        t.nullable.string("streetName")
        t.nullable.string("city")
        t.nullable.string("state")
        t.nullable.string("country")
        t.nullable.string("zipcode")
    }
})

export const Area = objectType({
    name: "Area",
    definition(t) {
        t.nonNull.field("center", { type: PhysicalLocation})
        t.nonNull.float("distance")
    }
})

export const Location = unionType({
    name: "Location",
    definition(t) {
        t.members("PhysicalLocation", "Area")
    }
})