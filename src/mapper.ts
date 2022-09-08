import {DistributedLibrary, ILibrary, Person, SimpleLibrary} from "@meansofproduction/domain"

function getLibraryType(entity: ILibrary): string {
    if(entity instanceof SimpleLibrary){
        return "Simple"
    }
    if(entity instanceof DistributedLibrary){
        return "Distributed"
    }
    throw new Error(`Unknown library type`)
}

export function fromLibrary(entity: ILibrary) {
    return {
        id: entity.id,
        name: entity.name,
        type: getLibraryType(entity),
        administrator: fromPerson(entity.administrator)
    }
}

export function fromPerson(person: Person){
    return {
        id: person.id,
        firstName: person.name.firstName,
        middleName: person.name.middleName,
        lastName: person.name.lastName,
        emails: person.emails.map(e => e.value)
    }
}