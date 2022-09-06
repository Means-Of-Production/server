import {Borrower, Person, PersonName, SimpleLibrary} from "@meansofproduction/domain";
import {LibraryRepository} from "./libraryRepository";


describe("library repository", () => {
    it("gets libraries via person", () => {
        const person = new Person("test", new PersonName("Testy", "McTesterson"), [])

        const underTest = new LibraryRepository()

        // act
        const res = underTest.getLibrariesPersonCanUse(person)

        expect(res).not.toBeNull()
    })
})