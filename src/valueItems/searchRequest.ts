export class SearchRequest {
    readonly name: string | undefined

    constructor(name: string | undefined) {
        this.name = name
    }
}