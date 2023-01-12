import {IAuthenticationService} from "./IAuthenticationService";
import {User} from "../entities/user";
import {PersonName} from "@meansofproduction/domain";

export class Auth0AuthenticationService implements IAuthenticationService {
    async getForToken(token: string): Promise<User> {
        return new User("test", new PersonName("Testy", "McTesterson"));
    }
}
