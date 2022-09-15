import {extendType, nonNull, nullable, objectType, scalarType, stringArg} from "nexus"
import {BorrowerVerificationFlagsObj, Thing} from "./thing"
import {DueDate, IBorrowerRepository, ILoan} from "@meansofproduction/domain"
import {Person, PersonInput} from "./person"
import {Library} from "./library"
import {LibraryFee} from "./money"
import {Kind} from "graphql/language"

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

export const Loan = objectType({
        name: "Loan",
        definition(t) {
            t.nonNull.string("id")
            t.nonNull.field("borrower", {type: Borrower})
            t.nonNull.field("item", {type: Thing})
        }
})

export const BorrowMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.list.field("borrow", {
            type: "Loan",
            args: {
                libraryID: nonNull(stringArg()),
                person: nonNull(PersonInput),
                thingID: nonNull(stringArg()),
                until: nullable(stringArg())
            },
            resolve(_root, args, ctx): ILoan {
                const personRepository = ctx.personRepository
                // TODO person should come from authorization, not client
                const person = personRepository.get(args.person.id)

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

                return library.borrow(thing, borrower, until)
            }
        })
    }
})