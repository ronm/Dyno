Dyno JS
=============

Dyno is a small script loader and html5 api / css capabilty discovery.

Support
-------

Currently supporting:

### Mobile

* no-touch

### HTML5

* applicationcache
* audio
* draganddrop
* geolocation
* hashchange
* history
* indexeddb
* localstorage
* postmessage
* sessionstorage
* video
* websockets
* websqldatabase
* webworkers

### CSS

* backgroundsize
* borderimage
* borderradius
* boxshadow
* cssanimations
* hsla
* multiplebgs
* opacity
* rgba
* textshadow

### Input

* autocomplete
* autofocus
* list
* placeholder
* max
* min
* multiple
* pattern
* required
* step

### Input types

* search
* tel
* url
* email
* datetime
* date
* month
* week
* time
* datetime-local
* number
* range
* color


To be added
-------

### Contenteditable

	'contentEditable' in (d.body || d.getElementsByTagName("body")[0])

### Pointer Events

	el.style.pointerEvents = "none"
	if (el.style.pointerEvents === "none") return true

### Fullscreen

	if (videoEl.webkitEnterFullScreen || videoEl.mozRequestFullScreen ) return true

### JSON

	if (JSON && JSON.stingify) return true

### Cookie

	if ('cookie' in document) return true



* media queries
* multi-column layout
* media queries
* attribute selectors
* box-sizing
* resize
* outline
* text-overflow
* word-wrap
* scriptdefer
* scriptasync
* csscolumns
* cssgradients
* csstransforms3d
* csstransforms
* csstransitions
* flexbox
* fontface
* inlinesvg
* canvas
* canvastext
* svg
* svgclippaths
* webgl


var isFontFaceSupported = (function(){  
var 
sheet, doc = document,
head = doc.head || doc.getElementsByTagName('head')[0] || docElement,
style = doc.createElement("style"),
impl = doc.implementation || { hasFeature: function() { return false; } };
 
style.type = 'text/css';
head.insertBefore(style, head.firstChild);
sheet = style.sheet || style.styleSheet;


	var supportAtRule = impl.hasFeature('CSS2', '') ?
    	function(rule) {
        	if (!(sheet && rule)) return false;
            	var result = false;
            	try {
                	sheet.insertRule(rule, 0);
                	result = !(/unknown/i).test(sheet.cssRules[0].cssText);
                	sheet.deleteRule(sheet.cssRules.length - 1);
                } catch(e) { }
                
                return result;
        } :
        function(rule) {
        	if (!(sheet && rule)) return false;
            sheet.cssText = rule;
            return sheet.cssText.length !== 0 && !(/unknown/i).test(sheet.cssText) &&
	          	sheet.cssText.replace(/\r+|\n+/g, '').indexOf(rule.split(' ')[0]) === 0;
	    };
	    
	    return supportAtRule('@font-face { font-family: "font"; src: "font.ttf"; }');
	})();

