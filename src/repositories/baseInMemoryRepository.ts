import {IRepository} from '@meansofproduction/domain'
import {ConflictingKeyException, ResourceNotFoundException} from "../valueItems/exceptions";


export abstract class BaseInMemoryRepository<T> implements IRepository<T> {
    private readonly items: Map<string, T>

    protected constructor() {
        this.items = new Map<string, T>()
    }

    protected abstract getIdFromEntity(entity: T): string

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