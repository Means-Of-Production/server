import {LibraryRepository} from "./repositories/libraryRepository.js"
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
    ILoanRepository
} from "@meansofproduction/domain"
import {PersonRepository} from "./repositories/personRepository.js"
import {BorrowerRepository} from "./repositories/borrowerRepository.js"
import {LoanRepository} from "./repositories/loanRepository.js"
import {IAuthenticationService} from "./services/IAuthenticationService.js";
import {Auth0AuthenticationService} from "./services/Auth0AuthenticationService.js";
import {User} from "./entities/User";

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

export const libraryRepository = new LibraryRepository(
    [
        simpleLibrary,
        distributedLibrary
    ]
)

export const borrowerRepository = new BorrowerRepository()
borrowerRepository.add(testyBorrower)

export const titleSearchService = new TitleSearchService(libraryRepository);

export const loanRepository = new LoanRepository(libraryRepository)

export const authenticationService = new Auth0AuthenticationService()

export const context = {
    libraryRepository,
    titleSearchService,
    personRepository,
    borrowerRepository,
    loanRepository,
    authenticationService,
    user: null
}

export interface IContext {
    libraryRepository: ILibraryRepository
    titleSearchService: ITitleSearchService
    personRepository: IRepository<Person>
    borrowerRepository: IBorrowerRepository
    loanRepository: ILoanRepository
    authenticationService: IAuthenticationService
    user: User | null
}