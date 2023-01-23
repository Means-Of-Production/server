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

    async getLoansForPerson(person: Person): Promise<Iterable<ILoan>> {
        const res = []
        for (const loan of await this.getAll()) {
            if (loan.borrower.person.equals(person)) {
                res.push(loan)
            }
        }
        return res
    }


    async getLoansForLibrary(library: ILibrary): Promise<Iterable<ILoan>> {
        const res = []
        for(const loan of await this.getAll()){
            if(loan.borrower.library.id === library.id){
                res.push(loan)
            }
        }

        return res
    }
}