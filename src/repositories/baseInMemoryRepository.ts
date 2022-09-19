import {EntityNotAssignedIdError, IRepository} from '@meansofproduction/domain'
import {v4 as uuidv4} from 'uuid'
import {ConflictingKeyException, ResourceNotFoundException} from "../valueItems/exceptions"
import {IEntity} from "@meansofproduction/domain/lib/cjs/entities/IEntity"
import internal from "stream"


export abstract class BaseInMemoryRepository<T extends IEntity> implements IRepository<T> {
    private readonly items: Map<string, T>

    protected constructor() {
        this.items = new Map<string, T>()
    }

    protected getIdFromEntity(entity: T): string {
        if(!entity.id){
            throw new EntityNotAssignedIdError(`Entity ${entity.constructor.name} does not yet have an id, please save it!`)
        }
        return entity.id
    }

    protected abstract create(entity: T): T

    public getAll(): Iterable<T> {
        return this.items.values()
    }

    public get(id: string): T | null {
        if(!this.items.has(id)){
            return null;
        }
        const item = this.items.get(id);
        if(!item){
            return null;
        }
        return item;
    }

    public add(item: T): T {
        if(!item.id){
            item = this.create(item)
        }
        const id = this.getIdFromEntity(item);
        if(this.items.has(id)){
            throw new ConflictingKeyException()
        }
        this.items.set(id, item)

        return item
    }

    public update(item: T): T {
        const id = this.getIdFromEntity(item)
        if(!this.items.has(id)){
            throw new ResourceNotFoundException()
        }
        this.items.set(id, item)

        return item
    }

    public delete(id: string): boolean {
        if(this.items.has(id)){
            this.items.delete(id)
        }
        return true
    }

    protected newId(): string {
        return uuidv4()
    }
}