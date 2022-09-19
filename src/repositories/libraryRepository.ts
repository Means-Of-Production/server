import {BaseInMemoryRepository} from "./baseInMemoryRepository";
import {
    ILibrary, ILibraryRepository, Person, SimpleLibrary, DistributedLibrary, PhysicalArea
} from "@meansofproduction/domain"

export class LibraryRepository extends BaseInMemoryRepository<ILibrary> implements ILibraryRepository {
    constructor(libraries: Iterable<ILibrary> = []) {
        super();

        for(const lib of libraries){
            this.add(lib)
        }
    }

    protected getIdFromEntity(entity: ILibrary): string {
        if(!entity.id){
            return entity.name
        }
        return entity.id
    }

    * getLibrariesPersonCanUse(person: Person): Iterable<ILibrary> {
        for(const library of this.getAll()){
            for(const borrower of library.borrowers){
                if(borrower.person.id == person.id){
                    yield library;
                }
            }
        }
    }

    protected create(entity: ILibrary): ILibrary {
        if(entity instanceof (SimpleLibrary)){
            return new SimpleLibrary(
                this.newId(),
                entity.name,
                entity.administrator,
                entity.location,
                entity.waitingListFactory,
                entity.maxFinesBeforeSuspension,
                entity.getLoans(),
                entity.moneyFactory,
                entity.mopServer,
                entity.feeSchedule
            )
        }
        if(entity instanceof DistributedLibrary) {
            return new DistributedLibrary(
                this.newId(),
                entity.name,
                entity.administrator,
                entity.maxFinesBeforeSuspension,
                entity.waitingListFactory,
                entity.getLoans(),
                entity.moneyFactory,
                entity.location as PhysicalArea,
                entity.mopServer,
                entity.feeSchedule,
                entity.defaultLoanTime
            )
        }
        throw new Error(`Don't know how to handle library of type ${entity} yet!`)
    }
}