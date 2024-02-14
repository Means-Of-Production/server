import {EmailAddress} from "@meansofproduction/domain";
import {UserRoles} from "../valueItems/userRoles.js";

export class User{
    public readonly emailAddress?: EmailAddress
    public readonly token?: String

    public readonly roles: UserRoles[]

    constructor(emailAddress: EmailAddress | undefined = undefined, token: String = undefined, roles: UserRoles[] = []) {
        this.emailAddress = emailAddress
        this.token = token
        this.roles = roles
    }
}