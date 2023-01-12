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
    ILoanRepository
} from "@meansofproduction/domain"
import {PersonRepository} from "./repositories/personRepository"
import {BorrowerRepository} from "./repositories/borrowerRepository"
import {LoanRepository} from "./repositories/loanRepository"
import {User} from "./entities/user";
import {IAuthenticationService} from "./services/IAuthenticationService";
import {BaseContext} from "@apollo/server";
import {Auth0AuthenticationService} from "./services/Auth0AuthenticationService";

export interface MyContext extends BaseContext {
    // You can optionally create a TS interface to set up types
    // for your contextValue
    authScope?: String;
}

