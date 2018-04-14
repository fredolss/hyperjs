export default class HttpError extends  Error {

    constructor(public url:string, public status:number, public statusText:string, public data:any) {
        super(statusText);
        this.name = "HttpError";
    }
}