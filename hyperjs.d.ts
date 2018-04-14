declare module 'hyperjs/errors/HttpError' {
	export default class HttpError extends Error {
	    url: string;
	    status: number;
	    statusText: string;
	    data: any;
	    constructor(url: string, status: number, statusText: string, data: any);
	}

}
declare module 'hyperjs/HttpClient' {
	export interface RequestOptions {
	    method: string;
	    url: string;
	    data?: any;
	    headers?: any;
	    contentType?: string;
	}
	export function request(options: RequestOptions): Promise<any>;

}
declare module 'hyperjs/errors/LinkNotFoundError' {
	export default class LinkNotFoundError extends Error {
	    rel: string;
	    constructor(rel: string);
	}

}
declare module 'hyperjs/errors/UrlMustBeSetError' {
	export default class UrlMustBeSetError extends Error {
	    constructor();
	}

}
declare module 'hyperjs/errors/ResourceNotLoadedError' {
	export default class ResourceNotLoadedError extends Error {
	    constructor(resourceUrl: string);
	}

}
declare module 'hyperjs/TemplateParameters' {
	export function setParameters(url: string, templateParameters: any, queryParameters?: any): string;

}
declare module 'hyperjs/HyperJS' {
	import { RequestOptions } from 'hyperjs/HttpClient';
	export interface ResourceLink {
	    rel: string;
	    href: string;
	    method?: string;
	}
	export interface Resource<TData = any> {
	    fetch(parameters?: any): Promise<Resource<TData>>;
	    data: TData;
	    action(rel: string, method: string, body?: any, parameters?: any): Promise<any>;
	    patch(body?: any, parameters?: any): Promise<any>;
	    post(body?: any, parameters?: any): Promise<any>;
	    put(body?: any, parameters?: any): Promise<any>;
	    delete(body?: any, parameters?: any): Promise<any>;
	    getLink(rel: string): ResourceLink;
	    hasLink(rel: string): boolean;
	    followLink<RType = any>(rel: string, templateParameters?: any, queryParameters?: any): Resource<RType>;
	}
	export interface CustomRequestOptions {
	    method?: string;
	    url?: string;
	    data?: string | object;
	    headers?: object;
	    contentType?: string;
	}
	export interface ResourceBuilder {
	    withSelfCallback: (callback: (data: any) => string) => ResourceBuilder;
	    withLinkCallback: (callback: (rel: string, data: any) => string) => ResourceBuilder;
	    withRequestOptions: (callback: (resource: Resource, options: RequestOptions) => CustomRequestOptions) => ResourceBuilder;
	    getResource<TData = any>(resourceUrl: string): Resource<TData>;
	    wrapResource<TData = any>(resource: TData): Resource<TData>;
	}
	export function builder(): ResourceBuilder;

}
declare module 'hyperjs' {
	import main = require('hyperjs/HyperJS');
	export = main;
}
