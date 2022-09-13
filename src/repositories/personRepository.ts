import {IRepository, Person} from "@meansofproduction/domain"
import {BaseInMemoryRepository} from "./baseInMemoryRepository"

export class PersonRepository extends BaseInMemoryRepository<Person> implements IRepository<Person>{
    constructor() {
        super()
    }

    protected getIdFromEntity(entity: Person): string {
        return entity.id
    }
}