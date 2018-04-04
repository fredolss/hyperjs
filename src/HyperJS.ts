import {request, RequestOptions } from "./HttpClient"; 
import LinkNotFoundError from "./errors/LinkNotFoundError"; 
import UrlMustBeSetError from "./errors/UrlMustBeSetError";
import ResourceNotLoadedError from "./errors/ResourceNotLoadedError";
import {setParameters} from "./TemplateParameters";

export interface ResourceLink {
    rel:string; 
    href:string; 
    method?:string; 
}

export interface ResourceParams {
    url?:string; 
    resource?:any; 
    client?:InternalResourceBuilder; 
}

export interface Resource < TData = any >  {
    fetch(parameters?:any):Promise < Resource < TData >> ; 
    data:TData; 
    action(rel:string, method:string, body?:any, parameters?:any):Promise < any > ; 
    patch(body?:any, parameters?:any):Promise < any > ; 
    post(body?:any, parameters?:any):Promise < any > ; 
    put(body?:any, parameters?:any):Promise < any > ; 
    delete(body?:any, parameters?:any):Promise < any > ; 
    getLink(rel:string):ResourceLink; 
    hasLink(rel:string):boolean; 
    followLink < RType = any > (rel:string, templateParameters?:any, queryParameters?:any):Resource < RType > ; 
}

interface InternalResourceBuilder extends ResourceBuilder {
    getSelf:(data:any) => string; 
    getLink:(rel:string, data:any) => string;
    getRequestOptions:(resource:Resource,options:RequestOptions) => RequestOptions; 
}

type getRequestOptions = (resource:Resource,options:RequestOptions) => CustomRequestOptions;
type getLink = (rel:string, data:any) => string;
type getSelf = (data:any) => string; 

export interface CustomRequestOptions {
    method?:string, 
    url?:string, 
    data?:string | object, 
    headers?:object,
    contentType?:string;
}

export interface ResourceBuilder {
    withSelfCallback:(callback: (data:any) => string) =>ResourceBuilder; 
    withLinkCallback:(callback:(rel:string, data:any) => string) => ResourceBuilder;
    withRequestOptions: (callback:(resource:Resource,options:RequestOptions) => CustomRequestOptions) => ResourceBuilder;
    getResource < TData = any > (resourceUrl:string):Resource < TData > ; 
    wrapResource < TData = any > (resource:TData):Resource < TData > ; 
}

 class ProxyResource < TData > implements Resource < TData >  {

    private resource:Resource < TData > ; 

    constructor(private linkMethod:Function, private parentResource:Resource < TData > , private  client:InternalResourceBuilder) {

    }

    public async fetch(parameters?:any):Promise < Resource < TData >>  {

        if (!!this.resource) {
            return this.resource.fetch(parameters); 
        }

        await this.parentResource.fetch(); 
        let fetchUrl = this.linkMethod(); 
        this.resource = this.client.getResource(fetchUrl.href); 
        await this.resource.fetch(parameters); 
        return this.resource; 
    }

    public get data():TData {
        return this.resource.data; 
    }

    public put(body?:any, parameters?:any):Promise < any >  {
        return this.resource.put(body, parameters); 
    }

    public patch(body?:any, parameters?:any):Promise < any >  {
        return this.resource.patch(body, parameters); 
    }

    public post(body?:any, parameters?:any):Promise < any >  {
        return this.resource.post(body, parameters); 
    }

    public delete(body?:any, parameters?:any):Promise < any >  {
        return this.resource.delete(body, parameters); 
    }

    public action(rel:string, body?:any, parameters?:any):Promise < any >  {
        return this.resource.action(rel, body, parameters); 
    }

    public followLink < RType > (rel:string, templateParameters?:any, queryParameters?:any):Resource < RType >  {

        if (this.resource && typeof this.resource.data !== "undefined") {
            return this.resource.followLink(rel, templateParameters); 
        }

        let getLazy = () =>  {

            let resource = this.resource.data; 
            let rootLink = this.client.getLink(rel, resource); 

            if (typeof rootLink == "undefined") {
                throw new LinkNotFoundError(rel)
            }

            let resourceLink = rootLink; 
            let tempLink = setParameters(resourceLink, templateParameters, queryParameters); 
            return {href:tempLink, rel:rel, method:"GET"}; 
        }; 

        return new ProxyResource < RType > (getLazy,  < any > this, this.client); 
    }

    public getLink(rel:string):ResourceLink {
        return this.resource.getLink(rel); 
    }

    public hasLink(rel:string):boolean {
        return this.resource.hasLink(rel); 
    }
}

 class BaseResource < TData > implements Resource < TData >  {

    private resourceUrl; 
    private resource:TData; 
    private client:InternalResourceBuilder; 

    constructor(resourceParams?:ResourceParams) {
        
        if (typeof resourceParams === "undefined") {
            throw new Error("resourceParams must be set"); 
        }

        if(typeof resourceParams.client === "undefined"){
            throw new Error("client must be set");
        }

        this.client = resourceParams.client

        if (typeof resourceParams.resource !== "undefined") {
            this.resource = resourceParams.resource; 
            this.resourceUrl = this.client.getSelf(this.resource); 
        }else {this.resourceUrl = resourceParams.url; }
    }

    public async fetch(templateParameters?:any, queryParameters?:any):Promise < Resource < TData >>  {
  
        let usedUrl = setParameters(this.resourceUrl, templateParameters, queryParameters); 

        let options =  {
            method:"GET", 
            url:usedUrl, 
            headers:[]
        }; 

         this.resource = await this.makeRequest(options);
         return this; 
    }

    public get data():TData {
        return this.resource; 
    }

    public async post(body?:any, parameters?:any):Promise < any >  {
        return await this._action(this.resourceUrl, "POST", body); 
    }

    public async put(body?:any, parameters?:any):Promise < any >  {
        return await this._action(this.resourceUrl, "PUT", body); 
    }

    public async patch(body?:any, parameters?:any):Promise < any >  {
        return await this._action(this.resourceUrl, "PATCH", body); 
    }

    public async delete(body?:any, parameters?:any):Promise < any >  {
        return await this._action(this.resourceUrl, "DELETE", body); 
    }

    public async action(rel:string, method:string, body?:any, parameters?:any):Promise < any >  {
        let link = this.getLink(rel); 

        if ( ! link) {
            throw new LinkNotFoundError(rel); 
        }

        let url = setParameters(link.href, parameters); 
        return await this._action(url, method, body); 
    }

    private async _action(url, method, body) {
        let headers =  {}; 
 
        let options =  {
            method:method, 
            url:url, 
            headers:headers, 
            data:JSON.stringify(body), 
            contentType:"application/json; charset=utf-8"
        };
      
        return this.makeRequest(options);
    }

    protected async makeRequest(options:RequestOptions){
        
        let customOptions =  this.client.getRequestOptions(this,options); 

        if(typeof customOptions !== "undefined"){
            if(typeof customOptions.method != "undefined"){
                options.method = customOptions.method;
            }
    
            for(let key in customOptions.headers){
                options.headers[key] = customOptions.headers[key];
            }
        }
      
        return await request(options); 
    }

    public getLink(rel:string):ResourceLink {
        if (typeof this.resource  === "undefined") {
            throw new  ResourceNotLoadedError(this.resourceUrl); 
        }

        return {rel:rel, href:this.client.getLink(rel, this.resource)}; 
    }

    public hasLink(rel:string):boolean {
       return typeof this.getLink(rel) !== "undefined"; 
    }

    public followLink < RType > (rel:string, templateParameters?:any, queryParameters?:any):Resource < RType >  {

        let getLazy = () =>  {

            if (typeof this.resource === "undefined") {
                throw new ResourceNotLoadedError(this.resourceUrl); 
            }

            let resourceLink = this.client.getLink(rel, this.resource); 

            let tempLink = setParameters(resourceLink, templateParameters, queryParameters); 
            return {href:tempLink, rel:rel, method:"GET"}; 
        }; 

        if (typeof this.resource  === "undefined") {
            return new ProxyResource < RType > (getLazy,  < any > this, this.client); 
        }

        let resourceLink = getLazy(); 
        this.client.getResource(resourceLink.href);
    }
}

export function builder():ResourceBuilder {
    return new DefaultResourceBuilder(); 
}

class DefaultResourceBuilder implements InternalResourceBuilder,ResourceBuilder {

    private _getSelf;
    private _getLink;
    private _withRequestOptions;

    public  withSelfCallback = (callBack:getSelf)  => {
        this._getSelf = callBack;
        return this; 
    }

    public  withLinkCallback = (callBack:getLink) =>  {
        this._getLink = callBack;
        return this; 
    }

    public withRequestOptions = (callBack:getRequestOptions)=>{
        this._withRequestOptions = callBack;
        return this; 
    }

    public getRequestOptions = (resource:Resource,options:RequestOptions) => {
        if(typeof this._withRequestOptions !== "function"){
            return options;
        }
        return this._withRequestOptions(resource,options);
    }

    public getSelf = (data:any) => {
        return this._getSelf(data);
    }
    
    public getLink = (rel:string, data:any) => {
        return this._getLink(rel,data);
    }

    constructor() {
    }

    /**
     * Gets a Resource
     * @param resourceUrl the url of the resource
     */
    public getResource < TData > (resourceUrl:string):Resource < TData >  {
        return new BaseResource( {url:resourceUrl, client:this }); 
    }

     /**
     * Creates a Resource based on the json data provided
     * @param resource the json data
     */
    public wrapResource < TData > (resource:TData):Resource < TData >  {
        return new BaseResource( {resource:resource, client:this }); 
    }
}