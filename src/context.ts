import {LibraryRepository} from "./repositories/libraryRepository"
import {
    EmailAddress,
    ILibraryRepository,
    MoneyFactory,
    Person,
    PersonName,
    PhysicalLocation,
    SimpleLibrary,
    SimpleTimeBasedFeeSchedule,
    Thing,
    ThingStatus,
    ThingTitle,
    USDMoney,
    WaitingListFactory
} from "@meansofproduction/domain"

const moneyFactory = new MoneyFactory()

const simpleLibrary =         new SimpleLibrary(
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

const libraryRepository = new LibraryRepository(
    [
        simpleLibrary
    ]
)

const tableSaw = new Thing(
    "847s77fhd",
    new ThingTitle(
        "Ryobi Table Saw",
        "",
        "295848321"
    ),
    simpleLibrary.location,
    simpleLibrary,
    ThingStatus.READY,
    "A nice table saw portable for job use",
    ["https://homedepot.scene7.com/is/image/homedepotcanada/p_1001098919.jpg?wid=1000&hei=1000&op_sharpen=1"],
    null,
)
simpleLibrary.addItem(tableSaw)

export interface Context{
    libraryRepository: ILibraryRepository
}

export const context = {
    libraryRepository
}