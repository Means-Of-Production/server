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
    Thing,
    ThingStatus,
    ThingTitle,
    USDMoney,
    WaitingListFactory,
    TitleSearchService,
    ITitleSearchService,
    IRepository,
    Borrower,
    IBorrowerRepository,
    MOPServer,
    ILoanSearchService, LoanSearchService
} from "@meansofproduction/domain"
import {PersonRepository} from "./repositories/personRepository"
import {BorrowerRepository} from "./repositories/borrowerRepository"

const moneyFactory = new MoneyFactory()

const waitingListFactory = new WaitingListFactory(false)

const server = new MOPServer(
    new URL("https://localhost"),
    "1.0.0"
)

const simpleLibrary = new SimpleLibrary(
    "testLib1",
    "testLibrary",
    new Person("admin", new PersonName("Testy", "McTesterson"), [new EmailAddress("testy@test.com")]),
    new PhysicalLocation(0, 0),
    waitingListFactory,
    new USDMoney(100),
    [],
    moneyFactory,
    server
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

const testy = new Person("admin", new PersonName("Testy", "McTesterson"), [new EmailAddress("testy@test.com")])
const testyBorrower = new Borrower("testyBorrower", testy, simpleLibrary)
simpleLibrary.addBorrower(testyBorrower)

const distributedLibrary = new DistributedLibrary(
    "MOPTestDistLib1",
    "Means of Production Test Library",
    testy,
    new USDMoney(100),
    waitingListFactory,
    [],
    moneyFactory,
    new PhysicalArea(
        new PhysicalLocation(0, 0),
        Distance.fromKilometers(10)
    ),
    server
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


const personRepository = new PersonRepository()
personRepository.add(testy)
personRepository.add(bob)

const libraryRepository = new LibraryRepository(
    [
        simpleLibrary,
        distributedLibrary
    ]
)

const borrowerRepository = new BorrowerRepository()
borrowerRepository.add(testyBorrower)

const titleSearchService = new TitleSearchService(libraryRepository);

const loanSearchService = new LoanSearchService(libraryRepository)

export const context = {
    libraryRepository,
    titleSearchService,
    personRepository,
    borrowerRepository,
    loanSearchService
}

export interface Context {
    libraryRepository: ILibraryRepository
    titleSearchService: ITitleSearchService
    personRepository: IRepository<Person>
    borrowerRepository: IBorrowerRepository
    loanSearchService: ILoanSearchService
}