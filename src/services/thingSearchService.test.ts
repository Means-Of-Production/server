import {ILibrary, ILibraryRepository, IThing, Person, ThingTitle} from "@meansofproduction/domain";
import {anything, instance, mock, when} from "ts-mockito";
import {ThingSearchService} from "./thingSearchService";
import {SearchRequest} from "../valueItems/searchRequest";

describe("thingSearchService", () => {
    it("removes duplicate titles", () => {
        const title1: ThingTitle = mock()
        when(title1.hash).thenReturn("hash1")

        const title2: ThingTitle = mock()
        when(title2.hash).thenReturn("another")

        const library: ILibrary = mock()
        when(library.availableTitles).thenReturn([instance(title1), instance(title2)])

        const secondLibrary: ILibrary = mock()
        when(secondLibrary.availableTitles).thenReturn([instance(title1)])

        const libraryRepo: ILibraryRepository = mock()
        when(libraryRepo.getLibrariesPersonCanUse(anything())).thenReturn([instance(library), instance(secondLibrary)])

        const underTest = new ThingSearchService(instance(libraryRepo))

        const person: Person = mock()
        const searchRequest: SearchRequest = mock()

        // act
        const res = Array.from(underTest.find(instance(person), instance(searchRequest)))

        expect(res).not.toBeNull()
        expect(res.length).toEqual(2)
    })
})
