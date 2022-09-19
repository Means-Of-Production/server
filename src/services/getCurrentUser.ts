import {Person} from "@meansofproduction/domain"
import {Context} from "../context"

export function getCurrentUser(context: Context, args: any): Person {
    const personRepository = context.personRepository
    // TODO person should come from authorization, not client
    const person = personRepository.get(args.personID)
    if(!person){
        throw new Error(`Person id ${args.personID} cannot be found`)
    }
    return person
}