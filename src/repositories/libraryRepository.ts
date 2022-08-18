import {BaseInMemoryRepository} from "./baseInMemoryRepository";
import {ILibrary, ILibraryRepository, SimpleLibrary, PersonName, Person,
    PhysicalLocation, WaitingListFactory, MoneyFactory, EmailAddress, USDMoney, SimpleTimeBasedFeeSchedule, IdFactory} from "@meansofproduction/domain"

export class LibraryRepository extends BaseInMemoryRepository<ILibrary> implements ILibraryRepository {
    constructor() {
        super();

        const waitingListFactory = new WaitingListFactory(false)
        const person = new Person("testPerson", new PersonName("Testy", "McTesterson"), [new EmailAddress("test@test.com")])
        const location = new PhysicalLocation(0, 0, "84 Manhattan Ave Brooklyn, NY")
        const moneyFactory = new MoneyFactory();
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
        return entity.name
    }
}