import {User} from "../entities/user";

export interface IAuthenticationService {
    getForToken(token: string) : Promise<User>;
}