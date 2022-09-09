import {BaseInMemoryRepository} from "./baseInMemoryRepository";
import {ILibrary, ILibraryRepository, PersonName, Person,
    PhysicalLocation, WaitingListFactory, MoneyFactory, EmailAddress} from "@meansofproduction/domain"

export class LibraryRepository extends BaseInMemoryRepository<ILibrary> implements ILibraryRepository {
    constructor(libraries: Iterable<ILibrary> = []) {
        super();

        const waitingListFactory = new WaitingListFactory(false)
        const person = new Person("testPerson", new PersonName("Testy", "McTesterson"), [new EmailAddress("test@test.com")])
        const location = new PhysicalLocation(0, 0, "84 Manhattan Ave Brooklyn, NY")
        const moneyFactory = new MoneyFactory()

        for(const lib of libraries){
            this.add(lib)
        }
/*
        const library = new SimpleLibrary(
            "testLibrary",
            person,
            location,
            waitingListFactory,
            new USDMoney(100),
            [],
            moneyFactory,
            SimpleTimeBasedFeeSchedule,
            new IdFactory()
        )*/
    }

    protected getIdFromEntity(entity: ILibrary): string {
        if(!entity.id){
            return entity.name
        }
        return entity.id
    }

    * getLibrariesPersonCanUse(person: Person): Iterable<ILibrary> {
        for(const library of this.getAll()){
            for(const borrower of library.borrowers){
                if(borrower.person.id == person.id){
                    yield library;
                }
            }
        }
    }
}