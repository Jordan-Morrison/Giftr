function onMessageFromNative(e){var n=require("cordova"),t=e.action;switch(t){case"backbutton":case"menubutton":case"searchbutton":case"pause":case"volumedownbutton":case"volumeupbutton":n.fireDocumentEvent(t);break;case"resume":if(arguments.length>1&&e.pendingResult){if(2===arguments.length)e.pendingResult.result=arguments[1];else{for(var o=[],u=1;u<arguments.length;u++)o.push(arguments[u]);e.pendingResult.result=o}lastResumeEvent=e}n.fireDocumentEvent(t,e);break;default:throw new Error("Unknown event action "+t)}}var lastResumeEvent=null;module.exports={id:"android",bootstrap:function(){function e(e){t.addDocumentEventHandler(e+"button").onHasSubscribersChange=function(){o(null,null,r,"overrideButton",[e,1==this.numHandlers])}}var n=require("cordova/channel"),t=require("cordova"),o=require("cordova/exec"),u=require("cordova/modulemapper");o.init(),u.clobbers("cordova/plugin/android/app","navigator.app");var r=Number(t.platformVersion.split(".")[0])>=4?"CoreAndroid":"App";t.addDocumentEventHandler("backbutton").onHasSubscribersChange=function(){o(null,null,r,"overrideBackbutton",[1==this.numHandlers])},t.addDocumentEventHandler("menubutton"),t.addDocumentEventHandler("searchbutton"),e("volumeup"),e("volumedown");var a=document.addEventListener;document.addEventListener=function(e,n,t){a(e,n,t),"resume"===e&&lastResumeEvent&&n(lastResumeEvent)},n.onCordovaReady.subscribe(function(){o(onMessageFromNative,null,r,"messageChannel",[]),o(null,null,r,"show",[])})}};