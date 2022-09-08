import {extendType, inputObjectType, objectType} from "nexus"


export const TitleSearchRequest = inputObjectType({
    name: "TitleSearchRequest",
    definition(t) {
        t.nullable.string("searchText")
    }
})

export const TitleSearchResult = objectType({
    name: "TitleSearchResult",
    definition(t) {

    }
})

export const TitleSearchRequestQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull
    }
})