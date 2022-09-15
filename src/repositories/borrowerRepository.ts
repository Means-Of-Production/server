import {EntityNotAssignedIdError, IBorrower, IBorrowerRepository, Person} from "@meansofproduction/domain"
import {BaseInMemoryRepository} from "./baseInMemoryRepository"

export class BorrowerRepository extends BaseInMemoryRepository<IBorrower> implements IBorrowerRepository{
    public constructor() {
        super()
    }

    protected getIdFromEntity(entity: IBorrower): string {
        if(!entity.id){
            throw new EntityNotAssignedIdError("Borrower has no id yet!")
        }
        return entity.id
    }

    * getBorrowersForPerson(person: Person): Iterable<IBorrower> {
        for(const borrower of this.getAll()){
            if(borrower.person.id == person.id){
                yield borrower
            }
        }
    }

}