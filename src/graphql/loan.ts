import {booleanArg, enumType, extendType, intArg, nonNull, nullable, objectType, scalarType, stringArg} from "nexus"
import {BorrowerVerificationFlagsObj, Thing} from "./thing"
import {
    DueDate,
    IBorrowerRepository, ILibraryRepository,
    ILoan, ILoanRepository,
    LoanStatus
} from "@meansofproduction/domain"
import {Person, PersonInput} from "./person"
import {Library} from "./library"
import {LibraryFee} from "./money"
import {Kind} from "graphql/language"
import {Location} from "./location"
import {getNamesFromEnum} from "../services/getNamesFromEnum"
import {getCurrentUser} from "../services/getCurrentUser"
import {populatedContext} from "../index"
import {LoanRepository} from "../repositories/loanRepository"

export const DateScalar = scalarType({
    name: 'Date',
    asNexusMethod: 'date',
    description: 'Date custom scalar type',
    parseValue(value: any) {
        return new Date(value)
    },
    serialize(value: any): string {
        return value.getTime()
    },
    parseLiteral(ast){
        if(ast.kind == Kind.INT) {
            return new Date(ast.value)
        }
        return null
    }
})

export const DueDateObj = objectType({
    name: "DueDate",
    definition(t){
        t.nullable.string("date")
    }
})

export const Borrower = objectType({
    name: "Borrower",
    definition(t) {
        t.nonNull.field("person", {type: Person})
        t.nonNull.field("library", {type: Library})
        t.nonNull.list.field("BorrowerVerificationFlags", {type: BorrowerVerificationFlagsObj})
        t.nonNull.list.field("fees", {type: LibraryFee})
    }
})
export const LoanStatusObj = enumType({
    name: "LoanStatus",
    members: getNamesFromEnum(LoanStatus)
})

export const Loan = objectType({
        name: "Loan",
        definition(t) {
            t.nonNull.string("id")
            t.nonNull.field("borrower", {type: Borrower})
            t.nonNull.field("item", {type: Thing})
            t.nonNull.field("dueDate", {type: DueDateObj})
            t.nullable.string("dateReturned")
            t.nonNull.field("returnLocation", {type: Location})
            t.nonNull.field("status", {
                type: LoanStatusObj,
                resolve(loan: ILoan){
                    return LoanStatus[loan.status]
                }
            })
            t.nonNull.boolean("permanentLoan")
        }
})

export const LoansForPersonQuery = extendType({
    type: "Query",
    definition(t){
        t.nonNull.list.nonNull.field("loansForPerson", {
            type: "Loan",
            args: {
                person: nonNull(PersonInput),
                hideNonReturn: nullable(booleanArg())
            },
            resolve(parent, args, context, _info){
                const user = getCurrentUser(context)

                const loanRepository: LoanRepository = context.loanRepository
                return loanRepository.getLoansForPerson(user)
            }
        })
    }
})

export const LoansForLibraryQuery = extendType({
    type: "Query",
    definition(t){
        t.nonNull.list.nonNull.field("loansForLibrary", {
            type: "Loan",
            args: {
                libraryID: nonNull(stringArg()),
                hideNonReturn: nullable(booleanArg())
            },
            resolve(parent, args, context, _info){
                const libraryRepository: ILibraryRepository = context.libraryRepository
                const library = libraryRepository.get(args.libraryID)
                if(!library){
                    throw new Error(`No library found for id ${args.libraryID}`)
                }

                const loanRepository: LoanRepository = context.loanRepository
                return loanRepository.getLoansForLibrary(library)
            }
        })
    }
})

export const BorrowMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("borrow", {
            type: "Loan",
            args: {
                libraryID: nonNull(stringArg()),
                personID: nonNull(stringArg()),
                thingID: nonNull(stringArg()),
                until: nullable(stringArg())
            },
            resolve(_root, args, ctx): ILoan {
                const person = getCurrentUser(ctx)
                const borrowerRepository: IBorrowerRepository = ctx.borrowerRepository

                const borrowers = Array.from(borrowerRepository.getBorrowersForPerson(person)).filter(b => b.library.id == args.libraryID)
                if (borrowers.length < 1) {
                    throw new Error(`${person.toString()} does not have permission to borrow from library ID ${args.libraryID}`)
                }
                const borrower = borrowers[0]
                const library = borrower.library

                const things = Array.from(library.getAvailableThings()).filter(t => t.id == args.thingID)
                if (things.length < 1) {
                    throw new Error(`Thing ID ${args.thingID} does not match any item in library ${library.name}`)
                }
                const thing = things[0]

                const until = args.until ? new DueDate(new Date(Date.parse(args.until))) : new DueDate(null)

                const loan = library.borrow(thing, borrower, until)

                const loanRepository: ILoanRepository = populatedContext.loanRepository
                return loanRepository.add(loan)
            }
        })
    }
})