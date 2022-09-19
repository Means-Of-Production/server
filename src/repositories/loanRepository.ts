import {BaseInMemoryRepository} from "./baseInMemoryRepository"
import {ILoan, Loan, PhysicalLocation} from "@meansofproduction/domain"

export class LoanRepository extends BaseInMemoryRepository<ILoan> {
    public constructor(){
        super()
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
}