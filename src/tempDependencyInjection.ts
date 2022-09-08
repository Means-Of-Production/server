import {LibraryRepository} from "./repositories/libraryRepository"
import {
    EmailAddress,
    MoneyFactory,
    Person,
    PersonName,
    PhysicalLocation,
    SimpleLibrary, SimpleTimeBasedFeeSchedule,
    USDMoney,
    WaitingListFactory
} from "@meansofproduction/domain"

const moneyFactory = new MoneyFactory()

export const libraryRepository = new LibraryRepository(
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