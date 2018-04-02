export default class UrlMustBeSetError extends  Error {
    constructor() {
        super("url must be set");
        this.name = "UrlMustBeSetError";
    }
}