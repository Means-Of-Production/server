import {getRequestedPerson} from "../services/getRequestedPerson.js";

export async function allLibraries(parent, args, context, _info) {
    const user = await context.authenticate()
    const repo = context.context.libraryRepository
    return repo.getAll()
}

export function librariesForPerson(parent, args, context, _info){
    const libraryRepository = context.context.libraryRepository
    const person = getRequestedPerson(context, args)
    return libraryRepository.getLibrariesPersonCanUse(person)
}