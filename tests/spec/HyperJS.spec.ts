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

    var server:sinon.SinonFakeServer; 

    beforeEach(function () {
             server = sinon.fakeServer.create();
             server.autoRespond = true;
         }); 

         afterEach(function () {server.restore(); }); 

    it("fetch return correct json", async () =>  {


            let resourcePromise = HyperJS.builder()
            .withSelfCallback((data:any):string =>  {
                return data.url; 
            })
            .withLinkCallback((rel:string, data:any):string =>  {
                return data[rel]; 
            })
            .withRequestOptions(()=> {
                return {
                    headers: {
                        "Authentication": "test"
                    }
                }
            })
            .getResource<MyData>("https://api.example.com")
            .fetch();

            server.requests[0].respond(
                200,  {"Content-Type":"application/json"}, 
                JSON.stringify( {url:"https://api.example.com"})); 

              let resource = await resourcePromise; 
              sinon.assert.match(resource.data,  {url:"https://api.example.com"}); 
    }); 

    it("can follow one link", async () =>  {

        server.respondWith("GET", "https://api.example.com",
        [200,  {"Content-Type":"application/json"}, 
                JSON.stringify( {
                    url:"https://api.example.com", 
                    mySubResource:"https://api.example.com/sub" 
                })]); 

        server.respondWith("GET", "https://api.example.com/sub",
        [200,  {"Content-Type":"application/json"}, 
                JSON.stringify({
                    url:"https://api.example.com/sub",
                    prop:"value"
                })]); 

        let resourcePromise = HyperJS.builder()
        .withSelfCallback((data:any):string =>  {
            return data.url; 
        })
        .withLinkCallback((rel:string, data:any):string =>  {
            return data[rel]; 
        })
        .withRequestOptions(()=> {
            return {
                headers: {
                    "Authentication": "test"
                }
            }
        })
        .getResource<MyData>("https://api.example.com")
        .followLink("mySubResource")
        .fetch()

          let resource = await resourcePromise; 
          server.respond();
          sinon.assert.match(resource.data,  { prop:"value", url:"https://api.example.com/sub"}); 
}); 

    it("fetch handles 500 error", async () =>  {

        server.respondWith("GET", "https://api.example.com",
[500,  {"Content-Type":"application/json"}, 
        JSON.stringify( {url:"https://api.example.com"})]); 

        try {
            let resource = HyperJS.builder()
            .withSelfCallback(getSelf)
            .withLinkCallback(getLink)
            .getResource<MyData>("https://api.example.com")
            .fetch(); 

            await resource;
        } catch(error) {
            sinon.assert.match(error.status, 500); 
            sinon.assert.match(error.statusText, "Internal Server Error"); 
            sinon.assert.match(error.url, "https://api.example.com" );
        }
    }); 
}); 