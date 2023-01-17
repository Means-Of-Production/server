import {IContext} from "../context"
import {Person} from "@meansofproduction/domain"

export function getRequestedPerson(context: IContext, args: any): Person {
    const personRepository = context.personRepository
    const person = personRepository.get(args.person.id)
    if(!person){
        throw new Error(`Person id ${args.person.id} cannot be found`)
    }
    return person
}