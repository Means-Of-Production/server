import {IThingSearchService} from "./IThingSearchService";
import {ILibraryRepository, IThing, Person, ThingTitle} from "@meansofproduction/domain";
import {SearchRequest} from "../valueItems/searchRequest";

export class ThingSearchService implements IThingSearchService {
    private readonly libraryRepository: ILibraryRepository

    constructor(libraryRepository: ILibraryRepository) {
        this.libraryRepository = libraryRepository
    }

    * find(person: Person, searchRequest: SearchRequest): Iterable<ThingTitle> {
        const libraries = this.libraryRepository.getLibrariesPersonCanUse(person);

        const exported = []
        for(const library of libraries) {
            for(const item of library.availableTitles){
                const id = item.hash
                if(exported.indexOf(id) < 0){
                    exported.push(id)
                    yield item
                }
            }
        }
    }
}
