(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function bootstrap(){loaded||(loaded=!0,canvas=document.getElementById("interstellar"),ctx=canvas.getContext("2d"),galaxy.setContext(ctx),interstellar.setContext(ctx),updateCanvas(),render(),window.addEventListener("resize",updateCanvas,!1))}function render(){window.requestAnimationFrame.call(window,render),ctx.clearRect(0,0,canvas.width,canvas.height),interstellar.draw(galaxy),galaxy.draw()}function updateCanvas(){config.updateScreenValues(),canvas.width=config.getScreenWidth(),canvas.height=config.getScreenHeight()}var config=require("./config"),Galaxy=require("./galaxy"),Interstellar=require("./interstellar"),loaded=!1,galaxy=new Galaxy,interstellar=new Interstellar,canvas=null,ctx=null;document.addEventListener("DOMContentLoaded",bootstrap,!1),window.addEventListener("load",bootstrap,!1);
},{"./config":2,"./galaxy":3,"./interstellar":4}],2:[function(require,module,exports){
"use strict";function updateScreenValues(){screenWidth=window.innerWidth,screenHeight=window.innerHeight}function getScreenWidth(){return screenWidth}function getScreenHeight(){return screenHeight}var screenWidth=window.innerWidth,screenHeight=window.innerHeight;module.exports={updateScreenValues:updateScreenValues,getScreenWidth:getScreenWidth,getScreenHeight:getScreenHeight};


},{}],3:[function(require,module,exports){
"use strict";function Galaxy(){this._ctx=null,this._counter=0,window.addEventListener("mousemove",this.repell.bind(this),!1)}var Star=require("./star"),config=require("./config"),randomizer=require("./utils/randomizer"),calc=require("./utils/calc");Galaxy.prototype=[],Galaxy.prototype.setContext=function(t){this._ctx=t},Galaxy.prototype.repell=function(t){for(var e=0,i=null,r={x:t.clientX,y:t.clientY},o=0;o<this.length;o++)i={x:this[o].getPosition().x,y:this[o].getPosition().y},e=Math.floor(calc.distance(r,i)),64>e&&this[o].changeDirection({x:.032*(i.x-r.x),y:.032*(i.y-r.y)})},Galaxy.prototype.create=function(){var t=randomizer(0,config.getScreenWidth()),e=randomizer(0,config.getScreenHeight()),i=randomizer(-16,16),r=randomizer(-16,16),o=new Star(this.length,t,e,i,r,this._ctx);this.push(o)},Galaxy.prototype.draw=function(){this._counter++>Math.floor(2560/config.getScreenWidth())&&(this.create(),this._counter=0);for(var t=0;t<this.length;t++)this[t].draw();this.dispose()},Galaxy.prototype.dispose=function(){for(var t=0,e=this.length;e>t;t++)this[t].shouldFadeOut()&&this[t].fadeOut(),this[t].isVisible()&&(this[t]=null,this.splice(t,1),t--,e--)},module.exports=Galaxy;


},{"./config":2,"./star":5,"./utils/calc":6,"./utils/randomizer":7}],4:[function(require,module,exports){
"use strict";function Interstellar(){this._ctx=null}var calc=require("./utils/calc"),sprintf=require("sprintf-js").sprintf,MAX_DISTANCE=120,NORM_DISTANCE=80,WIDTH=.25,COLOR="rgba(255,255,255,%s)";Interstellar.prototype.setContext=function(t){this._ctx=t},Interstellar.prototype.draw=function(t){for(var e=this.getConnections(t),n=null,i=null,r=null,s=null,o=0;o<e.length;o++){n=e[o],this._ctx.beginPath(),this._ctx.moveTo(n.start.x,n.start.y),this._ctx.lineTo(n.end.x,n.end.y),i=this._ctx.createLinearGradient(n.start.x,n.start.y,n.end.x,n.end.y);var l=1;n.distance>NORM_DISTANCE&&(l=(MAX_DISTANCE-n.distance)/(MAX_DISTANCE-NORM_DISTANCE)),r=sprintf(COLOR,(n.start.opacity*l).toFixed(2)),s=sprintf(COLOR,(n.end.opacity*l).toFixed(2)),i.addColorStop(0,r),i.addColorStop(1,s),this._ctx.strokeStyle=i,this._ctx.lineWidth=WIDTH,this._ctx.stroke()}},Interstellar.prototype.getConnections=function(t){var e=[],n=null,i=null,r=null,s=null,o=null;if(t.length<=1)return e;for(var l=0;l<t.length;l++)for(var a=l+1;a<t.length;a++)n=t[l],i=t[a],r={x:n.getPosition().x,y:n.getPosition().y,opacity:n.getOpacity()},s={x:i.getPosition().x,y:i.getPosition().y,opacity:i.getOpacity()},o=calc.distance(r,s),MAX_DISTANCE>=o&&e.push({start:r,end:s,distance:o});return e},module.exports=Interstellar;


},{"./utils/calc":6,"sprintf-js":8}],5:[function(require,module,exports){
"use strict";function Star(t,i,o,n,s,e){this._index=t,this._opacity=.01,this._fadeOut=!1,this._coolDown=Date.now()+COOL_DOWN,this._timer=Date.now()+LIFETIME,this._position={x:i,y:o},this._direction={x:n*VELOCITY_MODIFIER,y:s*VELOCITY_MODIFIER},this._ctx=e}var config=require("./config"),sprintf=require("sprintf-js").sprintf,VELOCITY_MODIFIER=.04,RADIUS=1.6,COLOR="rgba(255,255,255,%s)",LIFETIME=4e3,COOL_DOWN=1e3;Star.prototype.getPosition=function(){return this._position},Star.prototype.getOpacity=function(){return this._opacity},Star.prototype.draw=function(){this._ctx.fillStyle=sprintf(COLOR,this._opacity.toFixed(2)),this._ctx.beginPath(),this._ctx.arc(this._position.x,this._position.y,RADIUS,0,2*Math.PI),this._ctx.fill(),this.update()},Star.prototype.changeDirection=function(t){this._coolDown>Date.now()||(this._direction=t,this._coolDown=Date.now()+COOL_DOWN)},Star.prototype.update=function(){this._opacity<1&&this._fadeOut===!1&&(this._opacity+=.02),this._position.x+=this._direction.x,this._position.y+=this._direction.y},Star.prototype.fadeOut=function(){this._fadeOut=!0,this._opacity-=.05},Star.prototype.shouldFadeOut=function(){return this._timer<Date.now()},Star.prototype.isVisible=function(){return this._position.x<-RADIUS||this._position.x>config.getScreenWidth()+RADIUS||this._position.y<-RADIUS||this._position.y>config.getScreenHeight()+RADIUS||this._opacity<=0},module.exports=Star;


},{"./config":2,"sprintf-js":8}],6:[function(require,module,exports){
"use strict";function distance(t,a){return Math.sqrt(Math.pow(Math.abs(t.x-a.x),2)+Math.pow(Math.abs(t.y-a.y),2))}module.exports={distance:distance};


},{}],7:[function(require,module,exports){
"use strict";module.exports=function(t,o){return Math.floor(Math.random()*(o-t))+t};


},{}],8:[function(require,module,exports){
!function(e){function n(){var e=arguments[0],r=n.cache;return r[e]&&r.hasOwnProperty(e)||(r[e]=n.parse(e)),n.format.call(null,r[e],arguments)}function r(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}function t(e,n){return Array(n+1).join(e)}var i={not_string:/[^s]/,number:/[dief]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fiosuxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[\+\-]/};n.format=function(e,s){var a,o,l,f,c,p,u,d=1,g=e.length,h="",x=[],b=!0,y="";for(o=0;g>o;o++)if(h=r(e[o]),"string"===h)x[x.length]=e[o];else if("array"===h){if(f=e[o],f[2])for(a=s[d],l=0;l<f[2].length;l++){if(!a.hasOwnProperty(f[2][l]))throw new Error(n("[sprintf] property '%s' does not exist",f[2][l]));a=a[f[2][l]]}else a=f[1]?s[f[1]]:s[d++];if("function"==r(a)&&(a=a()),i.not_string.test(f[8])&&"number"!=r(a)&&isNaN(a))throw new TypeError(n("[sprintf] expecting number but found %s",r(a)));switch(i.number.test(f[8])&&(b=a>=0),f[8]){case"b":a=a.toString(2);break;case"c":a=String.fromCharCode(a);break;case"d":case"i":a=parseInt(a,10);break;case"e":a=f[7]?a.toExponential(f[7]):a.toExponential();break;case"f":a=f[7]?parseFloat(a).toFixed(f[7]):parseFloat(a);break;case"o":a=a.toString(8);break;case"s":a=(a=String(a))&&f[7]?a.substring(0,f[7]):a;break;case"u":a>>>=0;break;case"x":a=a.toString(16);break;case"X":a=a.toString(16).toUpperCase()}!i.number.test(f[8])||b&&!f[3]?y="":(y=b?"+":"-",a=a.toString().replace(i.sign,"")),p=f[4]?"0"===f[4]?"0":f[4].charAt(1):" ",u=f[6]-(y+a).length,c=f[6]&&u>0?t(p,u):"",x[x.length]=f[5]?y+a+c:"0"===p?y+c+a:c+y+a}return x.join("")},n.cache={},n.parse=function(e){for(var n=e,r=[],t=[],s=0;n;){if(null!==(r=i.text.exec(n)))t[t.length]=r[0];else if(null!==(r=i.modulo.exec(n)))t[t.length]="%";else{if(null===(r=i.placeholder.exec(n)))throw new SyntaxError("[sprintf] unexpected placeholder");if(r[2]){s|=1;var a=[],o=r[2],l=[];if(null===(l=i.key.exec(o)))throw new SyntaxError("[sprintf] failed to parse named argument key");for(a[a.length]=l[1];""!==(o=o.substring(l[0].length));)if(null!==(l=i.key_access.exec(o)))a[a.length]=l[1];else{if(null===(l=i.index_access.exec(o)))throw new SyntaxError("[sprintf] failed to parse named argument key");a[a.length]=l[1]}r[2]=a}else s|=2;if(3===s)throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");t[t.length]=r}n=n.substring(r[0].length)}return t};var s=function(e,r,t){return t=(r||[]).slice(0),t.splice(0,0,e),n.apply(null,t)};"undefined"!=typeof exports?(exports.sprintf=n,exports.vsprintf=s):(e.sprintf=n,e.vsprintf=s,"function"==typeof define&&define.amd&&define(function(){return{sprintf:n,vsprintf:s}}))}("undefined"==typeof window?this:window);


},{}]},{},[1]);
