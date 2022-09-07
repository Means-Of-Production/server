import {
    Person,
    PersonName,
    ILibrary,
    IBorrower,
} from "@meansofproduction/domain"
import {LibraryRepository} from "./libraryRepository"
import {instance, mock, when} from "ts-mockito";


describe("library repository", () => {
    it("gets libraries via person", () => {1
        const personName = new PersonName("Testy", "McTesterson")
        const person = new Person("test", personName, [])

        const mockLib1: ILibrary = mock()

        const mockBorrower1: IBorrower = mock()
        when(mockBorrower1.person).thenReturn(person)
        when(mockLib1.borrowers).thenReturn([instance(mockBorrower1)])

        const mockLib2: ILibrary = mock()
        const mockBorrower2: IBorrower = mock()
        when(mockBorrower2.person).thenReturn(new Person("nope", personName, []))
        when(mockLib2.borrowers).thenReturn([instance(mockBorrower2)])

        const underTest = new LibraryRepository([instance(mockLib1), instance(mockLib2)])

        // act
        const res = Array.from(underTest.getLibrariesPersonCanUse(person))

        expect(res).not.toBeNull()
        expect(res.length).toEqual(1)
    })
})