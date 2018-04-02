import HttpError from "./errors/HttpError"; 

export interface RequestOptions {
    method:string, 
    url:string, 
    data?:string | object, 
    headers?:object,
    contentType?:string;
}

export async function request(options:RequestOptions) {

    let response; 

    try {
        response = await makeRequest(options); 
    } catch(error) {
        throw new HttpError(options.url, error.status, error.statusText, error.responseText); 
    }

    if(response && response.length > 0){
       return JSON.parse(response); 
    }

    return undefined;
}

function makeRequest (opts):any {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest(); 
      xhr.open(opts.method, opts.url); 
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.responseText); 
        }else {
          reject( {
            status:this.status, 
            statusText:xhr.statusText
          }); 
        }
      }; 
      xhr.onerror = function () {
        reject( {
          responseText:xhr.responseText,
          status:this.status, 
          statusText:xhr.statusText
        }); 
      }; 
      if (opts.headers) {
        Object.keys(opts.headers).forEach(function (key) {
          xhr.setRequestHeader(key, opts.headers[key]); 
        }); 
      }
      var params = opts.data; 
      // We'll need to stringify if we've been given an object
      // If we have a string, this is skipped.
      if (params && typeof params === 'object') {
        params = Object.keys(params).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]); 
        }).join('&'); 
      }
      xhr.send(params); 
    }); 
  }