import {DistributedLibrary, SimpleLibrary} from "@meansofproduction/domain"
import {allLibraries, librariesForPerson, createDistributedLibrary} from "./libraries.js"
import {loansForLibrary, loansForPerson} from "./loans.js"
import {addPerson} from "./person.js"

export * from './libraries.js'

export const resolvers = {
    Library: {
        __resolveType(library, contextValue, info){
            if(library instanceof SimpleLibrary){
                return 'SimpleLibrary'
            }
            if(library instanceof DistributedLibrary){
                return 'DistributedLibrary'
            }
            return null
        }
    },
    Query: {
        allLibraries,
        librariesForPerson,
        loansForPerson,
        loansForLibrary
    },
    Mutation: {
        createDistributedLibrary,
        addPerson
    }
};