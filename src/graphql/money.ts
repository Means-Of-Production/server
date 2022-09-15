import {enumType, objectType} from "nexus"
import {getNamesFromEnum} from "../services/getNamesFromEnum"
import {BorrowerVerificationFlags, FeeStatus} from "@meansofproduction/domain"
import {Loan} from "./loan"

export const Money = objectType({
    name: "Money",
    definition(t) {
        t.nonNull.float("amount")
        t.nonNull.string("currencyName")
        t.nonNull.string("symbol")
    }
})

export const FeeStatusObj = enumType({
    name: "FeeStatus",
    members: getNamesFromEnum(FeeStatus)
})

export const LibraryFee = objectType({
    name: "LibraryFee",
    definition(t){
        t.nonNull.field("status", {type: FeeStatusObj})
        t.nonNull.field("chargedFor", {type: Loan})
        t.nonNull.field("amount", {type: Money})
    }
})