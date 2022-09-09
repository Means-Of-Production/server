import {LibraryRepository} from "./repositories/libraryRepository"
import {
    Distance,
    DistributedLibrary,
    EmailAddress,
    ILibraryRepository,
    IndividualDistributedLender,
    MoneyFactory,
    Person,
    PersonName,
    PhysicalArea,
    PhysicalLocation,
    SimpleLibrary,
    SimpleTimeBasedFeeSchedule,
    Thing,
    ThingStatus,
    ThingTitle,
    TimeInterval,
    USDMoney,
    WaitingListFactory
} from "@meansofproduction/domain"

const moneyFactory = new MoneyFactory()

const waitingListFactory = new WaitingListFactory(false)

const feeSchedule = new SimpleTimeBasedFeeSchedule(new USDMoney(10), moneyFactory)

const simpleLibrary = new SimpleLibrary(
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

const tableSawTitle = new ThingTitle(
    "Ryobi Table Saw",
    "",
    "295848321"
)

const tableSaw = new Thing(
    "847s77fhd",
    tableSawTitle,
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
const bob = new Person("bob", new PersonName("Bob", "Good", "Person"), [new EmailAddress("bob@test.com")])
const bobLender = new IndividualDistributedLender("bobDist", bob, bob.emails, [], new PhysicalLocation(10, 10))

const bobsSaw = new Thing(
    "bobsSaw",
    tableSawTitle,
    new PhysicalLocation(0, 0),
    bobLender,
    ThingStatus.BORROWED,
    "my old saw",
    [],
    null
)
bobLender.addItem(bobsSaw)
distributedLibrary.addLender(bobLender)

export interface Context {
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