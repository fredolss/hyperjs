export default class HttpError extends  Error {
    public status; 
    public statusText;
    public data; 
    public url;

    constructor(url:string, status:number, statusText:string, data:any) {
        super(statusText);
        this.url = url;
        this.status = status;
        this.status = statusText;
        this.data = data;
        this.name = "HttpError";
    }
}