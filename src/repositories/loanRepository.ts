import {BaseInMemoryRepository} from "./baseInMemoryRepository.js"
import {ILibrary,
    ILibraryRepository,
    ILoan,
    ILoanRepository,
    Loan,
    Person,
    PhysicalLocation
} from "@meansofproduction/domain"

export class LoanRepository extends BaseInMemoryRepository<ILoan> implements ILoanRepository {
    private readonly libraryRepository: ILibraryRepository

    public constructor(libraryRepository: ILibraryRepository) {
        super()
        this.libraryRepository = libraryRepository
    }

    protected create(entity: ILoan): ILoan {
        return new Loan(
            this.newId(),
            entity.item,
            entity.borrower,
            entity.dueDate,
            entity.status,
            entity.returnLocation as PhysicalLocation,
            entity.dateReturned
        )
    }

    * getLoansForPerson(person: Person): Iterable<ILoan> {
        for (const loan of this.getAll()) {
            if (loan.borrower.person.equals(person)) {
                yield loan
            }
        }
    }


    * getLoansForLibrary(library: ILibrary): Iterable<ILoan> {
        for(const loan of this.getAll()){
            if(loan.borrower.library.id === library.id){
                yield loan
            }
        }
    }
}