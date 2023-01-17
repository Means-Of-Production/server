import {IAuthenticationService} from "./IAuthenticationService";
import {User} from "../entities/User.js";

import jwt from "jwt-promisify";
import {Algorithm} from "jwt-promisify";

import jwksClient, {Jwk} from "jwks-rsa-promisified";

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

async function getKey(header) {
    const jwkeys = await client.getSigningKeysAsync()
    const res = jwkeys.map(j => getKeyFromJwk(j))
    return res
}

function getKeyFromJwk(j: Jwk){
    if(j.publicKey){
        return j.publicKey
    }
    return j.rsaPublicKey
}

export async function isTokenValid(token): Promise<boolean> {
    if (token) {
        const bearerToken = token.split(" ");
        const algos: Algorithm[] = ["RS256"]
        const options = {
            audience: process.env.API_IDENTIFIER,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
            algorithms: algos
        }
        const decoded = await jwt.decode(bearerToken[1])
        const header = decoded.header
        const keys = await getKey(header)
        const res = await jwt.verify(bearerToken[1], keys[0], options)

        return res != null
    }
    
    throw new Error("No token provided" );
}

export class Auth0AuthenticationService implements IAuthenticationService{
    async getFromToken(token: string): Promise<User | null> {
        const validToken = await isTokenValid(token)
        if(validToken === true){
            return new User(token)
        }

        return null
    }

    async getToken(user: User): Promise<string> {
        return ""
    }

    async register(user: User): Promise<User> {
        throw new Error("Not implemented")
    }
}