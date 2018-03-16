# Hyper JS

A Hypermedia API/HATEOAS Client for the Browser

Introduction
------------

Hyper JS comes in handy when consuming REST APIs that follow the HATEOAS principle, that is, REST APIs that have links between their resources. Such an API (also sometimes referred to as hypermedia or hypertext-driven API) typically has a root resource/endpoint, which publishes links to other resources. These resources in turn might also have, as part of their metadata, links to related resources. Sometimes you need to follow multiple consecutive links to get to the resource you want. This pattern makes it unnecessary for the client to hardcode all endpoint URLs of the API it uses, which in turn reduces the coupling between the API provider and the API consumer. This makes it easier for the API provider to change the structure of the API without breaking existing client implementations.

To follow a path of links you typically start at one URL (most often the root URL of the API), then look for the link you are interested in, fetch the document from there and repeat this process until you have reached the end of this path.

Hyper JS does that for you. You just need to tell Hyper JS where it can find the link to follow in each consecutive document and Hyper JS will happily execute the hops from document to document for you and when it's done, hand you the final http response or document, the one you really wanted to have in the first place.

Hyper JS works only  in the browser. For now, Hyper JS only supports JSON APIs. 

The most basic thing you can do with Hyper JS is to let it start at the root URL of an API, follow some links and pass the resource that is found at the end of this journey back to you. We call this procedure a *"link traversal process"*. Here's how:

```javascript
var hyperjs = require('hyperjs');

hyperjs
.getClient() //the client acts as a factory for the resource
.getResource('http://api.example.com')
.followLink('link') //creates a new resource form the link
.fetch().then(function(resource) {   //fetches the resources
    //do useful things with the Resource object
    //resource.getData().propertyOnTheData
}, function(error) {
   //handle error
});

```
License
-------

MIT