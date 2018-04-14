(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.hyperjs = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpError_1 = require("./errors/HttpError");
function request(options) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, makeRequest(options)];
                case 1:
                    response = _a.sent();
                    return [3, 3];
                case 2:
                    error_1 = _a.sent();
                    throw new HttpError_1.default(options.url, error_1.status, error_1.statusText, error_1.responseText);
                case 3:
                    if (response && response.length > 0) {
                        return [2, JSON.parse(response)];
                    }
                    return [2, undefined];
            }
        });
    });
}
exports.request = request;
function makeRequest(opts) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.responseText);
            }
            else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                responseText: xhr.responseText,
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if (opts.headers) {
            Object.keys(opts.headers).forEach(function (key) {
                xhr.setRequestHeader(key, opts.headers[key]);
            });
        }
        var params = opts.data;
        if (params && typeof params === 'object') {
            params = Object.keys(params).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }).join('&');
        }
        xhr.send(params);
    });
}

},{"./errors/HttpError":4}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClient_1 = require("./HttpClient");
var LinkNotFoundError_1 = require("./errors/LinkNotFoundError");
var ResourceNotLoadedError_1 = require("./errors/ResourceNotLoadedError");
var TemplateParameters_1 = require("./TemplateParameters");
var ProxyResource = (function () {
    function ProxyResource(linkMethod, parentResource, client) {
        this.linkMethod = linkMethod;
        this.parentResource = parentResource;
        this.client = client;
    }
    ProxyResource.prototype.fetch = function (parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.resource) {
                            return [2, this.resource.fetch(parameters)];
                        }
                        return [4, this.parentResource.fetch()];
                    case 1:
                        _a.sent();
                        fetchUrl = this.linkMethod();
                        this.resource = this.client.getResource(fetchUrl.href);
                        return [4, this.resource.fetch(parameters)];
                    case 2:
                        _a.sent();
                        return [2, this.resource];
                }
            });
        });
    };
    Object.defineProperty(ProxyResource.prototype, "data", {
        get: function () {
            return this.resource.data;
        },
        enumerable: true,
        configurable: true
    });
    ProxyResource.prototype.put = function (body, parameters) {
        return this.resource.put(body, parameters);
    };
    ProxyResource.prototype.patch = function (body, parameters) {
        return this.resource.patch(body, parameters);
    };
    ProxyResource.prototype.post = function (body, parameters) {
        return this.resource.post(body, parameters);
    };
    ProxyResource.prototype.delete = function (body, parameters) {
        return this.resource.delete(body, parameters);
    };
    ProxyResource.prototype.action = function (rel, body, parameters) {
        return this.resource.action(rel, body, parameters);
    };
    ProxyResource.prototype.followLink = function (rel, templateParameters, queryParameters) {
        var _this = this;
        if (this.resource && typeof this.resource.data !== "undefined") {
            return this.resource.followLink(rel, templateParameters);
        }
        var getLazy = function () {
            var resource = _this.resource.data;
            var rootLink = _this.client.getLink(rel, resource);
            if (typeof rootLink == "undefined") {
                throw new LinkNotFoundError_1.default(rel);
            }
            var resourceLink = rootLink;
            var tempLink = TemplateParameters_1.setParameters(resourceLink, templateParameters, queryParameters);
            return { href: tempLink, rel: rel, method: "GET" };
        };
        return new ProxyResource(getLazy, this, this.client);
    };
    ProxyResource.prototype.getLink = function (rel) {
        return this.resource.getLink(rel);
    };
    ProxyResource.prototype.hasLink = function (rel) {
        return this.resource.hasLink(rel);
    };
    return ProxyResource;
}());
var BaseResource = (function () {
    function BaseResource(resourceParams) {
        if (typeof resourceParams === "undefined") {
            throw new Error("resourceParams must be set");
        }
        if (typeof resourceParams.client === "undefined") {
            throw new Error("client must be set");
        }
        this.client = resourceParams.client;
        if (typeof resourceParams.resource !== "undefined") {
            this.resource = resourceParams.resource;
            this.resourceUrl = this.client.getSelf(this.resource);
        }
        else {
            this.resourceUrl = resourceParams.url;
        }
    }
    BaseResource.prototype.fetch = function (templateParameters, queryParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var usedUrl, options, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        usedUrl = TemplateParameters_1.setParameters(this.resourceUrl, templateParameters, queryParameters);
                        options = {
                            method: "GET",
                            url: usedUrl
                        };
                        _a = this;
                        return [4, this.makeRequest(options)];
                    case 1:
                        _a.resource = _b.sent();
                        return [2, this];
                }
            });
        });
    };
    Object.defineProperty(BaseResource.prototype, "data", {
        get: function () {
            return this.resource;
        },
        enumerable: true,
        configurable: true
    });
    BaseResource.prototype.post = function (body, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._action(this.resourceUrl, "POST", body)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BaseResource.prototype.put = function (body, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._action(this.resourceUrl, "PUT", body)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BaseResource.prototype.patch = function (body, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._action(this.resourceUrl, "PATCH", body)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BaseResource.prototype.delete = function (body, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._action(this.resourceUrl, "DELETE", body)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BaseResource.prototype.action = function (rel, method, body, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var link, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = this.getLink(rel);
                        if (!link) {
                            throw new LinkNotFoundError_1.default(rel);
                        }
                        url = TemplateParameters_1.setParameters(link.href, parameters);
                        return [4, this._action(url, method, body)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BaseResource.prototype._action = function (url, method, body) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, options;
            return __generator(this, function (_a) {
                headers = {};
                options = {
                    method: method,
                    url: url,
                    headers: headers,
                    data: JSON.stringify(body),
                    contentType: "application/json; charset=utf-8"
                };
                return [2, this.makeRequest(options)];
            });
        });
    };
    BaseResource.prototype.makeRequest = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var customOptions, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customOptions = this.client.getRequestOptions(this, options);
                        if (typeof customOptions !== "undefined") {
                            if (typeof customOptions.method != "undefined") {
                                options.method = customOptions.method;
                            }
                            for (key in customOptions.headers) {
                                options.headers[key] = customOptions.headers[key];
                            }
                        }
                        return [4, HttpClient_1.request(options)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    BaseResource.prototype.getLink = function (rel) {
        if (typeof this.resource === "undefined") {
            throw new ResourceNotLoadedError_1.default(this.resourceUrl);
        }
        return { rel: rel, href: this.client.getLink(rel, this.resource) };
    };
    BaseResource.prototype.hasLink = function (rel) {
        return typeof this.getLink(rel) !== "undefined";
    };
    BaseResource.prototype.followLink = function (rel, templateParameters, queryParameters) {
        var _this = this;
        var getLazy = function () {
            if (typeof _this.resource === "undefined") {
                throw new ResourceNotLoadedError_1.default(_this.resourceUrl);
            }
            var resourceLink = _this.client.getLink(rel, _this.resource);
            var tempLink = TemplateParameters_1.setParameters(resourceLink, templateParameters, queryParameters);
            return { href: tempLink, rel: rel, method: "GET" };
        };
        if (typeof this.resource === "undefined") {
            return new ProxyResource(getLazy, this, this.client);
        }
        var resourceLink = getLazy();
        this.client.getResource(resourceLink.href);
    };
    return BaseResource;
}());
function builder() {
    return new DefaultResourceBuilder();
}
exports.builder = builder;
var DefaultResourceBuilder = (function () {
    function DefaultResourceBuilder() {
        var _this = this;
        this.withSelfCallback = function (callBack) {
            _this._getSelf = callBack;
            return _this;
        };
        this.withLinkCallback = function (callBack) {
            _this._getLink = callBack;
            return _this;
        };
        this.withRequestOptions = function (callBack) {
            _this._withRequestOptions = callBack;
            return _this;
        };
        this.getRequestOptions = function (resource, options) {
            if (typeof _this._withRequestOptions !== "function") {
                return options;
            }
            return _this._withRequestOptions(resource, options);
        };
        this.getSelf = function (data) {
            return _this._getSelf(data);
        };
        this.getLink = function (rel, data) {
            return _this._getLink(rel, data);
        };
    }
    DefaultResourceBuilder.prototype.getResource = function (resourceUrl) {
        return new BaseResource({ url: resourceUrl, client: this });
    };
    DefaultResourceBuilder.prototype.wrapResource = function (resource) {
        return new BaseResource({ resource: resource, client: this });
    };
    return DefaultResourceBuilder;
}());

},{"./HttpClient":1,"./TemplateParameters":3,"./errors/LinkNotFoundError":5,"./errors/ResourceNotLoadedError":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UrlMustBeSetError_1 = require("./errors/UrlMustBeSetError");
function setParameters(url, templateParameters, queryParameters) {
    if (typeof url === "undefined") {
        throw new UrlMustBeSetError_1.default();
    }
    if (typeof templateParameters !== "undefined") {
        for (var propName in templateParameters) {
            if (templateParameters.hasOwnProperty(propName)) {
                url = url.replace("{" + propName + "}", encodeURIComponent(templateParameters[propName]));
            }
        }
    }
    if (typeof queryParameters !== "undefined") {
        for (var prop in queryParameters) {
            if (queryParameters.hasOwnProperty(prop)) {
                if (url.indexOf("?") === -1) {
                    url += "?";
                }
                else {
                    url += "&";
                }
                var values = queryParameters[prop];
                if (Array.isArray(values) === false) {
                    values = [values];
                }
                for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                    var val = values_1[_i];
                    url += prop + "=" + encodeURIComponent(val);
                }
                ;
            }
        }
    }
    return url.replace(new RegExp("#", "g"), "%23");
}
exports.setParameters = setParameters;

},{"./errors/UrlMustBeSetError":7}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HttpError = (function (_super) {
    __extends(HttpError, _super);
    function HttpError(url, status, statusText, data) {
        var _this = _super.call(this, statusText) || this;
        _this.url = url;
        _this.status = status;
        _this.statusText = statusText;
        _this.data = data;
        _this.name = "HttpError";
        return _this;
    }
    return HttpError;
}(Error));
exports.default = HttpError;

},{}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var LinkNotFoundError = (function (_super) {
    __extends(LinkNotFoundError, _super);
    function LinkNotFoundError(rel) {
        var _this = _super.call(this, "link: \"" + rel + "\" not found") || this;
        _this.rel = rel;
        _this.name = "LinkNotFoundError";
        return _this;
    }
    return LinkNotFoundError;
}(Error));
exports.default = LinkNotFoundError;

},{}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceNotLoadedError = (function (_super) {
    __extends(ResourceNotLoadedError, _super);
    function ResourceNotLoadedError(resourceUrl) {
        var _this = _super.call(this, "resource " + resourceUrl + " not loaded") || this;
        _this.name = "ResourceNotLoadedError";
        return _this;
    }
    return ResourceNotLoadedError;
}(Error));
exports.default = ResourceNotLoadedError;

},{}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var UrlMustBeSetError = (function (_super) {
    __extends(UrlMustBeSetError, _super);
    function UrlMustBeSetError() {
        var _this = _super.call(this, "url must be set") || this;
        _this.name = "UrlMustBeSetError";
        return _this;
    }
    return UrlMustBeSetError;
}(Error));
exports.default = UrlMustBeSetError;

},{}]},{},[1,2,3])(3)
});