import {request} from "./HttpClient"; 
import LinkNotFoundError from "./LinkNotFoundError";

export interface ResourceLink {
    rel:string; 
    href:string; 
    method?:string; 
}

export interface ResourceParams {
    url?:string; 
    resource?:any; 
    client?:HyperClient; 
}

function setUrlParameters(url:string, templateParameters:any, queryParameters?:any):string {

    if (typeof url === "undefined") {
        throw new Error("url must be set"); 
    }

    if (typeof templateParameters !== "undefined") {
        for (let propName in templateParameters) {
            if (templateParameters.hasOwnProperty(propName)) {
                url = url.replace("{" + propName + "}", encodeURIComponent(templateParameters[propName])); 
            }
        }
    }

    if (typeof queryParameters !== "undefined") {
        for (let prop in queryParameters) {
            if (queryParameters.hasOwnProperty(prop)) {
                if (url.indexOf("?") === -1) {
                    url += "?"; 
                }else {
                    url += "&"; 
                }

                let values = queryParameters[prop]; 
                if (Array.isArray(values) === false) {
                    values = [values]; 
                }
                values.forEach(val =>  {
                    url += prop + "=" + encodeURIComponent(val); 
                }); 
            }
        }
    }

    return url.replace(new RegExp("#", "g"), "%23"); 
}

export interface Resource <TData  = any>  {
    fetch(parameters?:any):Promise <Resource <TData>>; 
    getResource(): TData; 
    action(rel:string,method:string, body?:any, parameters?:any):Promise <any>;
    patch(body?:any, parameters?:any):Promise <any>;
    post(body?:any, parameters?:any):Promise <any>;
    put(body?:any, parameters?:any):Promise <any>;
    getLink(rel:string):ResourceLink; 
    hasLink(rel:string):boolean;
    followLink <RType = any> (rel:string, templateParameters?:any, queryParameters?:any):Resource <RType> ; 
}

 class LazyResource <TData> implements Resource <TData>  {

    private resource:Resource <TData>; 

    constructor(private linkMethod:Function, private parentResource:Resource <TData>, private  client:HyperClient) {

    }

    public async fetch(parameters?:any):Promise <Resource<TData>>  {

        if (!!this.resource) {
            return this.resource.fetch(parameters); 
        }

        await this.parentResource.fetch(); 
        let fetchUrl = this.linkMethod(); 
        this.resource = new BaseResource( {url:fetchUrl.href }); 
        await this.resource.fetch(parameters); 
        return this.resource; 
    }

    public getResource(): TData  {
        return this.resource.getResource(); 
    }

    public put(body?:any, parameters?:any):Promise <any>  {
        return this.resource.put(body, parameters); 
    }

    public patch(body?:any, parameters?:any):Promise <any>  {
        return this.resource.patch(body, parameters); 
    }

    public post(body?:any, parameters?:any):Promise <any>  {
        return this.resource.post(body, parameters); 
    }

    public action(rel:string, body?:any, parameters?:any):Promise <any>  {
        return this.resource.action(rel, body, parameters); 
    }

    public followLink <RType> (rel:string, templateParameters?:any, queryParameters?:any):Resource <RType>  {

        let self = this; 
        if (this.resource && typeof this.resource.getResource() !== "undefined") {
            return this.resource.followLink(rel, templateParameters); 
        }

        let getLazy = () =>  {

            let resource = self.resource.getResource();
            let rootLink = this.client.getLink(rel,resource);

            if (typeof rootLink == "undefined") {
                throw new LinkNotFoundError(rootLink)
            }

            let resourceLink = rootLink; 
            let tempLink = setUrlParameters(resourceLink, templateParameters, queryParameters); 
            return {href:tempLink, rel:rel, method:"GET" }; 
        }; 

        return new LazyResource <RType> (getLazy, <any> this, this.client); 
    }

    public getLink(rel:string):ResourceLink {
        return this.resource.getLink(rel); 
    }

    public hasLink(rel:string):boolean {
        return this.resource.hasLink(rel); 
    }
}

 class BaseResource <TData> implements Resource <TData>  {

    private resourceUrl; 
    private resource: TData; 
    private isLoaded = false; 
    private client:HyperClient; 

    constructor(resourceParams?:ResourceParams) {
        
        if (typeof resourceParams === "undefined") {
            throw new Error("Parameters missing"); 
        }

        this.client = resourceParams.client

        if (typeof resourceParams.resource !== "undefined") {
            this.resource = resourceParams.resource; 
            this.isLoaded = true; 
            this.resourceUrl = this.client.getSelf(this.resource); 
        } else {this.resourceUrl = resourceParams.url; }
    }

    public async fetch(templateParameters?:any, queryParameters?:any):Promise <Resource<TData>>  {

        let usedUrl = setUrlParameters(this.resourceUrl, templateParameters); 

        // add query parameters

        for (let prop in queryParameters) {
            if (queryParameters.hasOwnProperty(prop)) {
                if (usedUrl.indexOf("?") === -1) {
                    usedUrl += "?"; 
                }else {
                    usedUrl += "&"; 
                }

                let values = queryParameters[prop]; 
                if (Array.isArray(values) === false) {
                    values = [values]; 
                }

                values.forEach(val =>  {
                    usedUrl += prop + "=" + encodeURIComponent(val); 
                }); 
            }
        }

        let headers = []; 
 
        let options =  {
            "method":"GET", 
            "url":usedUrl, 
            "headers":headers
        }; 

         this.resource = await request(options); 
         return this; 
    }

    public getResource():TData  {
        return this.resource; 
    }

    public async post(body?:any, parameters?:any):Promise<any>  {
        return await this._action(this.resourceUrl,"POST",body);
    }

    public async put(body?:any, parameters?:any):Promise<any>  {
        return await this._action(this.resourceUrl,"PUT",body);
    }

    public async patch(body?:any, parameters?:any):Promise<any>  {
        return await this._action(this.resourceUrl,"PATCH",body);
    }

    public async action(rel:string,method:string, body?:any, parameters?:any):Promise<any>  {
        let link = this.getLink(rel); 

        if (!link) {
            throw new LinkNotFoundError(rel);
        }

        let url = setUrlParameters(link.href, parameters); 
        return await this._action(url,method,body);
    }

    private async _action(url, method, body){
        let headers =  {}; 

        let version = this.client.getVersion(this.resource);

        if (typeof  version !== "undefined") {
            headers =  {"version":version }; 
        }
      
        let options =  {
            "method":method, 
            "url":url, 
            headers:headers, 
            data:JSON.stringify(body), 
            contentType:"application/json; charset=utf-8"
        }; 

        return await request(options); 
    }

    public getLink(rel:string):ResourceLink {
        if (this.isLoaded === false) {
            throw new Error("Resource not loaded. Use fetch first"); 
        }

        return {rel:rel, href: this.client.getLink(rel, this.resource)};
    }

    public hasLink(rel:string):boolean {
       return typeof this.getLink(rel) !== "undefined";
    }

    public followLink<RType> (rel:string, templateParameters?:any, queryParameters?:any):Resource < RType >  {

        let getLazy = () =>  {

            if (typeof this.resource === "undefined") {
                throw new Error(`resource ${this.resourceUrl} not loaded`); 
            }

            let resourceLink = this.client.getLink(rel, this.resource);

            let tempLink = setUrlParameters(resourceLink, templateParameters, queryParameters); 
            return {href:tempLink, rel:rel, method:"GET" }; 
        }; 

        if (this.isLoaded === false) {
            return new LazyResource <RType> (getLazy,  <any> this,this.client); 
        }

        let resourceLink = getLazy(); 

        return new BaseResource( {url:resourceLink.href}); 
    }
}

export function getClient(options):HyperClient {
    return new HyperClientImplementation(options); 
}

export interface HyperClient {
    getSelf:(data:any)=>string;
    getLink:(rel:string, data:any) =>string;
    getVersion:(data:any)=>string;
    getResource <TData = any> (resourceUrl:string):Resource <TData> ; 
    wrapResource <TData  = any> (resource:TData ):Resource <TData> ; 
}

class HyperClientImplementation implements HyperClient {

    public getSelf:(data:any)=>string;
    public getLink:(rel:string, data:any) =>string;
    public getVersion:(data:any)=>string;

    constructor(options:any) {
       this.getLink = options.getLink;
       this.getVersion = options.getVersion;
       this.getSelf = options.getSelf;
    }

    /**
     * Gets a resource
     * @param resourceUrl the url of the resource
     * @param cache set to true if the resource should be cached
     */
    public getResource <TData> (resourceUrl:string):Resource <TData>  {
        return new BaseResource( {url:resourceUrl, client:this }); 
    }

    public wrapResource<TData> (resource:TData ):Resource <TData>  {
        return new BaseResource( {resource:resource, client:this }); 
    }
}