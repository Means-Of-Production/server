import {getRequestedPerson} from "../services/getRequestedPerson.js";

export function allLibraries(parent, args, context, info) {
    const repo = context.libraryRepository
    return repo.getAll()
}

export function librariesForPerson(parent, args, context, _info){
    const libraryRepository = context.libraryRepository
    const person = getRequestedPerson(context, args)
    return libraryRepository.getLibrariesPersonCanUse(person)
}