module.exports=function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(5),o=n(1),i=n(3),s=n(6),a=null,u={initialize:function(e){if(i.empty(e.apiKey)||i.empty(e.secretKey))throw"API key and secret key are required options!";var t=[e.apiKey,e.secretKey];i.nullOrUndefined(e.enableCrashReporting)?t.push(!1):t.push(e.enableCrashReporting),t.push(o.SdkInfo),t.push({id:o.CordovaRuntimeType,version:r.version}),r.exec(i.noop,i.noop,o.NATIVE_MODULE_NAME,"initBaseSdk",t),a=new s.Client(e.apiKey,e.secretKey)},getInstallId:function(){return a.getInstallId()},call:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return a.call(e,t)},getPushSubscriptionManager:function(){return a.pushChannels},pushRemoveToken:function(){return a.pushRemoveToken()},pushStoreToken:function(e){r.exec(i.noop,i.noop,o.NATIVE_MODULE_NAME,"pushStoreToken",[e])},pushTrackOpen:function(e){u.trackEvent(o.KumulosEvent.PUSH_OPEN_TRACK,{id:e})},trackEvent:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;r.exec(i.noop,i.noop,o.NATIVE_MODULE_NAME,"trackEvent",[e,t,!1])},trackEventImmediately:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;r.exec(i.noop,i.noop,o.NATIVE_MODULE_NAME,"trackEvent",[e,t,!0])},sendLocationUpdate:function(e){r.exec(i.noop,i.noop,o.NATIVE_MODULE_NAME,"sendLocationUpdate",[e.lat,e.lng])},associateUserWithInstall:function(e){r.exec(i.noop,i.noop,o.NATIVE_MODULE_NAME,"associateUserWithInstall",[e])},trackEddystoneBeaconProximity:function(e){u.trackEventImmediately(o.KumulosEvent.ENGAGE_BEACON_ENTERED_PROXIMITY,Object.assign({type:o.BeaconType.Eddystone},e))},trackiBeaconProximity:function(e){u.trackEventImmediately(o.KumulosEvent.ENGAGE_BEACON_ENTERED_PROXIMITY,Object.assign({type:o.BeaconType.iBeacon},e))}};t.default=u},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SdkInfo={id:6,version:"3.0.0"},t.CordovaRuntimeType=3,t.NATIVE_MODULE_NAME="KumulosSDKPlugin",t.KumulosEvent={PUSH_OPEN_TRACK:"k.push.opened",ENGAGE_BEACON_ENTERED_PROXIMITY:"k.engage.beaconEnteredProximity",ENGAGE_LOCATION_UPDATED:"k.engage.locationUpdated"},t.BeaconType={iBeacon:1,Eddystone:2}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n;!function(e){e[e.SUCCESS=1]="SUCCESS",e[e.NOT_AUTHORIZED=2]="NOT_AUTHORIZED",e[e.NO_SUCH_METHOD=4]="NO_SUCH_METHOD",e[e.NO_SUCH_FORMAT=8]="NO_SUCH_FORMAT",e[e.ACCOUNT_SUSPENDED=16]="ACCOUNT_SUSPENDED",e[e.INVALID_REQUEST=32]="INVALID_REQUEST",e[e.UNKNOWN_SERVER_ERROR=64]="UNKNOWN_SERVER_ERROR",e[e.DATABASE_ERROR=128]="DATABASE_ERROR"}(n=t.ResponseCode||(t.ResponseCode={})),t.PushBaseUrl="https://push.kumulos.com",t.ClientBaseUrl="https://api.kumulos.com"},function(e,t){"use strict";function n(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=Object.keys(e),i=[],s=void 0,a=void 0,u=void 0,c=void 0,h=0,l=o.length;h<l;++h)a=o[h],s=e[a],"object"!==("undefined"==typeof s?"undefined":r(s))?(u=null!==t?encodeURIComponent(t)+"["+encodeURIComponent(a)+"]":encodeURIComponent(a),c=encodeURIComponent(s),i.push(u+"="+c)):i.push(n(s,a));return i.join("&")}var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};Object.defineProperty(t,"__esModule",{value:!0}),t.generateUUID=function(){var e=(new Date).getTime();window.performance&&"function"==typeof window.performance.now&&(e+=performance.now());var t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?n:3&n|8).toString(16)});return t},t.urlEncodedParams=n,t.noop=function(){},t.empty=function(e){return!e||!e.length},t.nullOrUndefined=function(e){return null===e||void 0===e}},function(e,t){!function(e){"use strict";function t(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function n(e){return"string"!=typeof e&&(e=String(e)),e}function r(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return m.iterable&&(t[Symbol.iterator]=function(){return t}),t}function o(e){this.map={},e instanceof o?e.forEach(function(e,t){this.append(t,e)},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function i(e){return e.bodyUsed?Promise.reject(new TypeError("Already read")):void(e.bodyUsed=!0)}function s(e){return new Promise(function(t,n){e.onload=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function a(e){var t=new FileReader,n=s(t);return t.readAsArrayBuffer(e),n}function u(e){var t=new FileReader,n=s(t);return t.readAsText(e),n}function c(e){for(var t=new Uint8Array(e),n=new Array(t.length),r=0;r<t.length;r++)n[r]=String.fromCharCode(t[r]);return n.join("")}function h(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function l(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(m.blob&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(m.formData&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(m.searchParams&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(m.arrayBuffer&&m.blob&&E(e))this._bodyArrayBuffer=h(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!m.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(e)&&!_(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=h(e)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):m.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},m.blob&&(this.blob=function(){var e=i(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?i(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(a)}),this.text=function(){var e=i(this);if(e)return e;if(this._bodyBlob)return u(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(c(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},m.formData&&(this.formData=function(){return this.text().then(d)}),this.json=function(){return this.text().then(JSON.parse)},this}function f(e){var t=e.toUpperCase();return w.indexOf(t)>-1?t:e}function p(e,t){t=t||{};var n=t.body;if("string"==typeof e)this.url=e;else{if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new o(e.headers)),this.method=e.method,this.mode=e.mode,n||null==e._bodyInit||(n=e._bodyInit,e.bodyUsed=!0)}if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new o(t.headers)),this.method=f(t.method||this.method||"GET"),this.mode=t.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function d(e){var t=new FormData;return e.trim().split("&").forEach(function(e){if(e){var n=e.split("="),r=n.shift().replace(/\+/g," "),o=n.join("=").replace(/\+/g," ");t.append(decodeURIComponent(r),decodeURIComponent(o))}}),t}function y(e){var t=new o;return e.split("\r\n").forEach(function(e){var n=e.split(":"),r=n.shift().trim();if(r){var o=n.join(":").trim();t.append(r,o)}}),t}function b(e,t){t||(t={}),this.type="default",this.status="status"in t?t.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new o(t.headers),this.url=t.url||"",this._initBody(e)}if(!e.fetch){var m={searchParams:"URLSearchParams"in e,iterable:"Symbol"in e&&"iterator"in Symbol,blob:"FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(m.arrayBuffer)var v=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],E=function(e){return e&&DataView.prototype.isPrototypeOf(e)},_=ArrayBuffer.isView||function(e){return e&&v.indexOf(Object.prototype.toString.call(e))>-1};o.prototype.append=function(e,r){e=t(e),r=n(r);var o=this.map[e];o||(o=[],this.map[e]=o),o.push(r)},o.prototype.delete=function(e){delete this.map[t(e)]},o.prototype.get=function(e){var n=this.map[t(e)];return n?n[0]:null},o.prototype.getAll=function(e){return this.map[t(e)]||[]},o.prototype.has=function(e){return this.map.hasOwnProperty(t(e))},o.prototype.set=function(e,r){this.map[t(e)]=[n(r)]},o.prototype.forEach=function(e,t){Object.getOwnPropertyNames(this.map).forEach(function(n){this.map[n].forEach(function(r){e.call(t,r,n,this)},this)},this)},o.prototype.keys=function(){var e=[];return this.forEach(function(t,n){e.push(n)}),r(e)},o.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),r(e)},o.prototype.entries=function(){var e=[];return this.forEach(function(t,n){e.push([n,t])}),r(e)},m.iterable&&(o.prototype[Symbol.iterator]=o.prototype.entries);var w=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];p.prototype.clone=function(){return new p(this,{body:this._bodyInit})},l.call(p.prototype),l.call(b.prototype),b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new o(this.headers),url:this.url})},b.error=function(){var e=new b(null,{status:0,statusText:""});return e.type="error",e};var T=[301,302,303,307,308];b.redirect=function(e,t){if(T.indexOf(t)===-1)throw new RangeError("Invalid status code");return new b(null,{status:t,headers:{location:e}})},e.Headers=o,e.Request=p,e.Response=b,e.fetch=function(e,t){return new Promise(function(n,r){var o=new p(e,t),i=new XMLHttpRequest;i.onload=function(){var e={status:i.status,statusText:i.statusText,headers:y(i.getAllResponseHeaders()||"")};e.url="responseURL"in i?i.responseURL:e.headers.get("X-Request-URL");var t="response"in i?i.response:i.responseText;n(new b(t,e))},i.onerror=function(){r(new TypeError("Network request failed"))},i.ontimeout=function(){r(new TypeError("Network request failed"))},i.open(o.method,o.url,!0),"include"===o.credentials&&(i.withCredentials=!0),"responseType"in i&&m.blob&&(i.responseType="blob"),o.headers.forEach(function(e,t){i.setRequestHeader(t,e)}),i.send("undefined"==typeof o._bodyInit?null:o._bodyInit)})},e.fetch.polyfill=!0}}("undefined"!=typeof self?self:this)},function(e,t){e.exports=require("cordova")},function(e,t,n){"use strict";function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0}),n(4);var a=n(2),u=n(7),c=n(5),h=n(3),l=n(1),f=function(){function e(t,n){i(this,e),this.credentials=new d(t,n),this.sessionToken=h.generateUUID(),this.pushChannels=new u.PushChannelManager(this,this.credentials)}return s(e,[{key:"getInstallId",value:function(){return new Promise(function(e,t){c.exec(e,t,l.NATIVE_MODULE_NAME,"getInstallId",[])})}},{key:"call",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.getInstallId().then(function(r){return t.doCall(r,e,n)})}},{key:"doCall",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(null==t||void 0==t||""==t.trim())throw new Error("API method cannot be empty.");var o=this.credentials.getApiKey(),i=a.ClientBaseUrl+("/b2.2/"+o+"/"+t+".json"),s=new Headers;s.append("Authorization",this.credentials.authString),s.append("Content-Type","application/x-www-form-urlencoded");var u=h.urlEncodedParams({installId:e,sessionToken:this.sessionToken,params:r}),c={method:"POST",headers:s,body:u};return fetch(i,c).then(function(e){return n.checkStatus(e)}).then(function(e){return n.parseJson(e)}).then(function(e){return n.handleResponse(e)}).catch(function(e){throw e})}},{key:"pushRemoveToken",value:function(){var e=new u.Push(this,this.credentials);return e.pushRemoveToken()}},{key:"checkStatus",value:function(e){if(e.status>=200&&e.status<300)return e;var t=new p(e.statusText);throw t.response=e,t}},{key:"parseJson",value:function(e){return e.json()}},{key:"handleResponse",value:function(e){switch(null!=e.sessionToken&&(this.sessionToken=e.sessionToken),e.responseCode){case a.ResponseCode.SUCCESS:return e.payload;default:return Promise.reject(e)}}}]),e}();t.Client=f;var p=function(e){function t(){return i(this,t),r(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),t}(Error),d=function(){function e(t,n){if(i(this,e),h.empty(t))throw new Error("API Key cannot be empty.");if(h.empty(n))throw new Error("Secret Key cannot be empty.");this.apiKey=t,this.secretKey=n,this.authString=this.getAuthorizationString()}return s(e,[{key:"getAuthorizationString",value:function(){return"Basic "+btoa(this.apiKey+":"+this.secretKey)}}]),s(e,[{key:"getApiKey",value:function(){return this.apiKey}}]),e}();t.Credentials=d},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();Object.defineProperty(t,"__esModule",{value:!0}),n(4);var i=n(2),s=function(){function e(t,n){r(this,e),this.client=t,this.headers=new Headers,this.headers.append("Authorization",n.authString),this.headers.append("Content-Type","application/json; charset=utf-8")}return o(e,[{key:"pushRemoveToken",value:function(){var e=this,t=this.headers;return new Promise(function(n,r){e.client.getInstallId().then(function(e){var r=i.PushBaseUrl+("/v1/app-installs/"+e+"/push-token"),o={method:"DELETE",headers:t};n(fetch(r,o))})})}}]),e}();t.Push=s;var a=function(){function e(t,n){r(this,e),this.client=t,this.headers=new Headers,this.headers.append("Authorization",n.authString),this.headers.append("Content-Type","application/json; charset=utf-8"),this.headers.append("Accept","application/json")}return o(e,[{key:"makeSubscriptionRequest",value:function(e,t){var n=this;return this.client.getInstallId().then(function(r){var o=i.PushBaseUrl+"/v1/app-installs/"+r+"/channels/subscriptions",s={uuids:t},a={method:e,headers:n.headers,body:JSON.stringify(s)};return fetch(o,a)})}},{key:"subscribe",value:function(e){return this.makeSubscriptionRequest("POST",e)}},{key:"unsubscribe",value:function(e){return this.makeSubscriptionRequest("DELETE",e)}},{key:"setSubscriptions",value:function(e){return this.makeSubscriptionRequest("PUT",e)}},{key:"clearSubscriptions",value:function(){return this.setSubscriptions([])}},{key:"listChannels",value:function(){var e=this;return this.client.getInstallId().then(function(t){var n=i.PushBaseUrl+"/v1/app-installs/"+t+"/channels",r={method:"GET",headers:e.headers};return fetch(n,r)}).then(function(e){return e.json()})}},{key:"createChannel",value:function(e){var t=this;return!e.showInPortal||e.name&&e.name.length?this.client.getInstallId().then(function(n){var r=i.PushBaseUrl+"/v1/channels",o={uuid:e.uuid,name:e.name,showInPortal:Boolean(e.showInPortal),meta:e.meta,installId:void 0};e.subscribe&&(o.installId=n);var s={method:"POST",headers:t.headers,body:JSON.stringify(o)};return fetch(r,s)}).then(function(e){return e.json()}):Promise.reject({error:"Name is required for channel creation when showInPortal is true"})}}]),e}();t.PushChannelManager=a}]);