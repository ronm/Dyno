(function(w,d){
  var dyno = {
    ready:  function (fn) { 
      if(!fn) { return; }
      return (d.addEventListener) ? d.addEventListener("DOMContentLoaded", fn, false) : d.attachEvent("onreadystatechange", fn); 
    },

    docHead : (d.head || d.getElementsByTagName("head")[0]),
    docHTML : (d.documentElement || d.getElementsByTagName("html")[0]),
    canvasEl: d.createElement('canvas'),
    videoEl: d.createElement("video"), 
    audioEl: d.createElement("audio"),
    inputEl: d.createElement("input"),
    tempEl: d.createElement("dyno"),
    vendorPrefixes: ['', 'Ms', 'Moz', 'Webkit', 'O', 'Khtml'],
    camelCase: (function(string) { 
      var rdash = /-([a-z])/ig, 
          fcamelCase = function( all, letter ) { return letter.toUpperCase(); };
      return string.replace(rdash, fcamelCase); 
    }),   
    //mobileUserAgents: /(Android|iPhone|BlackBerry|Opera Mini|PalmOS|Symbian|Windows Phone)/i,

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
              d.removeEventListener("ElReady", ElReady, false);
              i++;
              if (items[i]) {loadAScript(items, items[i]);}
            };
            jsObj.addEventListener("load", ElReady, false);
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
      bgGradient: (function() {
        var vpf = dyno.vendorPrefixes, el = dyno.tempEl.style.backgroundImage, i=0;
        for (i;i<vpf.length;i++) {
          el = ((vpf[i]) ? vpf[i] : '') + 'linear-gradient(left, #000, #fff)';
          return el.indexOf('gradient') > -1;
        }
      }),
      borderImage: (function() { return dyno.helpers.support('border-image'); }),
      borderRadius: (function() { return dyno.helpers.support('border-radius'); }),            
      boxShadow: (function() { return dyno.helpers.support('box-shadow'); }),
      animation: (function() { return dyno.helpers.support('animation'); }),
      opacity: (function() { return dyno.helpers.support('opacity'); }),
      textShadow: (function() { return dyno.helpers.support('text-shadow'); }),

      rgba: function() {
        var ts = dyno.tempEl.style;
        ts.cssText = 'background-color:rgba(255,140,0,.1);';
        return !!(('' + ts.backgroundColor).indexOf('rgba') >= 0);
       },

      hsla: function() {
        // Same as rgba() some browsers convert hsla to rgba
        var ts = dyno.tempEl.style;
        ts.cssText = 'background-color:hsla(33, 100%, 50%,.1);';
        return !!(('' + ts.backgroundColor).indexOf('hsla') >=0 || ('' + ts.backgroundColor).indexOf('rgba') >= 0);
      },

      multiplebg: function() {
        var ts = dyno.tempEl.style;
        ts.background = 'url(https://),url(https://),orange url(https://)';
        return (/(url\s*\(.*?){3}/.test(ts.background));
      },

      applicationcache: (function() { return !!w.applicationCache; }),
      audio: (function() { return !!dyno.audioEl.canPlayType; }),
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
      video: (function() { return !!dyno.videoEl.canPlayType; }),
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
      	var inputEl = dyno.inputEl,
      		inputAttrs = [ "autocomplete", "autofocus", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "list", "max", "min", "multiple", "pattern", "placeholder", "required", "step", "width"],
      		inputAttrsSup = {};
        for (x in inputAttrs) {
    	  if (inputAttrs[x] in inputEl) {
      	    inputAttrsSup[inputAttrs[x]] = true;
    	  } else {
      	    inputAttrsSup[inputAttrs[x]] = false;
    	  }
    	  
    	  inputAttrsSup[inputAttrs[x]] = !!(inputAttrs[x] in inputEl);
  		}
  		return inputAttrsSup;
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
      var vpf = dyno.vendorPrefixes, el = dyno.tempEl.style, i=0;
      for (i;i<vpf.length;i++) {
        var cRule = (vpf[i]) ? vpf[i] + dyno.camelCase(p).replace(p.charAt(0), p.charAt(0).toUpperCase()) : dyno.camelCase(p);
        if (typeof el[cRule] === "string") {
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