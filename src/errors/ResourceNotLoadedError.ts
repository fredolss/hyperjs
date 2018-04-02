export default class ResourceNotLoadedError extends  Error {
 
    constructor(resourceUrl) {
        super(`resource ${resourceUrl} not loaded`);
        this.name = "ResourceNotLoadedError";
    }
}