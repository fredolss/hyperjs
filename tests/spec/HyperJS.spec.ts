import * as HyperJS from "../../src/HyperJS"; 
import * as sinon from 'sinon'; 
import 'mocha'; 

declare var global:any; 

let getLink = (rel:string, data:any):string =>  {
    return data[rel]; 
}

let getSelf = (data:any):string =>  {
    return data.url; 
}

interface MyData {
    url:string; 
}

describe("HyperJS", () =>  {

    var server; 

    beforeEach(function () {
             server = sinon.fakeServer.create(); 
         }); 

         afterEach(function () {server.restore(); }); 

    it("fetch return correct json", async () =>  {

            let resourcePromise = HyperJS.getClient()
            .withSelfMethod(getSelf)
            .withLinkMethod(getLink)
            .getResource<MyData>("https://api.example.com")
            .fetch()

            server.requests[0].respond(
                200,  {"Content-Type":"application/json"}, 
                JSON.stringify( {url:"test"})); 

              let resource = await resourcePromise; 
              sinon.assert.match(resource.getResource(),  {url:"test"}); 
    }); 

    it("fetch handles 500 error", async () =>  {

        server.respondWith("GET", "https://api.example.com",
[500,  {"Content-Type":"application/json"}, 
        JSON.stringify( {url:"test"})]); 

        try {
            let resource = HyperJS.getClient()
            .withSelfMethod(getSelf)
            .withLinkMethod(getLink)
            .getResource<MyData>("https://api.example.com")
            .fetch(); 

            server.respond();
            await resource; 
        } catch(error) {
            sinon.assert.match(error.status, "Internal Server Error"); 
            sinon.assert.match(error.url, "https://api.example.com" );
        }
    }); 
}); 