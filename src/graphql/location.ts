import {objectType, unionType} from "nexus"
import {ILocation, PhysicalArea, PhysicalLocation} from "@meansofproduction/domain"

export const VirtualLocation = objectType({
    name: "VirtualLocation",
    definition(t) {
        t.nullable.string("url")
    }
})


export const PhysicalLocationObj = objectType({
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


export const PhysicalAreaObj = objectType({
    name: "Area",
    definition(t) {
        t.nonNull.field("center", { type: PhysicalLocationObj})
        t.nonNull.float("distance")
    }
})


export const Location = unionType({
    name: "Location",
    definition(t) {
        t.members("PhysicalLocation", "Area")
    },
    resolveType(location: ILocation){
        return location instanceof PhysicalArea ? "PhysicalArea"
            : location instanceof PhysicalLocation? "PhysicalLocation": "VirtualLocation"
    }
})