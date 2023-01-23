import {IContext} from "../context"
import {Person} from "@meansofproduction/domain"

export async function getRequestedPerson(context: IContext, args: any): Promise<Person> {
    const personRepository = context.personRepository
    const person = await personRepository.get(args.person.id)
    if(!person){
        throw new Error(`Person id ${args.person.id} cannot be found`)
    }
    return person
}