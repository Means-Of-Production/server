import {EmailAddress} from "@meansofproduction/domain";

export class User{
    public readonly emailAddress: EmailAddress | undefined
    public readonly token: String
    constructor(token: String, emailAddress: EmailAddress | undefined = undefined) {
        this.emailAddress = emailAddress
        this.token = token
    }
}