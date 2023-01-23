import {IBorrower, IBorrowerRepository, Person, Borrower} from "@meansofproduction/domain"
import {BaseInMemoryRepository} from "./baseInMemoryRepository.js"

export class BorrowerRepository extends BaseInMemoryRepository<IBorrower> implements IBorrowerRepository{
    public constructor() {
        super()
    }

    async getBorrowersForPerson(person: Person): Promise<Iterable<IBorrower>> {
        const res = []
        for(const borrower of await this.getAll()){
            if(borrower.person.id == person.id){
                res.push(borrower)
            }
        }
        return res
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