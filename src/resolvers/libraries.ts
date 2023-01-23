import {getRequestedPerson} from "../services/getRequestedPerson.js";
import {
    Distance,
    DistributedLibrary,
    ILibrary,
    EmailAddress,
    MoneyFactory, MOPServer,
    Person,
    PersonName, PhysicalArea, PhysicalLocation
} from "@meansofproduction/domain";
import {IContext} from "../context.js";

export function allLibraries(parent, args, context, info) {
    const repo = context.libraryRepository
    return repo.getAll()
}

export function librariesForPerson(parent, args, context, _info){
    const libraryRepository = context.libraryRepository
    const person = getRequestedPerson(context, args)
    return libraryRepository.getLibrariesPersonCanUse(person)
}

export async function createDistributedLibrary(parent, args, context: IContext, _info): Promise<ILibrary> {
    const person = args.existingAdministrator
        ? await context.personRepository.get(args.existingAdministrator.id)
        : new Person(
            "",
            new PersonName(args.existingAdministrator.name.firstName, args.existingAdministrator.name.lastName, args.existingAdministrator.n.middleName),
            [new EmailAddress(args.existingAdministrator)]
        );

    const moneyFactory = new MoneyFactory(args.maxFees.currencyName)

    const area = new PhysicalArea(
        new PhysicalLocation(args.location.centerPoint.latitude, args.location.centerPoint.longitude, args.location.centerPoint.address),
        Distance.fromKilometers(args.location.radius)
    )

    const library = new DistributedLibrary(
        "",
        args.name,
        person,
        moneyFactory.getEmptyMoney(),
        null,
        [],
        moneyFactory,
        area,
        new MOPServer(new URL(context.serverUrl), context.serverVersion),
        null,
        null,
        null
    )

    return await context.libraryRepository.add(library)
}