import {IRepository} from '@meansofproduction/domain'
import {ConflictingKeyException, ResourceNotFoundException} from "../valueItems/exceptions";
import {IEntity} from "@meansofproduction/domain/lib/cjs/entities/IEntity";


export abstract class BaseInMemoryRepository<T extends IEntity> implements IRepository<T> {
    private readonly items: Map<string, T>

    protected constructor() {
        this.items = new Map<string, T>()
    }

    protected abstract getIdFromEntity(entity: T): string
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
}