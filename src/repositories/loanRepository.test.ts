import {anything, instance, mock, when} from "ts-mockito"
import {PersonName, Person, IBorrower, ILibrary, ILoan, ILibraryRepository} from "@meansofproduction/domain"
import {LoanRepository} from "./loanRepository"

describe("LoanSearchService", () => {
    it("getLoansForPersonFiltersByBorrower", () => {
        const person: Person = new Person("personId", new PersonName("Testy", "McTesterson"))
        const borrower: IBorrower = mock()
        when(borrower.person).thenReturn(person)

        const otherPerson: Person = new Person("anotherPerson", new PersonName("Billy", "Jean"))
        const otherBorrower: IBorrower = mock()
        when(otherBorrower.person).thenReturn(otherPerson)

        const libraryRepository: ILibraryRepository = mock()

        const loan1: ILoan = mock()
        when(loan1.borrower).thenReturn(instance(borrower))

        const loan2: ILoan = mock()
        when(loan2.borrower).thenReturn(instance(otherBorrower))

        const underTest = new LoanRepository(instance(libraryRepository))
        underTest.add(instance(loan1))
        underTest.add(instance(loan2))

        const res = Array.from(underTest.getLoansForPerson(person))

        expect(res.length).toEqual(1)
    })
})