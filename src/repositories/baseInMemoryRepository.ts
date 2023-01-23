import {EntityNotAssignedIdError, IRepository} from '@meansofproduction/domain'
import {v4 as uuidv4} from 'uuid'
import {ConflictingKeyException, ResourceNotFoundException} from "../valueItems/exceptions.js"
import {IEntity} from "@meansofproduction/domain/lib/cjs/entities/IEntity"


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

    public async getAll(): Promise<Iterable<T>> {
        return this.items.values()
    }

    public async get(id: string): Promise<T | null> {
        if(!this.items.has(id)){
            return null;
        }
        const item = this.items.get(id);
        if(!item){
            return null;
        }
        return item;
    }

    public async add(item: T): Promise<T> {
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

    public async update(item: T): Promise<T> {
        const id = this.getIdFromEntity(item)
        if(!this.items.has(id)){
            throw new ResourceNotFoundException()
        }
        this.items.set(id, item)

        return item
    }

    public async delete(id: string): Promise<boolean> {
        if(this.items.has(id)){
            this.items.delete(id)
        }
        return true
    }

    protected newId(): string {
        return uuidv4()
    }
}