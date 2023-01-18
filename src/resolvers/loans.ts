import {
    ILoanRepository,
    ILibraryRepository,
    IBorrowerRepository,
    ILoan,
    DueDate
} from "@meansofproduction/domain";
import {getRequestedPerson} from "../services/getRequestedPerson.js";

export function loansForPerson(parent, args, context, _info){
    const user = getRequestedPerson(context.context, args)

    const loanRepository: ILoanRepository = context.context.loanRepository
    return loanRepository.getLoansForPerson(user)
}


export function loansForLibrary(parent, args, context, _info){
    const libraryRepository: ILibraryRepository = context.context.libraryRepository
    const library = libraryRepository.get(args.libraryID)
    if(!library){
        throw new Error(`No library found for id ${args.libraryID}`)
    }

    const loanRepository: ILoanRepository = context.loanRepository
    return loanRepository.getLoansForLibrary(library)
}

export function borrowMutation(_root, args, ctx): ILoan {
    const person = getRequestedPerson(ctx, args)
    const borrowerRepository: IBorrowerRepository = ctx.context.borrowerRepository

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

    const loanRepository: ILoanRepository = ctx.context.loanRepository
    return loanRepository.add(loan)
}
