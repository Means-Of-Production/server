import {IAuthenticationService} from "./IAuthenticationService.js";
import {User} from "../../entities/User.js";
import {EmailAddress} from "@meansofproduction/domain";

export class NullAuthenticationService implements IAuthenticationService{
    async getFromToken(token: string): Promise<User | null> {
        return new User("fake", new EmailAddress("test@test.com"))
    }

    async getToken(user: User): Promise<string> {
        return "testToken"
    }

    register(user: User): Promise<User> {
        return this.getFromToken("testToken")
    }

}