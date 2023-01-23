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
    const person = args.library.existingAdministrator
        ? await context.personRepository.get(args.library.existingAdministrator.id)
        : new Person(
            "",
            new PersonName(
                args.library.newAdministrator.name.firstName,
                args.library.newAdministrator.name.lastName,
                args.library.newAdministrator.name.middleName),
            [new EmailAddress(args.library.newAdministrator.email)]
        );

    const moneyFactory = new MoneyFactory(args.maxFees.currencyName)

    const area = new PhysicalArea(
        new PhysicalLocation(
            args.library.location.centerPoint.latitude,
            args.library.location.centerPoint.longitude,
            args.library.location.centerPoint.address
        ),
        Distance.fromKilometers(args.library.location.radius)
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