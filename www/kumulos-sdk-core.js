module.exports=function(e){function t(t){for(var n,o,i=t[0],s=t[1],a=0,c=[];a<i.length;a++)o=i[a],r[o]&&c.push(r[o][0]),r[o]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);for(u&&u(t);c.length;)c.shift()()}var n={},r={1:0};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var i=new Promise(function(t,o){n=r[e]=[t,o]});t.push(n[2]=i);var s=document.getElementsByTagName("head")[0],a=document.createElement("script");a.charset="utf-8",a.timeout=120,o.nc&&a.setAttribute("nonce",o.nc),a.src=function(e){return o.p+""+({0:"vendors~raven-js"}[e]||e)+".bundle.js"}(e);var u=setTimeout(function(){c({type:"timeout",target:a})},12e4);function c(t){a.onerror=a.onload=null,clearTimeout(u);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src,s=new Error("Loading chunk "+e+" failed.\n("+o+": "+i+")");s.type=o,s.request=i,n[1](s)}r[e]=void 0}}a.onerror=a.onload=c,s.appendChild(a)}return Promise.all(t)},o.m=e,o.c=n,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},o.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="plugins/cordova-plugin-kumulos-sdk/www/",o.oe=function(e){throw console.error(e),e};var i=window.ks_wpJsonp=window.ks_wpJsonp||[],s=i.push.bind(i);i.push=t,i=i.slice();for(var a=0;a<i.length;a++)t(i[a]);var u=s;return o(o.s=7)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=t.ResponseCode=void 0;!function(e){e[e.SUCCESS=1]="SUCCESS",e[e.NOT_AUTHORIZED=2]="NOT_AUTHORIZED",e[e.NO_SUCH_METHOD=4]="NO_SUCH_METHOD",e[e.NO_SUCH_FORMAT=8]="NO_SUCH_FORMAT",e[e.ACCOUNT_SUSPENDED=16]="ACCOUNT_SUSPENDED",e[e.INVALID_REQUEST=32]="INVALID_REQUEST",e[e.UNKNOWN_SERVER_ERROR=64]="UNKNOWN_SERVER_ERROR",e[e.DATABASE_ERROR=128]="DATABASE_ERROR"}(r||(t.ResponseCode=r={}));t.PushBaseUrl="https://push.kumulos.com",t.ClientBaseUrl="https://api.kumulos.com"},function(e,t){!function(e){"use strict";if(!e.fetch){var t={searchParams:"URLSearchParams"in e,iterable:"Symbol"in e&&"iterator"in Symbol,blob:"FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(t.arrayBuffer)var n=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],r=function(e){return e&&DataView.prototype.isPrototypeOf(e)},o=ArrayBuffer.isView||function(e){return e&&n.indexOf(Object.prototype.toString.call(e))>-1};l.prototype.append=function(e,t){e=a(e),t=u(t);var n=this.map[e];n||(n=[],this.map[e]=n),n.push(t)},l.prototype.delete=function(e){delete this.map[a(e)]},l.prototype.get=function(e){var t=this.map[a(e)];return t?t[0]:null},l.prototype.getAll=function(e){return this.map[a(e)]||[]},l.prototype.has=function(e){return this.map.hasOwnProperty(a(e))},l.prototype.set=function(e,t){this.map[a(e)]=[u(t)]},l.prototype.forEach=function(e,t){Object.getOwnPropertyNames(this.map).forEach(function(n){this.map[n].forEach(function(r){e.call(t,r,n,this)},this)},this)},l.prototype.keys=function(){var e=[];return this.forEach(function(t,n){e.push(n)}),c(e)},l.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),c(e)},l.prototype.entries=function(){var e=[];return this.forEach(function(t,n){e.push([n,t])}),c(e)},t.iterable&&(l.prototype[Symbol.iterator]=l.prototype.entries);var i=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];v.prototype.clone=function(){return new v(this,{body:this._bodyInit})},y.call(v.prototype),y.call(b.prototype),b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new l(this.headers),url:this.url})},b.error=function(){var e=new b(null,{status:0,statusText:""});return e.type="error",e};var s=[301,302,303,307,308];b.redirect=function(e,t){if(-1===s.indexOf(t))throw new RangeError("Invalid status code");return new b(null,{status:t,headers:{location:e}})},e.Headers=l,e.Request=v,e.Response=b,e.fetch=function(e,n){return new Promise(function(r,o){var i=new v(e,n),s=new XMLHttpRequest;s.onload=function(){var e,t,n={status:s.status,statusText:s.statusText,headers:(e=s.getAllResponseHeaders()||"",t=new l,e.split("\r\n").forEach(function(e){var n=e.split(":"),r=n.shift().trim();if(r){var o=n.join(":").trim();t.append(r,o)}}),t)};n.url="responseURL"in s?s.responseURL:n.headers.get("X-Request-URL");var o="response"in s?s.response:s.responseText;r(new b(o,n))},s.onerror=function(){o(new TypeError("Network request failed"))},s.ontimeout=function(){o(new TypeError("Network request failed"))},s.open(i.method,i.url,!0),"include"===i.credentials&&(s.withCredentials=!0),"responseType"in s&&t.blob&&(s.responseType="blob"),i.headers.forEach(function(e,t){s.setRequestHeader(t,e)}),s.send(void 0===i._bodyInit?null:i._bodyInit)})},e.fetch.polyfill=!0}function a(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()}function u(e){return"string"!=typeof e&&(e=String(e)),e}function c(e){var n={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return t.iterable&&(n[Symbol.iterator]=function(){return n}),n}function l(e){this.map={},e instanceof l?e.forEach(function(e,t){this.append(t,e)},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function h(e){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}function f(e){return new Promise(function(t,n){e.onload=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function p(e){var t=new FileReader,n=f(t);return t.readAsArrayBuffer(e),n}function d(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function y(){return this.bodyUsed=!1,this._initBody=function(e){if(this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(t.blob&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(t.formData&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else if(t.arrayBuffer&&t.blob&&r(e))this._bodyArrayBuffer=d(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!t.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(e)&&!o(e))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=d(e)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):t.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},t.blob&&(this.blob=function(){var e=h(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?h(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(p)}),this.text=function(){var e,t,n,r=h(this);if(r)return r;if(this._bodyBlob)return e=this._bodyBlob,t=new FileReader,n=f(t),t.readAsText(e),n;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var t=new Uint8Array(e),n=new Array(t.length),r=0;r<t.length;r++)n[r]=String.fromCharCode(t[r]);return n.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},t.formData&&(this.formData=function(){return this.text().then(m)}),this.json=function(){return this.text().then(JSON.parse)},this}function v(e,t){var n,r,o=(t=t||{}).body;if("string"==typeof e)this.url=e;else{if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new l(e.headers)),this.method=e.method,this.mode=e.mode,o||null==e._bodyInit||(o=e._bodyInit,e.bodyUsed=!0)}if(this.credentials=t.credentials||this.credentials||"omit",!t.headers&&this.headers||(this.headers=new l(t.headers)),this.method=(n=t.method||this.method||"GET",r=n.toUpperCase(),i.indexOf(r)>-1?r:n),this.mode=t.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function m(e){var t=new FormData;return e.trim().split("&").forEach(function(e){if(e){var n=e.split("="),r=n.shift().replace(/\+/g," "),o=n.join("=").replace(/\+/g," ");t.append(decodeURIComponent(r),decodeURIComponent(o))}}),t}function b(e,t){t||(t={}),this.type="default",this.status="status"in t?t.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in t?t.statusText:"OK",this.headers=new l(t.headers),this.url=t.url||"",this._initBody(e)}}("undefined"!=typeof self?self:this)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.urlEncodedParams=function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;var o=Object.keys(t);var i=[];var s=void 0,a=void 0,u=void 0,c=void 0;for(var l=0,h=o.length;l<h;++l)a=o[l],"object"!==(void 0===(s=t[a])?"undefined":r(s))?(u=null!==n?encodeURIComponent(n)+"["+encodeURIComponent(a)+"]":encodeURIComponent(a),c=encodeURIComponent(s),i.push(u+"="+c)):i.push(e(s,a));return i.join("&")};t.generateUUID=function(){var e=(new Date).getTime();return window.performance&&"function"==typeof window.performance.now&&(e+=performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?n:3&n|8).toString(16)})};t.noop=function(){},t.empty=function(e){return!e||!e.length},t.nullOrUndefined=function(e){return null===e||void 0===e}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SdkInfo={id:6,version:"3.0.0"},t.CordovaRuntimeType=3,t.NativeModuleName="KumulosSDKPlugin",t.KumulosEvent={PushTrackOpen:"k.push.opened",EngageBeaconEnteredProximity:"k.engage.beaconEnteredProximity",EngageLocationUpdated:"k.engage.locationUpdated",CrashLoggedException:"k.crash.loggedException"},t.BeaconType={iBeacon:1,Eddystone:2},t.CrashReportFormat="raven"},function(e,t){e.exports=require("cordova")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PushChannelManager=t.Push=void 0;var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(1);var o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(0));function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.Push=function(){function e(t,n){i(this,e),this.client=t,this.headers=new Headers,this.headers.append("Authorization",n.authString),this.headers.append("Content-Type","application/json; charset=utf-8")}return r(e,[{key:"pushRemoveToken",value:function(){var e=this,t=this.headers;return new Promise(function(n,r){e.client.getInstallId().then(function(e){var r=o.PushBaseUrl+"/v1/app-installs/"+e+"/push-token";n(fetch(r,{method:"DELETE",headers:t}))})})}}]),e}(),t.PushChannelManager=function(){function e(t,n){i(this,e),this.client=t,this.headers=new Headers,this.headers.append("Authorization",n.authString),this.headers.append("Content-Type","application/json; charset=utf-8"),this.headers.append("Accept","application/json")}return r(e,[{key:"makeSubscriptionRequest",value:function(e,t){var n=this;return this.client.getInstallId().then(function(r){var i=o.PushBaseUrl+"/v1/app-installs/"+r+"/channels/subscriptions",s={uuids:t},a={method:e,headers:n.headers,body:JSON.stringify(s)};return fetch(i,a)})}},{key:"subscribe",value:function(e){return this.makeSubscriptionRequest("POST",e)}},{key:"unsubscribe",value:function(e){return this.makeSubscriptionRequest("DELETE",e)}},{key:"setSubscriptions",value:function(e){return this.makeSubscriptionRequest("PUT",e)}},{key:"clearSubscriptions",value:function(){return this.setSubscriptions([])}},{key:"listChannels",value:function(){var e=this;return this.client.getInstallId().then(function(t){var n=o.PushBaseUrl+"/v1/app-installs/"+t+"/channels",r={method:"GET",headers:e.headers};return fetch(n,r)}).then(function(e){return e.json()})}},{key:"createChannel",value:function(e){var t=this;return!e.showInPortal||e.name&&e.name.length?this.client.getInstallId().then(function(n){var r=o.PushBaseUrl+"/v1/channels",i={uuid:e.uuid,name:e.name,showInPortal:Boolean(e.showInPortal),meta:e.meta,installId:void 0};e.subscribe&&(i.installId=n);var s={method:"POST",headers:t.headers,body:JSON.stringify(i)};return fetch(r,s)}).then(function(e){return e.json()}):Promise.reject({error:"Name is required for channel creation when showInPortal is true"})}}]),e}()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Credentials=t.Client=void 0;var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(1);var o=c(n(0)),i=c(n(5)),s=c(n(4)),a=n(2),u=n(3);function c(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.Client=function(){function e(t,n){l(this,e),this.credentials=new f(t,n),this.sessionToken=(0,a.generateUUID)(),this.pushChannels=new i.PushChannelManager(this,this.credentials)}return r(e,[{key:"getInstallId",value:function(){return new Promise(function(e,t){s.exec(e,t,u.NativeModuleName,"getInstallId",[])})}},{key:"call",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.getInstallId().then(function(r){return t.doCall(r,e,n)})}},{key:"doCall",value:function(e,t){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(null==t||void 0==t||""==t.trim())throw new Error("API method cannot be empty.");var i=this.credentials.getApiKey(),s=o.ClientBaseUrl+"/b2.2/"+i+"/"+t+".json",u=new Headers;u.append("Authorization",this.credentials.authString),u.append("Content-Type","application/x-www-form-urlencoded");var c=(0,a.urlEncodedParams)({installId:e,sessionToken:this.sessionToken,params:r});return fetch(s,{method:"POST",headers:u,body:c}).then(function(e){return n.checkStatus(e)}).then(function(e){return n.parseJson(e)}).then(function(e){return n.handleResponse(e)}).catch(function(e){throw e})}},{key:"pushRemoveToken",value:function(){return new i.Push(this,this.credentials).pushRemoveToken()}},{key:"checkStatus",value:function(e){if(e.status>=200&&e.status<300)return e;var t=new h(e.statusText);throw t.response=e,t}},{key:"parseJson",value:function(e){return e.json()}},{key:"handleResponse",value:function(e){switch(null!=e.sessionToken&&(this.sessionToken=e.sessionToken),e.responseCode){case o.ResponseCode.SUCCESS:return e.payload;default:return Promise.reject(e)}}}]),e}();var h=function(e){function t(){return l(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,Error),t}(),f=t.Credentials=function(){function e(t,n){if(l(this,e),(0,a.empty)(t))throw new Error("API Key cannot be empty.");if((0,a.empty)(n))throw new Error("Secret Key cannot be empty.");this.apiKey=t,this.secretKey=n,this.authString=this.getAuthorizationString()}return r(e,[{key:"getAuthorizationString",value:function(){return"Basic "+btoa(this.apiKey+":"+this.secretKey)}}]),r(e,[{key:"getApiKey",value:function(){return this.apiKey}}]),e}()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(4)),o=n(3),i=n(2),s=n(6);var a=null,u=null,c={initialize:function(e){if((0,i.empty)(e.apiKey)||(0,i.empty)(e.secretKey))throw"API key and secret key are required options!";var t=[e.apiKey,e.secretKey];if((0,i.nullOrUndefined)(e.enableCrashReporting)?t.push(!1):t.push(e.enableCrashReporting),t.push(o.SdkInfo),t.push({id:o.CordovaRuntimeType,version:r.version}),r.exec(i.noop,i.noop,o.NativeModuleName,"initBaseSdk",t),a=new s.Client(e.apiKey,e.secretKey),e.enableCrashReporting){var l=function(e){c.trackEvent(o.KumulosEvent.CrashLoggedException,{format:o.CrashReportFormat,report:e.data}),e.onSuccess()};n.e(0).then(function(){var e=n(8);return"object"==typeof e&&e&&e.__esModule?e:Object.assign({},"object"==typeof e&&e,{default:e})}).then(function(e){(u=e.default.config("https://nokey@crash.kumulos.com/raven",{transport:l})).install()}).catch(function(e){return console.error(e)})}},getInstallId:function(){return a.getInstallId()},logException:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!u)return console.log("Crash reporting has not been enabled, ignoring exception:"),void console.error(e);u.captureException(e,{uncaught:!1,extra:t})},logUncaughtException:function(e){if(!u)return console.log("Crash reporting has not been enabled, ignoring exception:"),void console.error(e);u.captureException(e,{uncaught:!0})},call:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return a.call(e,t)},getPushSubscriptionManager:function(){return a.pushChannels},pushRemoveToken:function(){return a.pushRemoveToken()},pushStoreToken:function(e){r.exec(i.noop,i.noop,o.NativeModuleName,"pushStoreToken",[e])},pushTrackOpen:function(e){c.trackEvent(o.KumulosEvent.PushTrackOpen,{id:e})},trackEvent:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;r.exec(i.noop,i.noop,o.NativeModuleName,"trackEvent",[e,t,!1])},trackEventImmediately:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;r.exec(i.noop,i.noop,o.NativeModuleName,"trackEvent",[e,t,!0])},sendLocationUpdate:function(e){r.exec(i.noop,i.noop,o.NativeModuleName,"sendLocationUpdate",[e.lat,e.lng])},associateUserWithInstall:function(e){r.exec(i.noop,i.noop,o.NativeModuleName,"associateUserWithInstall",[e])},trackEddystoneBeaconProximity:function(e){c.trackEventImmediately(o.KumulosEvent.EngageBeaconEnteredProximity,Object.assign({type:o.BeaconType.Eddystone},e))},trackiBeaconProximity:function(e){c.trackEventImmediately(o.KumulosEvent.EngageBeaconEnteredProximity,Object.assign({type:o.BeaconType.iBeacon},e))}};t.default=c}]);