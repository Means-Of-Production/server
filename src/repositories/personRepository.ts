import {IRepository, Person} from "@meansofproduction/domain"
import {BaseInMemoryRepository} from "./baseInMemoryRepository"

export class PersonRepository extends BaseInMemoryRepository<Person> implements IRepository<Person>{
    constructor() {
        super()
    }

    protected create(entity: Person): Person {
        return new Person(
            this.newId(),
            entity.name,
            entity.emails
        )
    }
}