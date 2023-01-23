import {IContext} from "../context.js";
import {EmailAddress, Person, PersonName} from "@meansofproduction/domain";

export async function addPerson(parent, args, context: IContext, _info): Promise<Person> {
    const personRepo = context.personRepository

    const person = new Person(
        "",
        new PersonName(
            args.person.name.firstName,
            args.person.name.lastName,
            args.person.name.middleName
        ),
        [new EmailAddress(args.person.email)]
    )
    return personRepo.add(person)
}