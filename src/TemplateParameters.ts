import UrlMustBeSetError from "./errors/UrlMustBeSetError";

export function setParameters(url:string, templateParameters:any, queryParameters?:any):string {

    if (typeof url === "undefined") {
        throw new UrlMustBeSetError();
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