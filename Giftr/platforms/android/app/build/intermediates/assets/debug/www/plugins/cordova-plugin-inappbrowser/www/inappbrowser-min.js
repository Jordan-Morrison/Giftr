cordova.define("cordova-plugin-inappbrowser.inappbrowser",function(e,n,o){!function(){function n(){this.channels={loadstart:i.create("loadstart"),loadstop:i.create("loadstop"),loaderror:i.create("loaderror"),exit:i.create("exit"),customscheme:i.create("customscheme")}}if(window.parent&&window.parent.ripple)return void(o.exports=window.open.bind(window));var r=e("cordova/exec"),i=e("cordova/channel"),t=e("cordova/modulemapper"),c=e("cordova/urlutil");n.prototype={_eventHandler:function(e){e&&e.type in this.channels&&this.channels[e.type].fire(e)},close:function(e){r(null,null,"InAppBrowser","close",[])},show:function(e){r(null,null,"InAppBrowser","show",[])},hide:function(e){r(null,null,"InAppBrowser","hide",[])},addEventListener:function(e,n){e in this.channels&&this.channels[e].subscribe(n)},removeEventListener:function(e,n){e in this.channels&&this.channels[e].unsubscribe(n)},executeScript:function(e,n){if(e.code)r(n,null,"InAppBrowser","injectScriptCode",[e.code,!!n]);else{if(!e.file)throw new Error("executeScript requires exactly one of code or file to be specified");r(n,null,"InAppBrowser","injectScriptFile",[e.file,!!n])}},insertCSS:function(e,n){if(e.code)r(n,null,"InAppBrowser","injectStyleCode",[e.code,!!n]);else{if(!e.file)throw new Error("insertCSS requires exactly one of code or file to be specified");r(n,null,"InAppBrowser","injectStyleFile",[e.file,!!n])}}},o.exports=function(e,o,i,l){if(window.frames&&window.frames[o]){return t.getOriginalSymbol(window,"open").apply(window,arguments)}e=c.makeAbsolute(e);var s=new n;l=l||{};for(var a in l)s.addEventListener(a,l[a]);var p=function(e){s._eventHandler(e)};return i=i||"",r(p,p,"InAppBrowser","open",[e,o,i]),s}}()});