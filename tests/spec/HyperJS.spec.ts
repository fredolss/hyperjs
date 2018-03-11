import * as HyperJS from "../../src/HyperJS"; 
import * as sinon from 'sinon'; 
import 'mocha';

let getLink = (rel:string, data:any):string =>  {
    return data[rel]; 
}

declare var global:any; 

let getVersion = (rel:string, data:any):string =>  {
    return undefined; 
}

let getSelf = (rel:string, data:any):string =>  {
    return data.href; 
}

interface MyData {
    url:string; 
    first:string; 
    last:string; 
}

describe("HyperJS", () =>  {

    var server; 

    beforeEach(function () {
             server = sinon.fakeServer.create(); 
         }); 

         afterEach(function () {server.restore(); }); 

    it("fetch return correct json", async () =>  {

        let clientOptions =  {getLink:getLink, getVersion:getVersion, getSelf:getSelf }; 

            let resourcePromise =   HyperJS.getClient(clientOptions)
            .getResource("https://api.example.com")
            .fetch()

            server.requests[0].respond(
                200,  {"Content-Type":"application/json"}, 
                JSON.stringify( {url:"test"})); 

              let resource =  await resourcePromise;
                sinon.assert.match(resource.getResource(),  {url:"test"}); 
          
               
    }); 

    it("fetch handles 500 error", async () =>  {

        server.respondWith("GET","https://api.example.com",
        [500,  {"Content-Type":"application/json"}, 
        JSON.stringify( {url:"test"})]); 

        let clientOptions =  {getLink:getLink, getVersion:getVersion, getSelf:getSelf }; 

        try {
            let resource =  HyperJS.getClient(clientOptions)
            .getResource("https://api.example.com")
            .fetch(); 

            server.respond();
            await resource;
        } catch(error) {
            console.log("in catch");
            sinon.assert.match(error.status,"Internal Server Error"); 
            sinon.assert.match(error.url,"https://api.example.com" );
        }
    }); 
}); 