(function(w,d){
  var dyno = {
    ready:  function (fn) { return (d.addEventListener) ? d.addEventListener("DOMReady", fn, false) : d.attachEvent("onreadystatechange", fn); },

    docHead : (d.head || d.getElementsByTagName("head")[0]),
    docHTML : (d.html || d.getElementsByTagName("html")[0]),
    canvasEl: d.createElement('canvas'),
    videoEl: d.createElement("video"), 
    //audioEl: d.createElement("audio"),
    tempEl: d.createElement("dyno"),
    vendorPrefixes: ['', 'Ms', 'Moz', 'Webkit', 'O', 'Khtml'],
    mobileUserAgents: /(Android|iPhone|BlackBerry|Opera Mini|PalmOS|Symbian|Windows Phone)/i,

    load: function () {
      var items = arguments;
      dyno.ready(dyno.loader(items));
      return dyno;
    },
  
    loader: function(items) {
      var i=0, js = [];
      loadAScript(items, items[i]);
      function loadAScript(items, item) {
        if ((i === items.length - 1) && (typeof item === "function")) { item.call(); } 
        else {
          var jsObj = d.createElement("script"), ElReady;
          jsObj.type = "text/javascript";
          jsObj.async = true;
          jsObj.src = item;
          if (d.addEventListener) {          
            ElReady = function() {
              d.removeEventListener("ElReady", ElReady);
              i++;
              if (items[i]) {loadAScript(items, items[i]);}
            };
            jsObj.addEventListener("load", ElReady);
          } else if (d.attachEvent) {
            ElReady = function() {
              if (d.readyState === "complete") { 
                d.detachEvent("onreadystatechange", ElReady );
                i++;
                if (items[i]) {loadAScript(items, items[i]);}
              }
            };
            jsObj.attachEvent("onreadystatechange", ElReady);
          }

          dyno.docHead.appendChild(jsObj);  
        }
      } // doscript
    },//loaders
          
    isWebkit: (/WebKit[\/\s](\d+\.\d+)/.test(navigator.userAgent)),
    isAndroid: (/Android[\/\s](\d+\.\d+)/.test(navigator.userAgent)),
    isMSIE: (/MSIE[\/\s](\d+\.\d+)/.test(navigator.userAgent)),
          
    feature: {

      backgroundSize: (function() { return dyno.helpers.support('background-size'); }),
      borderImage: (function() { return dyno.helpers.support('border-image'); }),
      borderRadius: (function() { return dyno.helpers.support('border-radius'); }),            
      boxShadow: (function() { return dyno.helpers.support('box-shadow'); }),
      animation: (function() { return dyno.helpers.support('animation'); }),
      opacity: (function() { return dyno.helpers.support('opacity'); }),
      textShadow: (function() { return dyno.helpers.support('text-shadow'); }),

      // http://css-tricks.com/rgba-browser-support/
      rgba: function() {
        var ts = dyno.tempEl.style;
        ts.backgroundColor = 'rgba(255,140,0,.1)';
        return !!(('' + ts.backgroundColor).indexOf('rgba') >= 0);
       },

      hsla: function() {
        // Same as rgba()
        var ts = dyno.tempEl.style;
        ts.backgroundColor = 'hsla(33, 100%, 50%,.1)';
        return !!(('' + ts.backgroundColor).indexOf('hsla') >=0 || ('' + ts.backgroundColor).indexOf('rgba') >= 0);
      },

      multiplebg: function() {
        var ts = dyno.tempEl.style;
        ts.background = 'url(https://),url(https://),orange url(https://)';
        return (/(url\s*\(.*?){3}/.test(ts.background));
      },

      applicationcache: (function() { return !!w.applicationCache; }),
      audio: (function() { 
        var audioEL = d.createElement('audio'); 
      	return !!audioEL.canPlayType; 
      }),
      canvas: (function() { return !!(dyno.canvasEl.getContext && dyno.canvasEl.getContext('2d')); }),
      canvastext: (function() { return !!(dyno.canvas && (typeof dyno.canvasEl.getContext('2d').fillText !== "undefined")); }),
      draganddrop: (function() { return !!(typeof dyno.tempEl.ondrag !== "undefined"); }),
      geolocation: (function() { return !!navigator.geolocation; }),
      hashchange: (function() { return !!(typeof w.onhashchange !== "undefined"); }),
      history: (function() { return !!w.history; }),
      indexeddb: (function () {
           var vpf = dyno.vendorPrefixes, moz_webkit = vpf.slice(2, 4), idb = false, i=0;
           for (i;i<moz_webkit.length;i++) {
             var pre = moz_webkit[i].toLowerCase();
             if(window[pre + '_indexedDB'] || window[pre + 'IndexedDB']) { 
               idb = true;
             }
           }
           return idb;
      }),
      localstorage: (function() { return !!w.localStorage; }),
      postmessage: (function() { return !!w.postMessage; }),
      sessionstorage: (function() { return !!w.sessionStorage; }),
      video: (function() { 
        var videoEl = d.createElement('video');
        return !!videoEl.canPlayType; 
      }),
      websockets: (function() { return !!w.WebSocket; }),
      websqldatabase: (function() { return !!w.openDatabase; }),
      webworkers: (function() { return !!w.Worker; }),
      rotate: (function() { return typeof orientation !== 'undefined'; }),
      touch: (function() {
        var el = dyno.tempEl;
        el.setAttribute('ongesturestart', 'return;');
        return (typeof el.ongesturestart === "function"); 
      }),
      inputAttrs: (function() {
      	var inputEl = d.createElement('input'),
      		inputAttrs = [ "autocomplete", "autofocus", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "list", "max", "min", "multiple", "pattern", "required", "step", "width"],
      		inputAttrsSup = {}, x;
        for (x in inputAttrs) {
    	  if (inputAttrs[x] in inputEl) {
      	    inputAttrsSup[inputAttrs[x]] = true;
    	  } else {
      	    inputAttrsSup[inputAttrs[x]] = false;
    	  }
  		}
  		return inputAttrsSup;
      }),
      inputTypes: (function() {
      	var inputEl = d.createElement('input'),
      		inputTypes = ["color", "date", "datetime", "datetime-local", "email", "month", "number", "range", "search", "tel", "time", "url", "week"],
      		inputTypesSup = {}, x;
        for (x in inputTypes) {
          inputEl.type = inputTypes[x];
          if (inputEl.type === inputTypes[x]) {
      	    inputTypesSup[inputTypes[x]] = true;
    	  } else {
      	    inputTypesSup[inputTypes[x]] = false;
    	  }
  		}
  		return inputTypesSup;
      })      
    }, //feature
    
 
    helpers: {
    
      addClass: function(g, t) {
        var c='', i=0;
        if (typeof g === "string") {
          c = " "+g;
        } else {
          for (i;i<g.length;i++) {
            c += " "+ g[i];
          }
        }
      
       if (t && (t.nodeType === 1)) { t.className += c; }
       else { d.documentElement.className += c; }
    },//addClass
    
    support: function(p) {
      var rdash = /-([a-z])/ig, 
      fcamelCase = function( all, letter ) { return letter.toUpperCase(); },
      camelCase = function(string) { return string.replace(rdash, fcamelCase); }, 
      vpf = dyno.vendorPrefixes, 
      el = dyno.tempEl,
      i=0;
      for (i;i<vpf.length;i++) {
        var cRule = (vpf[i]) ? vpf[i] + camelCase(p).replace(p[0], p[0].toUpperCase()) : camelCase(p);
        if (typeof el.style[cRule] === "string") {
          return true;
        }
      }          
    }// support    
  } // helpers

  }; //dyno

  /* Housekeeping */
  /*add Classes to html element*/
  var x;
  for (x in dyno.feature) { 
    if (dyno.feature.hasOwnProperty(x) && dyno.feature[x]() === true) {
      dyno.helpers.addClass(x);
    }
  }
  
  /* expose helper objects to dyno namepace */
  x='';
  for (x in dyno.helpers) {
    dyno[x] = dyno.helpers[x];
  }
  /* expose helper objects to dyno namepace */


  x='';
  for (x in dyno.feature) {
    dyno[x] = dyno.feature[x]();
  }

  /* namepsaceing */
  if(!w.dyno){w.dyno=dyno;}
  /* namepsaceing */
  
})(window, document);