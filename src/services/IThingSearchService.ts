import {IThing, Person, ThingTitle} from "@meansofproduction/domain";
import {SearchRequest} from "../valueItems/searchRequest"

export interface IThingSearchService {
    find(person: Person, searchRequest: SearchRequest): Iterable<ThingTitle>
}