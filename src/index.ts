import {ApolloServer, BaseContext} from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFile } from "fs/promises";
import {
    Borrower, Distance, DistributedLibrary,
    EmailAddress, IBorrowerRepository,
    ILibrary, ILibraryRepository, ILoanRepository, IndividualDistributedLender, IRepository, ITitleSearchService,
    MoneyFactory,
    MOPServer,
    Person,
    PersonName, PhysicalArea, PhysicalLocation,
    SimpleLibrary, Thing, ThingStatus, ThingTitle, TitleSearchService, USDMoney,
    WaitingListFactory
} from "@meansofproduction/domain";
import {PersonRepository} from "./repositories/personRepository";
import {LibraryRepository} from "./repositories/libraryRepository";
import {BorrowerRepository} from "./repositories/borrowerRepository";
import {LoanRepository} from "./repositories/loanRepository";
import {Auth0AuthenticationService} from "./services/Auth0AuthenticationService";
import {IAuthenticationService} from "./services/IAuthenticationService";
import {User} from "./entities/user";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = (await readFile("schema.graphql")).toString();
const moneyFactory = new MoneyFactory()

const waitingListFactory = new WaitingListFactory(false)

const mopServer = new MOPServer(
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
    mopServer
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
    mopServer
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

const loanRepository = new LoanRepository(libraryRepository)

const user = new User("test", new PersonName("Testy", "McTesterson"))

export const populatedContext = {
    libraryRepository,
    titleSearchService,
    personRepository,
    borrowerRepository,
    loanRepository,
    authenticationService: new Auth0AuthenticationService(),
    user
}

export interface IContext extends BaseContext {
    libraryRepository: ILibraryRepository
    titleSearchService: ITitleSearchService
    personRepository: IRepository<Person>
    borrowerRepository: IBorrowerRepository
    loanRepository: ILoanRepository
    authenticationService: IAuthenticationService
    user: User
}

const resolvers = {
    Query: {
        allLibraries(parent: any, args: any, contextValue: IContext, info: any): Iterable<ILibrary> {
            const repo = contextValue.libraryRepository;
            return repo.getAll();
        }
    }
}

const server = new ApolloServer<IContext>({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server,
    {
        context: async ({ req, res }) => populatedContext
    });


console.log(`🚀  Server ready at: ${url}`);