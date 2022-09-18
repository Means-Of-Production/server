import {Person} from "@meansofproduction/domain"
import {Context} from "../context"

export function getCurrentUser(context: Context, args: any): Person {
    const personRepository = context.personRepository
    // TODO person should come from authorization, not client
    const person = personRepository.get(args.person.id)
    if(!person){
        throw new Error(`Person id ${args.person.id} cannot be found`)
    }
    return person
}