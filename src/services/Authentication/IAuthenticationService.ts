import {User} from "../../entities/user.js";

export interface IAuthenticationService {
    getFromToken(token: string) : Promise<User | null>
    register(user: User): Promise<User>
    getToken(user: User): Promise<string>
}