import {LibraryRepository} from "./repositories/libraryRepository"
import {
    DistributedLibrary,
    EmailAddress,
    ILibraryRepository,
    MoneyFactory,
    Person,
    PersonName, PhysicalArea,
    PhysicalLocation,
    SimpleLibrary,
    SimpleTimeBasedFeeSchedule,
    Thing,
    ThingStatus,
    ThingTitle, TimeInterval,
    USDMoney,
    WaitingListFactory,
    Distance
} from "@meansofproduction/domain"

const moneyFactory = new MoneyFactory()

const waitingListFactory =  new WaitingListFactory(false)

const feeSchedule = new SimpleTimeBasedFeeSchedule(new USDMoney(10), moneyFactory)

const simpleLibrary =         new SimpleLibrary(
    "testLib1",
    "testLibrary",
    new Person("admin", new PersonName("Testy", "McTesterson"), [new EmailAddress("testy@test.com")]),
    new PhysicalLocation(0, 0),
    waitingListFactory,
    new USDMoney(100),
    [],
    moneyFactory,
    feeSchedule
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

const distributedLibrary = new DistributedLibrary(
    "MOPTestDistLib1",
    "Means of Production Test Library",
    new Person("admin", new PersonName("Testy", "McTesterson"), [new EmailAddress("testy@test.com")]),
    new USDMoney(100),
    waitingListFactory,
    [],
    feeSchedule,
    moneyFactory,
    TimeInterval.fromDays(14),
    new PhysicalArea(
        new PhysicalLocation(0, 0),
        Distance.fromKilometers(10)
    )
)
export interface Context{
    libraryRepository: ILibraryRepository
}

const libraryRepository = new LibraryRepository(
    [
        simpleLibrary,
        distributedLibrary
    ]
)

export const context = {
    libraryRepository
}