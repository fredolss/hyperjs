export default class LinkNotFoundError extends  Error {

    constructor(public rel:string) {
        super(`link: "${rel}" not found`);
        this.name = "LinkNotFoundError";
    }
}