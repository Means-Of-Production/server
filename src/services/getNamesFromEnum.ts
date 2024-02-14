import {BorrowerVerificationFlags, ThingStatus} from "@meansofproduction/domain"

export function getNamesFromEnum<T>(t: T): string[] {
    // @ts-ignore
    return Object.keys(t).filter(enumMember => parseInt(enumMember, 10) >= 0).map(e => t[e])
}