import {IContext} from "../context.js";
import {EmailAddress, Person, PersonName} from "@meansofproduction/domain";

export async function addPerson(parent, args, context: IContext, _info): Promise<Person> {
    const personRepo = context.personRepository

    const person = new Person(
        "",
        new PersonName(
            args.name.firstName,
            args.name.lastName,
            args.name.middleName
        ),
        [new EmailAddress(args.email)]
    )
    return personRepo.add(person)
}