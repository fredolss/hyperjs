export default class LinkNotFoundError extends  Error {
    public rel; 

    constructor(rel:string) {
        super(`link: "${rel}" not found`);
        this.rel = rel;
        this.name = "LinkNotFoundError";
    }
}