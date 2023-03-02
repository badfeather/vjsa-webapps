/*
 bcrypt.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 Released under the Apache License, Version 2.0
 see: https://github.com/dcodeIO/bcrypt.js for details
*/
var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,g,p){a!=Array.prototype&&a!=Object.prototype&&(a[g]=p.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.Symbol=function(){var a=0;return function(g){return $jscomp.SYMBOL_PREFIX+(g||"")+a++}}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var g=0;return $jscomp.iteratorPrototype(function(){return g<a.length?{done:!1,value:a[g++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.makeIterator=function(a){$jscomp.initSymbolIterator();var g=a[Symbol.iterator];return g?g.call(a):$jscomp.arrayIterator(a)};
$jscomp.polyfill=function(a,g,p,q){if(g){p=$jscomp.global;a=a.split(".");for(q=0;q<a.length-1;q++){var h=a[q];h in p||(p[h]={});p=p[h]}a=a[a.length-1];q=p[a];g=g(q);g!=q&&null!=g&&$jscomp.defineProperty(p,a,{configurable:!0,writable:!0,value:g})}};$jscomp.FORCE_POLYFILL_PROMISE=!1;
$jscomp.polyfill("Promise",function(a){function g(){this.batch_=null}function p(b){return b instanceof h?b:new h(function(a,h){a(b)})}if(a&&!$jscomp.FORCE_POLYFILL_PROMISE)return a;g.prototype.asyncExecute=function(b){null==this.batch_&&(this.batch_=[],this.asyncExecuteBatch_());this.batch_.push(b);return this};g.prototype.asyncExecuteBatch_=function(){var b=this;this.asyncExecuteFunction(function(){b.executeBatch_()})};var q=$jscomp.global.setTimeout;g.prototype.asyncExecuteFunction=function(b){q(b,
0)};g.prototype.executeBatch_=function(){for(;this.batch_&&this.batch_.length;){var b=this.batch_;this.batch_=[];for(var a=0;a<b.length;++a){var h=b[a];delete b[a];try{h()}catch(t){this.asyncThrow_(t)}}}this.batch_=null};g.prototype.asyncThrow_=function(b){this.asyncExecuteFunction(function(){throw b;})};var h=function(b){this.state_=0;this.result_=void 0;this.onSettledCallbacks_=[];var a=this.createResolveAndReject_();try{b(a.resolve,a.reject)}catch(w){a.reject(w)}};h.prototype.createResolveAndReject_=
function(){function b(b){return function(A){h||(h=!0,b.call(a,A))}}var a=this,h=!1;return{resolve:b(this.resolveTo_),reject:b(this.reject_)}};h.prototype.resolveTo_=function(b){if(b===this)this.reject_(new TypeError("A Promise cannot resolve to itself"));else if(b instanceof h)this.settleSameAsPromise_(b);else{a:switch(typeof b){case "object":var a=null!=b;break a;case "function":a=!0;break a;default:a=!1}a?this.resolveToNonPromiseObj_(b):this.fulfill_(b)}};h.prototype.resolveToNonPromiseObj_=function(b){var a=
void 0;try{a=b.then}catch(w){this.reject_(w);return}"function"==typeof a?this.settleSameAsThenable_(a,b):this.fulfill_(b)};h.prototype.reject_=function(a){this.settle_(2,a)};h.prototype.fulfill_=function(a){this.settle_(1,a)};h.prototype.settle_=function(a,h){if(0!=this.state_)throw Error("Cannot settle("+a+", "+h|"): Promise already settled in state"+this.state_);this.state_=a;this.result_=h;this.executeOnSettledCallbacks_()};h.prototype.executeOnSettledCallbacks_=function(){if(null!=this.onSettledCallbacks_){for(var a=
this.onSettledCallbacks_,h=0;h<a.length;++h)a[h].call(),a[h]=null;this.onSettledCallbacks_=null}};var v=new g;h.prototype.settleSameAsPromise_=function(a){var b=this.createResolveAndReject_();a.callWhenSettled_(b.resolve,b.reject)};h.prototype.settleSameAsThenable_=function(a,h){var b=this.createResolveAndReject_();try{a.call(h,b.resolve,b.reject)}catch(t){b.reject(t)}};h.prototype.then=function(a,g){function b(a,b){return"function"==typeof a?function(b){try{t(a(b))}catch(u){m(u)}}:b}var t,m,p=new h(function(a,
b){t=a;m=b});this.callWhenSettled_(b(a,t),b(g,m));return p};h.prototype.catch=function(a){return this.then(void 0,a)};h.prototype.callWhenSettled_=function(a,h){function b(){switch(g.state_){case 1:a(g.result_);break;case 2:h(g.result_);break;default:throw Error("Unexpected state: "+g.state_);}}var g=this;null==this.onSettledCallbacks_?v.asyncExecute(b):this.onSettledCallbacks_.push(function(){v.asyncExecute(b)})};h.resolve=p;h.reject=function(a){return new h(function(b,h){h(a)})};h.race=function(a){return new h(function(b,
h){for(var g=$jscomp.makeIterator(a),m=g.next();!m.done;m=g.next())p(m.value).callWhenSettled_(b,h)})};h.all=function(a){var b=$jscomp.makeIterator(a),g=b.next();return g.done?p([]):new h(function(a,h){function m(b){return function(h){r[b]=h;q--;0==q&&a(r)}}var r=[],q=0;do r.push(void 0),q++,p(g.value).callWhenSettled_(m(r.length-1),h),g=b.next();while(!g.done)})};return h},"es6","es3");
(function(a,g){"function"===typeof define&&define.amd?define([],g):"function"===typeof require&&"object"===typeof module&&module&&module.exports?module.exports=g():(a.dcodeIO=a.dcodeIO||{}).bcrypt=g()})(this,function(){function a(n){if("undefined"!==typeof module&&module&&module.exports)try{return require("crypto").randomBytes(n)}catch(l){}try{var k;(self.crypto||self.msCrypto).getRandomValues(k=new Uint32Array(n));return Array.prototype.slice.call(k)}catch(l){}if(!z)throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
return z(n)}function g(n,k){for(var a=n.length^k.length,c=0;c<n.length;++c)a|=n.charCodeAt(c)^k.charCodeAt(c);return 0===a}function p(n,k){var a=0,c=[];if(0>=k||k>n.length)throw Error("Illegal len: "+k);for(;a<k;){var e=n[a++]&255;c.push(x[e>>2&63]);e=(e&3)<<4;if(a>=k){c.push(x[e&63]);break}var f=n[a++]&255;e|=f>>4&15;c.push(x[e&63]);e=(f&15)<<2;if(a>=k){c.push(x[e&63]);break}f=n[a++]&255;e|=f>>6&3;c.push(x[e&63]);c.push(x[f&63])}return c.join("")}function q(a,k){var n=0,c=a.length,e=0,f=[];if(0>=
k)throw Error("Illegal len: "+k);for(;n<c-1&&e<k;){var d=a.charCodeAt(n++);var b=d<u.length?u[d]:-1;d=a.charCodeAt(n++);var h=d<u.length?u[d]:-1;if(-1==b||-1==h)break;d=b<<2>>>0;d|=(h&48)>>4;f.push(B(d));if(++e>=k||n>=c)break;d=a.charCodeAt(n++);b=d<u.length?u[d]:-1;if(-1==b)break;d=(h&15)<<4>>>0;d|=(b&60)>>2;f.push(B(d));if(++e>=k||n>=c)break;d=a.charCodeAt(n++);h=d<u.length?u[d]:-1;d=(b&3)<<6>>>0;d|=h;f.push(B(d));++e}a=[];for(n=0;n<e;n++)a.push(f[n].charCodeAt(0));return a}function h(a,k,l,c){var e=
a[k],f=a[k+1];e^=l[0];var d=c[e>>>24];d+=c[256|e>>16&255];d^=c[512|e>>8&255];d+=c[768|e&255];f^=d^l[1];d=c[f>>>24];d+=c[256|f>>16&255];d^=c[512|f>>8&255];d+=c[768|f&255];e^=d^l[2];d=c[e>>>24];d+=c[256|e>>16&255];d^=c[512|e>>8&255];d+=c[768|e&255];f^=d^l[3];d=c[f>>>24];d+=c[256|f>>16&255];d^=c[512|f>>8&255];d+=c[768|f&255];e^=d^l[4];d=c[e>>>24];d+=c[256|e>>16&255];d^=c[512|e>>8&255];d+=c[768|e&255];f^=d^l[5];d=c[f>>>24];d+=c[256|f>>16&255];d^=c[512|f>>8&255];d+=c[768|f&255];e^=d^l[6];d=c[e>>>24];d+=
c[256|e>>16&255];d^=c[512|e>>8&255];d+=c[768|e&255];f^=d^l[7];d=c[f>>>24];d+=c[256|f>>16&255];d^=c[512|f>>8&255];d+=c[768|f&255];e^=d^l[8];d=c[e>>>24];d+=c[256|e>>16&255];d^=c[512|e>>8&255];d+=c[768|e&255];f^=d^l[9];d=c[f>>>24];d+=c[256|f>>16&255];d^=c[512|f>>8&255];d+=c[768|f&255];e^=d^l[10];d=c[e>>>24];d+=c[256|e>>16&255];d^=c[512|e>>8&255];d+=c[768|e&255];f^=d^l[11];d=c[f>>>24];d+=c[256|f>>16&255];d^=c[512|f>>8&255];d+=c[768|f&255];e^=d^l[12];d=c[e>>>24];d+=c[256|e>>16&255];d^=c[512|e>>8&255];
d+=c[768|e&255];f^=d^l[13];d=c[f>>>24];d+=c[256|f>>16&255];d^=c[512|f>>8&255];d+=c[768|f&255];e^=d^l[14];d=c[e>>>24];d+=c[256|e>>16&255];d^=c[512|e>>8&255];d+=c[768|e&255];f^=d^l[15];d=c[f>>>24];d+=c[256|f>>16&255];d^=c[512|f>>8&255];d+=c[768|f&255];e^=d^l[16];a[k]=f^l[17];a[k+1]=e;return a}function v(a,k){for(var n=0,c=0;4>n;++n)c=c<<8|a[k]&255,k=(k+1)%a.length;return{key:c,offp:k}}function b(a,k,l){for(var c=0,e=[0,0],f=k.length,d=l.length,n,b=0;b<f;b++)n=v(a,c),c=n.offp,k[b]^=n.key;for(b=0;b<f;b+=
2)e=h(e,0,k,l),k[b]=e[0],k[b+1]=e[1];for(b=0;b<d;b+=2)e=h(e,0,k,l),l[b]=e[0],l[b+1]=e[1]}function A(a,k,b,c){for(var e=0,f=[0,0],d=b.length,n=c.length,l,g=0;g<d;g++)l=v(k,e),e=l.offp,b[g]^=l.key;for(g=e=0;g<d;g+=2)l=v(a,e),e=l.offp,f[0]^=l.key,l=v(a,e),e=l.offp,f[1]^=l.key,f=h(f,0,b,c),b[g]=f[0],b[g+1]=f[1];for(g=0;g<n;g+=2)l=v(a,e),e=l.offp,f[0]^=l.key,l=v(a,e),e=l.offp,f[1]^=l.key,f=h(f,0,b,c),c[g]=f[0],c[g+1]=f[1]}function w(a,k,l,c,e){function f(){e&&e(m/l);if(m<l)for(var g=Date.now();m<l&&!(m+=
1,b(a,q,y),b(k,q,y),100<Date.now()-g););else{for(m=0;64>m;m++)for(p=0;p<n>>1;p++)h(d,p<<1,q,y);g=[];for(m=0;m<n;m++)g.push((d[m]>>24&255)>>>0),g.push((d[m]>>16&255)>>>0),g.push((d[m]>>8&255)>>>0),g.push((d[m]&255)>>>0);if(c){c(null,g);return}return g}c&&r(f)}var d=C.slice(),n=d.length;if(4>l||31<l){var g=Error("Illegal number of rounds (4-31): "+l);if(c){r(c.bind(this,g));return}throw g;}if(16!==k.length){g=Error("Illegal salt length: "+k.length+" != 16");if(c){r(c.bind(this,g));return}throw g;}l=
1<<l>>>0;var m=0,p;if(Int32Array){var q=new Int32Array(D);var y=new Int32Array(E)}else q=D.slice(),y=E.slice();A(k,a,q,y);if("undefined"!==typeof c)f();else for(;;)if("undefined"!==typeof(g=f()))return g||[]}function t(a,k,b,c){function e(a){var c=[];c.push("$2");"a"<=f&&c.push(f);c.push("$");10>l&&c.push("0");c.push(l.toString());c.push("$");c.push(p(h,h.length));c.push(p(a,4*C.length-1));return c.join("")}if("string"!==typeof a||"string"!==typeof k){c=Error("Invalid string / salt: Not a string");
if(b){r(b.bind(this,c));return}throw c;}if("$"!==k.charAt(0)||"2"!==k.charAt(1)){c=Error("Invalid salt version: "+k.substring(0,2));if(b){r(b.bind(this,c));return}throw c;}if("$"===k.charAt(2)){var f=String.fromCharCode(0);var d=3}else{f=k.charAt(2);if("a"!==f&&"b"!==f&&"y"!==f||"$"!==k.charAt(3)){c=Error("Invalid salt revision: "+k.substring(2,4));if(b){r(b.bind(this,c));return}throw c;}d=4}if("$"<k.charAt(d+2)){c=Error("Missing salt rounds");if(b){r(b.bind(this,c));return}throw c;}var n=10*parseInt(k.substring(d,
d+1),10),g=parseInt(k.substring(d+1,d+2),10),l=n+g;k=k.substring(d+3,d+25);a=F(a+("a"<=f?"\x00":""));var h=q(k,16);if("undefined"==typeof b)return e(w(a,h,l));w(a,h,l,function(c,a){c?b(c,null):b(null,e(a))},c)}var m={},z=null;try{a(1)}catch(n){}z=null;m.setRandomFallback=function(a){z=a};m.genSaltSync=function(b,k){b=b||10;if("number"!==typeof b)throw Error("Illegal arguments: "+typeof b+", "+typeof k);4>b?b=4:31<b&&(b=31);k=[];k.push("$2a$");10>b&&k.push("0");k.push(b.toString());k.push("$");k.push(p(a(16),
16));return k.join("")};m.genSalt=function(a,b,g){function c(c){r(function(){try{c(null,m.genSaltSync(a))}catch(f){c(f)}})}"function"===typeof b&&(g=b,b=void 0);"function"===typeof a&&(g=a,a=void 0);if("undefined"===typeof a)a=10;else if("number"!==typeof a)throw Error("illegal arguments: "+typeof a);if(g){if("function"!==typeof g)throw Error("Illegal callback: "+typeof g);c(g)}else return new Promise(function(a,b){c(function(c,f){c?b(c):a(f)})})};m.hashSync=function(a,b){"undefined"===typeof b&&
(b=10);"number"===typeof b&&(b=m.genSaltSync(b));if("string"!==typeof a||"string"!==typeof b)throw Error("Illegal arguments: "+typeof a+", "+typeof b);return t(a,b)};m.hash=function(a,b,g,c){function e(f){"string"===typeof a&&"number"===typeof b?m.genSalt(b,function(b,e){t(a,e,f,c)}):"string"===typeof a&&"string"===typeof b?t(a,b,f,c):r(f.bind(this,Error("Illegal arguments: "+typeof a+", "+typeof b)))}if(g){if("function"!==typeof g)throw Error("Illegal callback: "+typeof g);e(g)}else return new Promise(function(a,
c){e(function(b,d){b?c(b):a(d)})})};m.compareSync=function(a,b){if("string"!==typeof a||"string"!==typeof b)throw Error("Illegal arguments: "+typeof a+", "+typeof b);return 60!==b.length?!1:g(m.hashSync(a,b.substr(0,b.length-31)),b)};m.compare=function(a,b,h,c){function e(f){"string"!==typeof a||"string"!==typeof b?r(f.bind(this,Error("Illegal arguments: "+typeof a+", "+typeof b))):60!==b.length?r(f.bind(this,null,!1)):m.hash(a,b.substr(0,29),function(a,c){a?f(a):f(null,g(c,b))},c)}if(h){if("function"!==
typeof h)throw Error("Illegal callback: "+typeof h);e(h)}else return new Promise(function(a,c){e(function(b,d){b?c(b):a(d)})})};m.getRounds=function(a){if("string"!==typeof a)throw Error("Illegal arguments: "+typeof a);return parseInt(a.split("$")[2],10)};m.getSalt=function(a){if("string"!==typeof a)throw Error("Illegal arguments: "+typeof a);if(60!==a.length)throw Error("Illegal hash length: "+a.length+" != 60");return a.substring(0,29)};var r="undefined"!==typeof process&&process&&"function"===
typeof process.nextTick?"function"===typeof setImmediate?setImmediate:process.nextTick:setTimeout,F=function(a){var b=0,g;var c=Array;for(var e=0,f,d=0;d<a.length;++d)f=a.charCodeAt(d),128>f?e+=1:2048>f?e+=2:55296===(f&64512)&&56320===(a.charCodeAt(d+1)&64512)?(++d,e+=4):e+=3;e=new c(e);f=0;for(d=a.length;f<d;++f)c=a.charCodeAt(f),128>c?e[b++]=c:(2048>c?e[b++]=c>>6|192:(55296===(c&64512)&&56320===((g=a.charCodeAt(f+1))&64512)?(c=65536+((c&1023)<<10)+(g&1023),++f,e[b++]=c>>18|240,e[b++]=c>>12&63|128):
e[b++]=c>>12|224,e[b++]=c>>6&63|128),e[b++]=c&63|128);return e},x="./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),u=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,54,55,56,57,58,59,60,61,62,63,-1,-1,-1,-1,-1,-1,-1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,-1,-1,-1,-1,-1,-1,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,
53,-1,-1,-1,-1,-1],B=String.fromCharCode;Date.now=Date.now||function(){return+new Date};var D=[608135816,2242054355,320440878,57701188,2752067618,698298832,137296536,3964562569,1160258022,953160567,3193202383,887688300,3232508343,3380367581,1065670069,3041331479,2450970073,2306472731],E=[3509652390,2564797868,805139163,3491422135,3101798381,1780907670,3128725573,4046225305,614570311,3012652279,134345442,2240740374,1667834072,1901547113,2757295779,4103290238,227898511,1921955416,1904987480,2182433518,
2069144605,3260701109,2620446009,720527379,3318853667,677414384,3393288472,3101374703,2390351024,1614419982,1822297739,2954791486,3608508353,3174124327,2024746970,1432378464,3864339955,2857741204,1464375394,1676153920,1439316330,715854006,3033291828,289532110,2706671279,2087905683,3018724369,1668267050,732546397,1947742710,3462151702,2609353502,2950085171,1814351708,2050118529,680887927,999245976,1800124847,3300911131,1713906067,1641548236,4213287313,1216130144,1575780402,4018429277,3917837745,3693486850,
3949271944,596196993,3549867205,258830323,2213823033,772490370,2760122372,1774776394,2652871518,566650946,4142492826,1728879713,2882767088,1783734482,3629395816,2517608232,2874225571,1861159788,326777828,3124490320,2130389656,2716951837,967770486,1724537150,2185432712,2364442137,1164943284,2105845187,998989502,3765401048,2244026483,1075463327,1455516326,1322494562,910128902,469688178,1117454909,936433444,3490320968,3675253459,1240580251,122909385,2157517691,634681816,4142456567,3825094682,3061402683,
2540495037,79693498,3249098678,1084186820,1583128258,426386531,1761308591,1047286709,322548459,995290223,1845252383,2603652396,3431023940,2942221577,3202600964,3727903485,1712269319,422464435,3234572375,1170764815,3523960633,3117677531,1434042557,442511882,3600875718,1076654713,1738483198,4213154764,2393238008,3677496056,1014306527,4251020053,793779912,2902807211,842905082,4246964064,1395751752,1040244610,2656851899,3396308128,445077038,3742853595,3577915638,679411651,2892444358,2354009459,1767581616,
3150600392,3791627101,3102740896,284835224,4246832056,1258075500,768725851,2589189241,3069724005,3532540348,1274779536,3789419226,2764799539,1660621633,3471099624,4011903706,913787905,3497959166,737222580,2514213453,2928710040,3937242737,1804850592,3499020752,2949064160,2386320175,2390070455,2415321851,4061277028,2290661394,2416832540,1336762016,1754252060,3520065937,3014181293,791618072,3188594551,3933548030,2332172193,3852520463,3043980520,413987798,3465142937,3030929376,4245938359,2093235073,3534596313,
375366246,2157278981,2479649556,555357303,3870105701,2008414854,3344188149,4221384143,3956125452,2067696032,3594591187,2921233993,2428461,544322398,577241275,1471733935,610547355,4027169054,1432588573,1507829418,2025931657,3646575487,545086370,48609733,2200306550,1653985193,298326376,1316178497,3007786442,2064951626,458293330,2589141269,3591329599,3164325604,727753846,2179363840,146436021,1461446943,4069977195,705550613,3059967265,3887724982,4281599278,3313849956,1404054877,2845806497,146425753,1854211946,
1266315497,3048417604,3681880366,3289982499,290971E4,1235738493,2632868024,2414719590,3970600049,1771706367,1449415276,3266420449,422970021,1963543593,2690192192,3826793022,1062508698,1531092325,1804592342,2583117782,2714934279,4024971509,1294809318,4028980673,1289560198,2221992742,1669523910,35572830,157838143,1052438473,1016535060,1802137761,1753167236,1386275462,3080475397,2857371447,1040679964,2145300060,2390574316,1461121720,2956646967,4031777805,4028374788,33600511,2920084762,1018524850,629373528,
3691585981,3515945977,2091462646,2486323059,586499841,988145025,935516892,3367335476,2599673255,2839830854,265290510,3972581182,2759138881,3795373465,1005194799,847297441,406762289,1314163512,1332590856,1866599683,4127851711,750260880,613907577,1450815602,3165620655,3734664991,3650291728,3012275730,3704569646,1427272223,778793252,1343938022,2676280711,2052605720,1946737175,3164576444,3914038668,3967478842,3682934266,1661551462,3294938066,4011595847,840292616,3712170807,616741398,312560963,711312465,
1351876610,322626781,1910503582,271666773,2175563734,1594956187,70604529,3617834859,1007753275,1495573769,4069517037,2549218298,2663038764,504708206,2263041392,3941167025,2249088522,1514023603,1998579484,1312622330,694541497,2582060303,2151582166,1382467621,776784248,2618340202,3323268794,2497899128,2784771155,503983604,4076293799,907881277,423175695,432175456,1378068232,4145222326,3954048622,3938656102,3820766613,2793130115,2977904593,26017576,3274890735,3194772133,1700274565,1756076034,4006520079,
3677328699,720338349,1533947780,354530856,688349552,3973924725,1637815568,332179504,3949051286,53804574,2852348879,3044236432,1282449977,3583942155,3416972820,4006381244,1617046695,2628476075,3002303598,1686838959,431878346,2686675385,1700445008,1080580658,1009431731,832498133,3223435511,2605976345,2271191193,2516031870,1648197032,4164389018,2548247927,300782431,375919233,238389289,3353747414,2531188641,2019080857,1475708069,455242339,2609103871,448939670,3451063019,1395535956,2413381860,1841049896,
1491858159,885456874,4264095073,4001119347,1565136089,3898914787,1108368660,540939232,1173283510,2745871338,3681308437,4207628240,3343053890,4016749493,1699691293,1103962373,3625875870,2256883143,3830138730,1031889488,3479347698,1535977030,4236805024,3251091107,2132092099,1774941330,1199868427,1452454533,157007616,2904115357,342012276,595725824,1480756522,206960106,497939518,591360097,863170706,2375253569,3596610801,1814182875,2094937945,3421402208,1082520231,3463918190,2785509508,435703966,3908032597,
1641649973,2842273706,3305899714,1510255612,2148256476,2655287854,3276092548,4258621189,236887753,3681803219,274041037,1734335097,3815195456,3317970021,1899903192,1026095262,4050517792,356393447,2410691914,3873677099,3682840055,3913112168,2491498743,4132185628,2489919796,1091903735,1979897079,3170134830,3567386728,3557303409,857797738,1136121015,1342202287,507115054,2535736646,337727348,3213592640,1301675037,2528481711,1895095763,1721773893,3216771564,62756741,2142006736,835421444,2531993523,1442658625,
3659876326,2882144922,676362277,1392781812,170690266,3921047035,1759253602,3611846912,1745797284,664899054,1329594018,3901205900,3045908486,2062866102,2865634940,3543621612,3464012697,1080764994,553557557,3656615353,3996768171,991055499,499776247,1265440854,648242737,3940784050,980351604,3713745714,1749149687,3396870395,4211799374,3640570775,1161844396,3125318951,1431517754,545492359,4268468663,3499529547,1437099964,2702547544,3433638243,2581715763,2787789398,1060185593,1593081372,2418618748,4260947970,
69676912,2159744348,86519011,2512459080,3838209314,1220612927,3339683548,133810670,1090789135,1078426020,1569222167,845107691,3583754449,4072456591,1091646820,628848692,1613405280,3757631651,526609435,236106946,48312990,2942717905,3402727701,1797494240,859738849,992217954,4005476642,2243076622,3870952857,3732016268,765654824,3490871365,2511836413,1685915746,3888969200,1414112111,2273134842,3281911079,4080962846,172450625,2569994100,980381355,4109958455,2819808352,2716589560,2568741196,3681446669,
3329971472,1835478071,660984891,3704678404,4045999559,3422617507,3040415634,1762651403,1719377915,3470491036,2693910283,3642056355,3138596744,1364962596,2073328063,1983633131,926494387,3423689081,2150032023,4096667949,1749200295,3328846651,309677260,2016342300,1779581495,3079819751,111262694,1274766160,443224088,298511866,1025883608,3806446537,1145181785,168956806,3641502830,3584813610,1689216846,3666258015,3200248200,1692713982,2646376535,4042768518,1618508792,1610833997,3523052358,4130873264,2001055236,
3610705100,2202168115,4028541809,2961195399,1006657119,2006996926,3186142756,1430667929,3210227297,1314452623,4074634658,4101304120,2273951170,1399257539,3367210612,3027628629,1190975929,2062231137,2333990788,2221543033,2438960610,1181637006,548689776,2362791313,3372408396,3104550113,3145860560,296247880,1970579870,3078560182,3769228297,1714227617,3291629107,3898220290,166772364,1251581989,493813264,448347421,195405023,2709975567,677966185,3703036547,1463355134,2715995803,1338867538,1343315457,2802222074,
2684532164,233230375,2599980071,2000651841,3277868038,1638401717,4028070440,3237316320,6314154,819756386,300326615,590932579,1405279636,3267499572,3150704214,2428286686,3959192993,3461946742,1862657033,1266418056,963775037,2089974820,2263052895,1917689273,448879540,3550394620,3981727096,150775221,3627908307,1303187396,508620638,2975983352,2726630617,1817252668,1876281319,1457606340,908771278,3720792119,3617206836,2455994898,1729034894,1080033504,976866871,3556439503,2881648439,1522871579,1555064734,
1336096578,3548522304,2579274686,3574697629,3205460757,3593280638,3338716283,3079412587,564236357,2993598910,1781952180,1464380207,3163844217,3332601554,1699332808,1393555694,1183702653,3581086237,1288719814,691649499,2847557200,2895455976,3193889540,2717570544,1781354906,1676643554,2592534050,3230253752,1126444790,2770207658,2633158820,2210423226,2615765581,2414155088,3127139286,673620729,2805611233,1269405062,4015350505,3341807571,4149409754,1057255273,2012875353,2162469141,2276492801,2601117357,
993977747,3918593370,2654263191,753973209,36408145,2530585658,25011837,3520020182,2088578344,530523599,2918365339,1524020338,1518925132,3760827505,3759777254,1202760957,3985898139,3906192525,674977740,4174734889,2031300136,2019492241,3983892565,4153806404,3822280332,352677332,2297720250,60907813,90501309,3286998549,1016092578,2535922412,2839152426,457141659,509813237,4120667899,652014361,1966332200,2975202805,55981186,2327461051,676427537,3255491064,2882294119,3433927263,1307055953,942726286,933058658,
2468411793,3933900994,4215176142,1361170020,2001714738,2830558078,3274259782,1222529897,1679025792,2729314320,3714953764,1770335741,151462246,3013232138,1682292957,1483529935,471910574,1539241949,458788160,3436315007,1807016891,3718408830,978976581,1043663428,3165965781,1927990952,4200891579,2372276910,3208408903,3533431907,1412390302,2931980059,4132332400,1947078029,3881505623,4168226417,2941484381,1077988104,1320477388,886195818,18198404,3786409E3,2509781533,112762804,3463356488,1866414978,891333506,
18488651,661792760,1628790961,3885187036,3141171499,876946877,2693282273,1372485963,791857591,2686433993,3759982718,3167212022,3472953795,2716379847,445679433,3561995674,3504004811,3574258232,54117162,3331405415,2381918588,3769707343,4154350007,1140177722,4074052095,668550556,3214352940,367459370,261225585,2610173221,4209349473,3468074219,3265815641,314222801,3066103646,3808782860,282218597,3406013506,3773591054,379116347,1285071038,846784868,2669647154,3771962079,3550491691,2305946142,453669953,
1268987020,3317592352,3279303384,3744833421,2610507566,3859509063,266596637,3847019092,517658769,3462560207,3443424879,370717030,4247526661,2224018117,4143653529,4112773975,2788324899,2477274417,1456262402,2901442914,1517677493,1846949527,2295493580,3734397586,2176403920,1280348187,1908823572,3871786941,846861322,1172426758,3287448474,3383383037,1655181056,3139813346,901632758,1897031941,2986607138,3066810236,3447102507,1393639104,373351379,950779232,625454576,3124240540,4148612726,2007998917,544563296,
2244738638,2330496472,2058025392,1291430526,424198748,50039436,29584100,3605783033,2429876329,2791104160,1057563949,3255363231,3075367218,3463963227,1469046755,985887462],C=[1332899944,1700884034,1701343084,1684370003,1668446532,1869963892];m.encodeBase64=p;m.decodeBase64=q;return m});

let {bcrypt} = dcodeIO;

// Token/session duration
// Default, 15 minutes from now in seconds (for testing purposes)
// 2 weeks is typical with many apps
let tokenDuration = 60 * 15;

// Restrict usernames that can be created
// Set to null to allow open registration
// let allowedUsernames = [];
let allowedUsernames = null;

// Headers
// Change origin if desired
let headers = new Headers({
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, HEAD, OPTIONS',
	'Access-Control-Allow-Headers': '*'
});

/**
 * Get credentials from a request
 * @param  {Request}  request The request object
 * @return {Object}           The credentials
 */
function getCredentials (request) {

	// Get the authorization header
	let [scheme, encoded] = request.headers.get('Authorization').split(' ');

	// If Basic Auth, get username/password
	if (scheme === 'Basic') {
		let buffer = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
		let decoded = new TextDecoder().decode(buffer).normalize();
		let index = decoded.indexOf(':');
		return {
			username: decoded.substring(0, index),
			password: decoded.substring(index + 1)
		};
	}

	// if Bearer, get token
	if (scheme === 'Bearer') {
		return encoded;
	}

}

/**
 * Create a unique token
 * @return {[type]} [description]
 */
async function createToken () {

	// Create a token
	let token = crypto.randomUUID();

	// Make sure it doesn't already exist
	let existing = await TOKENS.get(token);

	// If it's unique, return it
	if (existing === null) {
		return token;
	}

	// Otherwise, try again
	return await createToken();

}

/**
 * Handle POST methods
 * @param  {Request}  request The request object
 * @return {Response}         The response object
 */
async function handlePOST (request) {

	// Get credentials
	let {username, password} = getCredentials(request);

	// Get user from database
	let user = await USERS.get(username);

	// If username/password is not correct, throw an error
	if (user === null || !bcrypt.compareSync(password, user)) {
		return new Response('Invalid username or password', {
			status: 401,
			headers
		});
	}

	// Create a unique token
	let token = await createToken();

	// Save the token to the database
	// Will auto-delete after tokenDuration
	let created = TOKENS.put(token, username, {expirationTtl: tokenDuration});

	// If there was a problem, return an error
	if (created === null) {
		return new Response('Unable to log in at this time', {
			status: 500,
			headers
		});
	}

	// Otherwise, return the token
	return new Response(JSON.stringify({token}), {
		status: 200,
		headers
	});

}

/**
 * Handle PUT methods
 * @param  {Request}  request The request object
 * @return {Response}         The response object
 */
async function handlePUT (request) {

	// Get credentials
	let {username, password} = getCredentials(request);

	// Make sure username is allowed
	if (allowedUsernames && !allowedUsernames.includes(username)) {
		return new Response('Unable to create a user at this time', {
			status: 500,
			headers
		});
	}

	// Get user from database
	let user = await USERS.get(username);

	// If username already exists, throw an error
	if (user !== null) {
		return new Response('User already exists', {
			status: 400,
			headers
		});
	}

	// Hash password
	let hash = bcrypt.hashSync(password);

	// Save the user to the database
	let created = USERS.put(username, hash);

	// If there was a problem, return an error
	if (created === null) {
		return new Response('Unable to create a user at this time', {
			status: 500,
			headers
		});
	}

	// Otherwise, return the token
	return new Response('User created', {
		status: 200,
		headers
	});

}

/**
 * Handle DELETE methods
 * @param  {Request}  request The request object
 * @return {Response}         The response object
 */
async function handleDELETE (request) {

	// Get credentials
	let token = getCredentials(request);

	// Delete the associated token
	let user = await TOKENS.delete(token);

	// Return success message
	return new Response('Logged out', {
		status: 200,
		headers
	});

}

/**
 * Handle GET methods
 * @param  {Request}  request The request object
 * @return {Response}         The response object
 */
async function handleGET (request) {

	// Get the token
	let token = new URL(request.url).searchParams.get('token');

	// If there's no token, return error
	if (token === null) {
		return new Response('No token provided', {
			status: 400,
			headers
		});
	}

	// Get the user
	let user = await TOKENS.get(token);

	// If there's no user, return error
	if (user === null) {
		return new Response('User not logged in', {
			status: 401,
			headers
		});
	}

	// Return success message
	return new Response(user, {
		status: 200,
		headers
	});

}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {

	// HEAD/OPTIONS requests
	if (['HEAD', 'OPTIONS'].includes(request.method)) {
		return new Response('ok', {
			status: 200,
			headers
		});
	}

	// POST requests
	if (request.method === 'POST') {
		return await handlePOST(request);
	}

	// PUT requests
	if (request.method === 'PUT') {
		return await handlePUT(request);
	}

	// DELETE requests
	if (request.method === 'DELETE') {
		return await handleDELETE(request);
	}

	// GET requests
	if (request.method === 'GET') {
		return await handleGET(request);
	}

	// Everything else
	return new Response('Not allowed', {
		status: 400,
		headers
	});

}

// Listen for API calls
addEventListener('fetch', function (event) {
	event.respondWith(handleRequest(event.request));
});
