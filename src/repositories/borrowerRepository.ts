import {EntityNotAssignedIdError, IBorrower, IBorrowerRepository, Person, Borrower} from "@meansofproduction/domain"
import {BaseInMemoryRepository} from "./baseInMemoryRepository.js"

export class BorrowerRepository extends BaseInMemoryRepository<IBorrower> implements IBorrowerRepository{
    public constructor() {
        super()
    }

    * getBorrowersForPerson(person: Person): Iterable<IBorrower> {
        for(const borrower of this.getAll()){
            if(borrower.person.id == person.id){
                yield borrower
            }
        }
    }

    protected create(entity: IBorrower): IBorrower {
        return new Borrower(
            this.newId(),
            entity.person,
            entity.library,
            Array.from(entity.verificationFlags),
            Array.from(entity.fees)
        )
    }

}