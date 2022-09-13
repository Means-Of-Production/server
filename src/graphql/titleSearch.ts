import {extendType, inputObjectType, nonNull, nullable, objectType} from "nexus"
import {Thing, ThingTitle} from "./thing"
import {Library} from "./library"
import {PersonInput} from "./person"


export const TitleSearchRequest = inputObjectType({
    name: "TitleSearchRequest",
    definition(t) {
        t.nullable.string("searchText")
    }
})

export const LibrarySearchResult = objectType({
    name: "LibrarySearchResult",
    definition(t) {
        t.nonNull.field("library", {type: Library})
        t.nonNull.list.field("things", {type: Thing})
    }
})

export const TitleSearchResult = objectType({
    name: "TitleSearchResult",
    definition(t) {
        t.nonNull.field("title", {type: ThingTitle})
        t.nonNull.list.field("libraryResults", {type: LibrarySearchResult})
    }
})

export const TitleSearchRequestQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("titleSearchResults", {
            type: "TitleSearchResult",
            args: {
                person: nonNull(PersonInput),
                searchRequest: nullable(TitleSearchRequest)
            },
            resolve(parent, args, context, info){
                const personRepository = context.personRepository

                const searchRequest = args.searchRequest
                // TODO person should come from authorization, not client
                const person = personRepository.get(args.person.id)

                const titleSearchService = context.titleSearchService;
                return titleSearchService.find(person, searchRequest)
            }
        })
    }
})