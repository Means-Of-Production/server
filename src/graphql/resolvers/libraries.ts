import {IContext} from "../../index";
import {ILibrary} from "@meansofproduction/domain";

export function allLibraries(parent: any, args: any, contextValue: IContext, info: any): Iterable<ILibrary> {
    const repo = contextValue.libraryRepository;
    return repo.getAll();
}