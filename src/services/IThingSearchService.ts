import {IThing} from "@meansofproduction/domain";
import {SearchRequest} from "../valueItems/searchRequest"

export interface IThingSearchService{
    find(searchRequest: SearchRequest): Iterable<IThing>
}