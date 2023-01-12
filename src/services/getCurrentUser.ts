import {Person} from "@meansofproduction/domain"
import {IContext} from "../index"
import {User} from "../entities/user";

export function getCurrentUser(context: IContext): User {
    const personRepository = context.personRepository
    return context.user
}