import {LibraryRepository} from "./repositories/libraryRepository"
import {
    EmailAddress, ILibraryRepository,
    MoneyFactory,
    Person,
    PersonName,
    PhysicalLocation,
    SimpleLibrary, SimpleTimeBasedFeeSchedule,
    USDMoney,
    WaitingListFactory
} from "@meansofproduction/domain"

const moneyFactory = new MoneyFactory()

const libraryRepository = new LibraryRepository(
    [
        new SimpleLibrary(
            "testLib1",
            "testLibrary",
            new Person("admin", new PersonName("Testy", "McTesterson"), [new EmailAddress("testy@test.com")]),
            new PhysicalLocation(0, 0),
            new WaitingListFactory(false),
            new USDMoney(100),
            [],
            moneyFactory,
            new SimpleTimeBasedFeeSchedule(new USDMoney(10), moneyFactory)
        )
    ]
)

export interface Context{
    libraryRepository: ILibraryRepository
}

export const context = {
    libraryRepository
}