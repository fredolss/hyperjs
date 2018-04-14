export default class ResourceNotLoadedError extends  Error {
 
    constructor(resourceUrl:string) {
        super(`resource ${resourceUrl} not loaded`);
        this.name = "ResourceNotLoadedError";
    }
}