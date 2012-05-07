/**
 * @preserve TeeChart(tm) for JavaScript(tm)
 * @fileOverview TeeChart for JavaScript(tm)
 * v1.0 BETA - February 2012
 * Copyright(c) 2012 by Steema Software SL. All Rights Reserved.
 * http://www.steema.com
 *
 * Licensed with commercial and non-commercial attributes,
 * specifically: http://www.steema.com/licensing/html5
 *
 * JavaScript is a trademark of Oracle Corporation.
 */

/**
 * @author <a href="mailto:david@steema.com">Steema Software</a>
 * @version 1.0 Beta
 */

/**
 * @namespace TeeChart namespace, contains all classes and methods.
 */
var Tee=Tee || {};

(function(exports) {
 "use strict";

 exports.Tee=Tee;
 
/**
 * @memberOf Tee
 * @public
 * @constructor
 * @class Represents an X,Y point.
 * @param {Number} x Horizontal point position.
 * @param {Number} y Vertical point position.
 * @property {Number} x The horizontal coordinate.
 * @property {Number} y The vertical coordinate.
 */
function Point(x,y) {
  this.x=x;
  this.y=y;
}

/**
 * @memberOf Tee
 * @public
 * @constructor
 * @class Represents a rectangle with origin xy position, width and height
 * @param {Number} x The position of left side of rectangle.
 * @param {Number} y The position of top side of rectangle.
 * @param {Number} width Amount of rectangle width.
 * @param {Number} height Amount of rectangle height.
 * @property {Number} x The position of left side of rectangle.
 * @property {Number} y The position of top side of rectangle.
 * @property {Number} width Amount of rectangle width.
 * @property {Number} height Amount of rectangle height.
 */
function Rectangle(x,y,width,height)
{
  this.set(x,y,width,height);
}

/**
 * Sets Rectangle properties.
 * @memberOf Tee.Rectangle
 * @param {Number} x The position of left side of rectangle.
 * @param {Number} y The position of top side of rectangle.
 * @param {Number} width Amount of rectangle width.
 * @param {Number} height Amount of rectangle height.
 */
Rectangle.prototype.set=function(x,y,width,height) {
  this.x=x;
  this.y=y;
  this.width=width;
  this.height=height;
}

/**
 * Sets Rectangle properties from rectangle r parameter.
 * @public
 * @memberOf Tee.Rectangle
 * @param {Tee.Rectangle} r The Rectangle instance to copy values from.
 */
Rectangle.prototype.setFrom=function(r) {
  this.x=r.x;
  this.y=r.y;
  this.width=r.width;
  this.height=r.height;
}

/**
 * @returns {Number} Returns the position in pixels of the right side of the rectangle.
 */
Rectangle.prototype.getRight=function() { return this.x+this.width; }

/**
 * @returns {Number} Returns the position in pixels of the bottom side of the rectangle.
 */
Rectangle.prototype.getBottom=function() { return this.y+this.height; }

/**
 * @param {Number} value Defines the position of top side of rectangle.
 */
Rectangle.prototype.setTop=function(value) {
  this.height -= (value-this.y);
  this.y=value;
}

/**
 * @param {Number} value Defines the position of bottom side of rectangle.
 */
Rectangle.prototype.setBottom=function(value) {
  this.height = value - this.y;
}

/**
 * @param {Number} value Defines the position of left side of rectangle.
 */
Rectangle.prototype.setLeft=function(value) {
  this.width -= (value-this.x);
  this.x=value;
}

/**
 * @param {Number} value Defines the position of right side of rectangle.
 */
Rectangle.prototype.setRight=function(value) {
  this.width = value - this.x;
}

/**
 * @returns {Boolean} Returns if {@link Tee.Point} p is inside the rectangle.
 * @param {Tee.Point} p XY position to test.
 */
Rectangle.prototype.contains=function(p) {
  return (p.x>=this.x) && (p.x<=(this.x+this.width)) && (p.y>=this.y) && (p.y<=(this.y+this.height));
}

/**
 * @memberOf Tee
 * @constructor
 * @class Values for each side (left, top, right and bottom) as percentage margins.
 * @property {Number} [left=2] Amount of left margin as percent of chart width.
 * @property {Number} [top=2] Amount of top margin as percent of chart height.
 * @property {Number} [right=2] Amount of right margin as percent of chart width.
 * @property {Number} [bottom=2] Amount of bottom margin as percent of chart height.
 */
function Margins() {
  this.left=this.right=this.top=this.bottom=2;

  /*
   * @private
   */
  this.apply=function(r) {
    var w=r.width, h=r.height;

    r.x+=(w*this.left*0.01);
    r.width -=(w*(Math.min(100,this.left+this.right))*0.01);

    r.y+=(h*this.top*0.01);
    r.height -=(h*(Math.min(100,this.top+this.bottom))*0.01);
  }
}

/**
 * @constructor
 * @class Abstract base class to represent a "tool"
 * @param {Tee.Chart} chart The parent chart this tool belongs to.
 * @property {Boolean} [active=true] Determines if this tool will be painted or enabled.
 */
Tee.Tool=function(chart) {
  this.chart=chart;
  this.active=true;
}

/**
 * @constructor
 * @class Draws a glow animation behind the bounds rectangle property
 * @param {Number} duration Animation duration in milliseconds.
 * @param {Tee.Rectangle} bounds The rectangle to apply the animation.
 * @param {Tee.Format} format The formatting properties to paint the bounds rectangle.
 */
function AnimateHover(duration,bounds,format) {
  this.format=format;
  this.bounds=bounds;
  this.duration=duration;

  var o=this, s=format.shadow;
  this.init=new Date().getTime();

  this.old=new Shadow();
  this.old.set(s);

  s.visible=true;
  s.color="rgba(0,255,0,0.1)";
  s.blur=10;
  s.width=0;
  s.height=0;

  requestAnimFrame(step, this);

  function step(now) {

    if (!now) now=new Date().getTime();

    var f=(now-o.init)/o.duration;
    if (f<1)
      o.format.shadow.color="rgba(0,255,0,"+f.toString()+")";
    else
    if (o.autoHide)
      o.restore();

    o.format.chart.draw();

    if (f<1)
      requestAnimFrame(step, o);
  }

  this.restore=function() {
    this.format.shadow.set(this.old);
  }
}

Tee.Tool.prototype.mousedown=function(event) {}
Tee.Tool.prototype.mousemove=function(event) {}
Tee.Tool.prototype.clicked=function(p) { return false; }
Tee.Tool.prototype.draw=function() {}

/**
 * @constructor
 * @memberOf Tee
 * @class Colors and direction to fill areas with gradients
 * @param {Tee.Chart} chart The parent chart this gradient object belongs to.
 * @property {Boolean} visible Determines if contents will be filled using this gradient.
 * @property {Color[]} colors Array of colors to define the gradient.
 * @property {String} direction Defines the gradient orientation
 * ("topbottom", "bottomtop", "leftright", "rightleft", "radial", "diagonalup", "diagonaldown").
 * @property {Number[]} stops Array of percentages from 0 to 1, for each color in colors array.
 */
function Gradient(chart) {
  this.chart=chart;
  this.visible=false;

  this.colors=["white","silver"];
  this.direction="topbottom";
  this.stops=null;

 /**
  * @returns {CanvasGradient} Returns a canvas gradient
  */
  this.create=function(r,color) {
    return this.rect(r.x,r.y,r.width,r.height,color);
  }

 /**
  * @returns {CanvasGradient} Returns a canvas gradient
  */
  this.rect=function(x,y,width,height,color) {
    var g, c=this.chart.ctx, l=c.createLinearGradient;

    if (this.direction=="topbottom")
      g = l.call(c,x,y,x,y+height);
    else
    if (this.direction=="bottomtop")
      g = l.call(c,x,y+height,x,y);
    else
    if (this.direction=="leftright")
      g = l.call(c,x,y,x+width,y);
    else
    if (this.direction=="rightleft")
      g = l.call(c,x+width,y,x,y);
    else
    if (this.direction=="radial") {
      var px=x+width*0.5, py=y+height*0.5, rad=Math.max(width,height);
      g = c.createRadialGradient(px, py, 0, px,py,rad);
    }
    else
    if (this.direction=="diagonalup")
      g = l.call(c,x,y+height,x+width,y);
    else
      g = l.call(c,x,y,x+width,y+height);

    if (color)
       this.setEndColor(color);

    var t, co=this.colors, len=co.length, s=this.stops, sl=s ? s.length : 0;

    if (len>1)
      for(t=0; t<len; t++)
         g.addColorStop(sl<=t ? t/(len-1) : s[t], co[t]);
    else
      g.addColorStop(0, (len>0) ? co[0] : "white");

    return g;
  }
}

/**
 * @memberOf Tee.Gradient
 * Sets color to all gradient colors except first color.
 * @param {Color} color The color to set.
 */
Gradient.prototype.setEndColor=function(color) {
  for (var t=1, l=this.colors.length; t<l; t++)
     this.colors[t]=color;
}

/**
 * @constructor
 * @memberOf Tee
 * @class Color and parameters to draw shadows behind areas
 * @param {Tee.Chart} chart The parent chart this shadow object belongs to.
 * @property {Boolean} [visible=false] Determines if contents will be filled with a backdrop shadow or not.
 * @property {Number} [blur=4] Amount of softness effect.
 * @property {Color} [color="DimGray"] The color used to draw the shadow.
 * @property {Number} [width=4] Amount in pixels to translate the shadow in horizontal direction.
 * @property {Number} [height=4] Amount in pixels to translate the shadow in vertical direction.
 */
function Shadow(chart) {
  this.chart=chart;
  this.visible=false;
  this.blur = 4;
  this.color = "rgba(80,80,80,0.75)";
  this.width=4;
  this.height=4;

  this.prepare=function(c) {
   if (this.visible) {
     c.shadowBlur = this.blur;
     c.shadowColor = this.color;
     c.shadowOffsetX = this.width;
     c.shadowOffsetY = this.chart.isAndroid ? -this.height : this.height;
   }
   else
     c.shadowColor = "transparent";
  }
}

Shadow.prototype.set=function(s) {
  this.visible=s.visible;
  this.color=s.color;
  this.blur=s.blur;
  this.width=s.width;
  this.height=s.height;
}

/**
 * @constructor
 * @memberOf Tee
 * @class Image and url to draw images
 * @param {Tee.Chart} chart The parent chart this image object belongs to.
 * @property {Boolean} visible When true, the image is displayed.
 * @property {URL} [url=""] The source url to retrieve the image.
 * @property {HTMLImage} image The <a href="http://www.w3.org/2003/01/dom2-javadoc/org/w3c/dom/html2/HTMLImageElement.html">html DOM Image component</a> to store or retrieve the image.
 */
function ChartImage(chart) {
  this.url="";
  this.chart=chart;
  this.visible=true;

  this.tryDraw=function(x,y,width,height) {
    if (!this.image) {
      this.image=new Image();

      this.image.onload = function(){
        chart.draw();
      }
    }

    if (this.image.src=="") {
      chart=this.chart;
      this.image.src = this.url;
    }
    else
      chart.ctx.drawImage(this.image, x,y,width,height);
  }
}

/**
 * @constructor
 * @memberOf Tee
 * @class Color and properties to draw lines
 * @param {Tee.Chart} chart The parent chart this stroke object belongs to.
 * @property {Color} fill Defines the color used to fill the stroke lines.
 * @property {Number} size Defines the size in pixels of the stroke lines.
 * @property {String} join Controls how to paint unions between lines ("round", "Defines the size in pixels of the stroke lines.
 */
function Stroke(chart) {
  this.chart=chart;
  this.fill="black";
  this.size=1;
  this.join="round";
  this.cap="square";
  this.dash=null;

  this._g=null;

  Object.defineProperty(this,"gradient", {
    get: function() { if (!this._g)
                         this._g=new Gradient(this.chart);
                      return this._g;
                    }
  });

  //var g=this.gradient=new Gradient(chart);

  this.prepare=function(fill) {
    var c=this.chart.ctx, g=this._g;

    c.strokeStyle=(g && g.visible) ? g.create(this.chart.bounds) : fill ? fill : this.fill;

    c.lineWidth = this.size;
    c.lineJoin = this.join;
    c.lineCap = this.cap;

    c.shadowColor = "transparent";

    if (c.mozCurrentTransform)
       c.mozDash= this.dash;
    else
    if (this.chart.isChrome)
       c.webkitLineDash=this.dash;
  }

  /*
   * @private
   */
  this.setChart=function(chart) {
    this.chart=chart;
    if(this._g) this._g.chart=chart;
  }
}

/**
 * @memberOf Tee
 * @constructor
 * @class Style and fill properties to display text
 * @param {Tee.Chart} chart The parent chart this font object belongs to.
 */
function Font(chart) {
  this.chart=chart;

  this.style="11px Tahoma";

  this._g=null;

  Object.defineProperty(this, "gradient", {
    get: function() {
    if (!this._g)
      this._g=new Gradient(this.chart);
    return this._g;
  }
  });

  //this.gradient=new Gradient(chart);

  this.fill="black";

  this._sh=null;

  Object.defineProperty(this,"shadow", {
    get : function() {
    if (!this._sh)
      this._sh=new Shadow(this.chart);
    return this._sh;
    }
  });

  //this.shadow=new Shadow(chart);

  this._s=null;

  Object.defineProperty(this, "stroke", {
    get: function() {
    if (!this._s) {
      this._s=new Stroke(this.chart);
      this._s.fill="";
    }
    return this._s;
  }
  });

  //this.stroke=new Stroke(chart);
  //this.stroke.fill="";

  this.textAlign="center";
  this.baseLine="alphabetic";

 /**
  * @returns {Number} Returns the size of font, or 20 if it can't be guessed.
  */
  this.getSize=function() {
    var s=this.style.split(" "), t, res;
    for (t=0; t<s.length; t++) {
      res=parseFloat(s[t]);
      if (res) return res;
    }

    return 20;
  }

  this.setSize=function(value) {
    var tmp="", s=this.style.split(" "), t;
    for (t=0; t<s.length; t++)
       (parseFloat(s[t])) ? tmp+=value.toString()+"px " : tmp+=s[t]+" ";

    this.style=tmp;
  }

  this.prepare=function() {
    var c=this.chart.ctx;
    c.textAlign=this.textAlign;
    c.textBaseline=this.baseLine;

    if (this._sh) this._sh.prepare(c);

    if (c.font!=this.style) // speed opt.
       c.font=this.style;
  }

  /*
   * @private
   */
  this.setChart=function(chart) {
    this.chart=chart;
    if (this._g) this._g.chart=chart;
    if (this._sh) this._sh.chart=chart;
    if (this._s) this._s.setChart(chart);
  }
}

/**
 * Draws a dashed line.
 * @param {Number} x Starting line horizontal position in pixels.
 * @param {Number} y Starting line vertical position in pixels.
 * @param {Number} x2 Ending line horizontal position in pixels.
 * @param {Number} y2 Ending line vertical position in pixels.
 * @param {Number[]} [da] Optional array of dash offsets.
 */
function dashedLine(ctx, x, y, x2, y2, da) {
  if (!da) da = [10,5];

  ctx.save();

  var dx = (x2-x), dy = (y2-y), len = Math.sqrt(dx*dx + dy*dy), rot = Math.atan2(dy, dx);
  ctx.translate(x, y);
  ctx.moveTo(0, 0);
  ctx.rotate(rot);
  var dc = da.length, di = 0, draw = true;
  x = 0;
  while (len > x) {
      x += da[di++ % dc];
      if (x > len) x = len;
      draw ? ctx.lineTo(x, 0): ctx.moveTo(x, 0);
      draw = !draw;
  }
  ctx.restore();
}

/**
 * @constructor
 * @public
 * @class Contains visual parameters like fill, shadow, image, font.
 * @param {Tee.Chart} chart The parent chart this format object belongs to.
 * @property {Tee.Gradient} gradient Gradient properties to fill contents.
 * @property {Color} fill Color used to paint contents interior.
 * @property {Tee.Stroke} stroke Properties to draw lines around boundaries.
 * @property {Tee.Shadow} shadow Properties to draw a backdrop shadow.
 * @property {Tee.Font} font Properties to fill text.
 * @property {Tee.ChartImage} image Image to fill background.
 * @property {Tee.Point} round Width and height of rectangle rounded corners.
 * @property {Number} transparency Controls the transparency, from 0 (opaque) to 1 (transparent).
 */
Tee.Format=function(chart)
{
  this.chart=chart;

  this.gradient=new Gradient(chart);
  this.fill="rgb(200,200,200)";

  this.stroke=new Stroke(chart);

  this.round={ x:0, y:0 }
  this.transparency=0;

  this.font=new Font(chart);

  this._img=null;

  Object.defineProperty(this, "image", {
    get: function() {
    if (!this._img)
      this._img=new ChartImage(this.chart);
    return this._img;
    }
  });

  //this.image=new ChartImage(chart);

  this.shadow=new Shadow(chart);

  /**
   * Draws a rectangle with rounded corners
   * @param {Number} x Position in pixels of left side of rectangle.
   * @param {Number} y Position in pixels of top side of rectangle.
   * @param {Number} width Amount in pixels of rectangle width.
   * @param {Number} height Amount in pixels of rectangle height.
   * @param {Number} xr Amount in pixels of corners radius width.
   * @param {Number} yr Amount in pixels of corners radius height.
   * @param {Boolean[]} [corners] Optional, defines to paint top-left, top-right, bottom-left and bottom-right corners.
   * @returns {CanvasRenderingContext2D} Returns the canvas 2D context
   */
  this.roundRect=function(ctx, x, y, width, height) {

    var r=x+width, b=y+height, xr=this.round.x, yr=this.round.y, c=this.round.corners;

    if (height<0) {
      y=b;
      b=y-height;
    }

    if (width<0) {
      x=r;
      r=x-width;
    }

    if (2*xr > width) xr=width*0.5;
    if (2*yr > height) yr=height*0.5;

    ((!c) || c[0]) ? ctx.moveTo(x + xr, y) : ctx.moveTo(x, y);

    if ((!c) || c[1]) {
      ctx.lineTo(r - xr, y);
      ctx.quadraticCurveTo(r, y, r, y + yr);
    }
    else
      ctx.lineTo(r, y);

    if ((!c) || c[2]) {
      ctx.lineTo(r, b - yr);
      ctx.quadraticCurveTo(r, b, r - xr, b);
    }
    else
      ctx.lineTo(r, b);

    if ((!c) || c[3]) {
      ctx.lineTo(x + xr, b);
      ctx.quadraticCurveTo(x, b, x, b - yr);
    }
    else
      ctx.lineTo(x,b);

    if ((!c) || c[0]) {
      ctx.lineTo(x, y + yr);
      ctx.quadraticCurveTo(x, y, x + xr, y);
    }
    else
      ctx.lineTo(x,y);

    ctx.closePath();
  }

 /**
  * @returns {Number} Returns the height in pixels of a given text using current font size and attributes.
  */
  this.textHeight=function(text) {

      return this.font.getSize()*1.3;

      //var s=document.createElement("span");
      //s.font=this.font.style;
      //s.textContent=text;
      //return s.offsetHeight;

      //return 20;
  }

 /**
  * @returns {Number} Returns the width in pixels of a given text using current font size and attributes.
  */
  this.textWidth=function(text) {
    return this.chart.ctx.measureText(text).width;
  }

  this.draw=function(c,getbounds,x,y,width,height) {
     var i=this._img;

     if (this.transparency>0)
        c.globalAlpha=1-this.transparency;

     this.shadow.prepare(c);

     if (i && i.visible && (i.url!="")) {
       c.save();
       c.clip();

       if (getbounds) {
         var r=getbounds();
         i.tryDraw(r.x,r.y,r.width,r.height);
       }
       else
         i.tryDraw(x,y,width,height);

       c.restore();
     }
     else
     {
       if (this.gradient.visible)
         c.fillStyle = (getbounds) ? this.gradient.create(getbounds()) : this.gradient.rect(x,y,width,height);
       else
         c.fillStyle = this.fill;

       c.fill();
     }

     if (this.stroke.fill!="") {
       this.stroke.prepare();
       c.stroke();
     }

     if (this.transparency>0)
       c.globalAlpha=1;
  }

  this.drawText=function(bounds,text) {

    var g=this.font._g, c=this.chart.ctx, s=this.font._s;

    function xy(x,y,text) {
      c.fillText(text, x,y);

      if (s && (s.fill!="")) {
        s.prepare();
        c.strokeText(text, x,y);
      }
    }

    c.fillStyle = (g && g.visible && bounds) ? g.create(bounds) : this.font.fill;

    if (this.font.textAlign=="center")
       bounds.x+=(0.5*bounds.width);
    else
    if (this.font.textAlign=="end")
       bounds.x+=bounds.width;

    var rows=text.split("\n"), l=rows.length;

    if (l>1) {
        var h=this.textHeight(rows[0]), y=bounds.y;

        for (var t=0; t<l; t++) {
          xy(bounds.x,y, rows[t]);
          y+=h;
        }
    }
    else
      xy(bounds.x,bounds.y, text);
  }

  this.rectPath=function(x,y,width,height) {
     var c=this.chart.ctx;

     c.beginPath();

     if ((this.round.x>0) || (this.round.y>0))
       this.roundRect(c,x,y,width,height);
     else
       c.rect(x,y,width,height);
  }

  this.rectangle=function(x,y,width,height) {
     if (this.transparency < 1)
     {
       if (typeof(x)==='object')
         this.rectangle(x.x,x.y,x.width,x.height);
       else
       {
         this.rectPath(x,y,width,height);
         this.draw(this.chart.ctx,null,x,y,width,height);
       }
     }
  }

  function polygonBounds(points,r) {
    var x0=0,y0=0,x1=0,y1=0, l=points.length, p,t;

    if (l>0) {
      x0=x1=points[0].x;
      y0=y1=points[0].y;

      for (t=1; t<l; t++) {
        p=points[t].x;
        if (p<x0) x0=p; else if (p>x1) x1=p;
        p=points[t].y;
        if (p<y0) y0=p; else if (p>y1) y1=p;
      }
    }

    r.x=x0; r.y=y0; r.width=x1-x0; r.height=y1-y0;
  }

  var tmp=new Rectangle();

  this.polygon=function(points) {
     var c=this.chart.ctx, l=points.length, t;

     c.beginPath();
     c.moveTo(points[0].x,points[0].y);

     for (t=1; t<l; t++)
       c.lineTo(points[t].x,points[t].y);

     c.closePath();

     this.draw(c,function() { polygonBounds(points,tmp); return tmp; });
  }

  this.ellipsePath=function(ctx, centerX, centerY, width, height) {
      var w=width*0.5, top=centerY-height, bot=centerY+height;

      ctx.beginPath();
      ctx.moveTo(centerX, top);
      ctx.bezierCurveTo(centerX + w, top, centerX + w, bot, centerX, bot);
      ctx.bezierCurveTo(centerX - w, bot, centerX - w, top, centerX, top);
      ctx.closePath();
  }

  this.ellipse=function(cx,cy,width,height) {
     var c=this.chart.ctx;

     /*
     c.save();
     c.translate(cx,cy);
     c.scale(1,height/width);
     c.beginPath();
     c.arc(0,0,0.5*height*(width/height),0, 2*Math.PI);
     c.closePath();
     c.restore();
     */

     this.ellipsePath(c, cx,cy, 2+width,(2+height)*0.38);
     this.draw(c,null,cx-width*0.5,cy-height*0.5,width,height);
  }
}

/**
 * @private
 */
Tee.Format.prototype.setChart=function(chart) {
  this.chart=chart;
  this.shadow.chart=chart;
  this.gradient.chart=chart;
  this.font.setChart(chart);
  if (this._img) this._img.chart=chart;
  this.stroke.setChart(chart);
}

/**
 * @constructor
 * @augments Tee.Tool
 * @class Represents a rectangle containing text
 * @param {Tee.Chart} chart The parent chart this annotation belongs to.
 * @param {String} text The text to draw inside the annotation.
 * @param {Number} [x=10] Optional left side position in pixels.
 * @param {Number} [y=10] Optional top side position in pixels.
 * @property {Tee.Margins} margins Properties to control spacing between text and rectangle boundaries.
 * @property {Boolean} visible When true, the annotation is displayed.
 * @property {Boolean} transparent When true, the annotation background is not displayed. Only the text is painted.
 * @property {Tee.Format} format Properties to control the annotation background and text appearance.
 */
Tee.Annotation=function(chart,text,x,y) {
  Tee.Tool.call(this,chart);

  /**
   * @property {Tee.Point} position Top-left coordinates of annotation rectangle.
  `* @default x:10, y:10
   */
  this.position=new Point(x || 10, y || 10);

  var m=this.margins=new Margins();

  this.items=[];

  var b=this.bounds=new Rectangle();
  this.visible=true;
  this.transparent=false;
  this.text=text || "";

  var f=this.format=new Tee.Format(chart);

  f.font.textAlign="center";
  f.font.baseLine="top";
  f.fill="beige";
  f.round.x=4;
  f.round.y=4;
  f.stroke.fill="silver";
  f.shadow.visible=true;

  var fontH, thisH, hover;

  this.moveTo=function(x,y) {
    this.position.x=x;
    this.position.y=y;

    this.resize();
  }

  this.resize=function() {
    f.font.prepare();

    this.rows=this.text.split("\n");
    fontH=f.textHeight(this.text);

    var l=this.rows.length;

    thisH=fontH*l + m.top;

    var w, h=thisH+m.bottom;

    if (l>1) {
      w=0;
      while(l--) w=Math.max(w,f.textWidth(this.rows[l]+"W"));
    }
    else
      w=f.textWidth(this.text+"W");

    w+=(m.left+m.right);

    var pos=this.position, p=pos.y+thisH, t, i;

    for(t=0; i=this.items[t++];)
    {
      var bi=i.bounds;
      i.resize();
      h+=bi.height;
      w=Math.max(w,bi.width);
      bi.x=pos.x;
      bi.y=p;
      p+=bi.height;
    }

    for(t=0; i=this.items[t++];)
      i.bounds.width=w-m.right;

    b.set(pos.x,pos.y,w,h);
  }

  this.add=function(text) {
    var a=new Tee.Annotation(this.chart,text);
    this.items.push(a); //[this.items.length]=a;
    a.transparent=true;
    return a;
  }

  this.doDraw=function() {
    if (this.text != "") {
      if (!this.transparent)
         f.rectangle(b);

      f.font.prepare();

      b.y+=m.top+(0.1*fontH);
      b.x+=m.left;

      var w=b.width;
      b.width-=m.right;

      f.drawText(b, this.text);
      b.x=this.position.x;
      b.y=this.position.y;
      b.width=w;
    }

    for(var t=0, l=this.items.length; t<l; t++)
      this.items[t].doDraw();
  }

 /**
  * @returns {Boolean} Returns if {@link Tee.Point} p is inside this Annotation bounds.
  */
  this.clicked=function(p) {
    return b.contains(p);
  }

  this.mousemove=function(p) {
    this.mouseinside=(this.cursor && (this.cursor!="default") && b.contains(p));

    if (this.mouseinside) {
      this.chart.newCursor=this.cursor;

      if (!this.wasinside) {
        hover=new AnimateHover(250, b, f);
        hover.autoHide=false;
      }
    }
    else
    if (this.wasinside) {
       hover.restore();
       this.chart.draw();
    }

    this.wasinside=this.mouseinside;
  }

  this.forceDraw=function() {
    this.resize();
    this.doDraw();
  }

  this.draw=function() {
    if (this.visible) this.forceDraw();
  }
}

Tee.Annotation.prototype=new Tee.Tool;

/**
 * @constructor
 * @augments Tee.Tool
 * @class Allows dragging series data by mouse or touch
 * @param {Tee.Chart} chart The parent chart this tool belongs to.
 */
Tee.DragTool=function(chart) {
  Tee.Tool.call(this,chart);

  this.target={ series:null, index:-1 };

  this.clicked=function(p) {
    this.target.series=null;
    this.target.index=-1;
  }

  this.mousedown=function(event) {
    this.target.series=null;
    this.target.index=-1;

    var s=this.chart.series.items, t,
        p=this.chart.calcMouse(event),
        len=s.length;

    for(t=0; t<len; t++) {
      if (s[t].visible) {
        this.target.index=s[t].clicked(p);
        if (this.target.index!=-1) {
          this.target.series=s[t];
          break;
        }
      }
    }
    return this.target.index!=-1;
  }

  this.mousemove=function(p) {
    if (this.target.index!=-1) {
      var s=this.target.series, tmp=s.mandatoryAxis.fromPos( s.yMandatory ? p.y : p.x );
      if (this.onchanging) tmp=this.onchanging(this,tmp);

      s.data.values[this.target.index]=tmp;

      if (this.onchanged) this.onchanged(this,tmp);
      this.chart.draw();
    }
  }
}

Tee.DragTool.prototype=new Tee.Tool;

/**
 * @constructor
 * @augments Tee.Tool
 * @class Draws mouse draggable horizontal and / or vertical lines inside axes
 * @param {Tee.Chart} chart The parent chart this cursor tool belongs to.
 * @property {String} direction Determines if the cursor will be displayed as "vertical", "horizontal" or "both".
 * @property {Tee.Format} format Properties to control the cursor lines stroke appearance.
 * @property {Tee.Point} size The size of cursor, {x:0, y:0} means lines will cover full axes bounds.
 */
Tee.CursorTool=function(chart) {
  Tee.Tool.call(this,chart);

  this.direction="both"; // "vertical", "horizontal", "both"
  this.size=new Point(0,0);

  this.format=new Tee.Format(chart);

  var old, axis1=chart.axes.bottom, axis2=chart.axes.left;

  this.mousemove=function(p) {

    if (!old) old=new Point();

    if ( (old.x != p.x) || (old.y != p.y) ) {

      if ((p.x>axis1.startPos) && (p.x<axis1.endPos)) {
      if ((p.y>axis2.startPos) && (p.y<axis2.endPos)) {

        old.x=p.x;
        old.y=p.y;

        this.chart.draw();

        if (this.onchange)
          this.onchange(p);
      }
      }
    }

  }

  this.draw=function() {
    var both=this.direction=="both", c=this.chart.ctx, p;

    if (!old) old=new Point(0.5*(axis1.startPos+axis1.endPos), 0.5*(axis2.startPos+axis2.endPos));

    c.beginPath();

    if (both || this.direction=="vertical") {
      p=this.size.y*0.5;
      c.moveTo(old.x, p==0 ? axis2.startPos : old.y-p);
      c.lineTo(old.x, p==0 ? axis2.endPos : old.y+p);
    }

    if (both || this.direction=="horizontal") {
      p=this.size.x*0.5;
      c.moveTo(p==0 ? axis1.startPos : old.x-p,old.y);
      c.lineTo(p==0 ? axis1.endPos : old.x+p,old.y);
    }

    this.format.stroke.prepare();
    c.stroke();
  }
}

Tee.CursorTool.prototype=new Tee.Tool;

if (typeof window !== 'undefined') {
  window.requestAnimFrame = (function(callback){
      return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback){
          window.setTimeout(callback, 1000 / 60, new Date().getTime());
      };
  })();
}

/**
 * @constructor
 * @augments Tee.Tool
 * @class Shows an annotation when mouse is over a series data point
 * @param {Tee.Chart} chart The parent chart this tooltip belongs to.
 * @property {Boolean} [autoHide=false] When true, the tooltip is automatically removed after "delay" milliseconds.
 * @property {Number} [delay=1000] Amount of milliseconds to wait before removing the last displayed tooltip (when "autoHide" is true).
 * @property {Number} [animated=100] Duration in milliseconds to animate the movement of tooltip from old to new position.
 */
Tee.ToolTip=function(chart) {
  Tee.Annotation.call(this,chart);

  this.visible=false;

  /**
   * @private
   */
  this.currentSeries=null;
  /**
   * @private
   */
  this.currentIndex=-1;

  this.autoHide=false;
  this.delay=1000;
  this.animated=100;

  this.hide=function() {
    if (this.onhide)
      this.onhide(this);

    this.visible=false;

    this.chart.draw();
  }

  var redraw=function(args) { if (args) args[0].hide(); }

  this.mousemove=function(p) {

    var li=this.chart.series, len=li.count();
    for (var t=0; t<len; t++) {
      var s=li.items[t];

      if (s.visible) {
        var index=s.clicked(p);

        if (index != this.currentIndex) {

          this.currentIndex=index;

          if (index!=-1) {
            if (this.onshow)
              this.onshow(this,s,index);

            this.refresh(s,index);

            if (this.autoHide && (this.delay > 0))
               setTimeout(redraw, this.delay, [this]);

          }
          else
          if (this.autoHide)
            this.hide();

          break;

        }
      }
    }
  }

  var o=null;

  function step(now) {

    function changeTo(f) {
      o.moveTo(o.oldX+f*o.deltaX,o.oldY+f*o.deltaY);
      o.chart.draw();
    }

    if (!now)
        now=new Date().getTime();

    var f=(now-o.init)/o.animated;

    if (f<1) {
      changeTo(f);
      requestAnimFrame(step,o);
    }
    else
      changeTo(1);
  }

  this.refresh=function(series,index) {
    this.visible=true;

    this.text=series.markText(index);

    if (this.ongettext)
      this.text=this.ongettext(this,this.text,series,index);

    this.resize();

    var p=new Point();
    series.calc(index,p);

    p.x-=this.bounds.width*0.5;
    p.y-=1.5*this.bounds.height;

    if ((!this.autoHide) && (this.animated>0) && (!isNaN(this.position.x)) && (!isNaN(this.position.y))) {
      this.oldX=this.position.x;
      this.oldY=this.position.y;

      this.deltaX=(p.x-this.oldX);
      this.deltaY=(p.y-this.oldY);

      this.init=new Date().getTime();
      o=this;
      requestAnimFrame(step,this);
    }
    else
    {
      this.moveTo(p.x,p.y);
      this.chart.draw();
    }
  }
}

Tee.ToolTip.prototype=new Tee.Annotation;

/**
 * @constructor
 * @augments Tee.Tool
 * @class Animates series data
 * @property {Tee.Series} series Optional Tee.Series object to animate. When null, all axes in chart are animated.
 * @property {Number} duration Duration in milliseconds of animation.
 */
Tee.SeriesAnimation=function(target) {
  Tee.Tool.call(this,target);

  this.series=null;

  if (target instanceof Tee.Chart)
    this.chart=target;
  else
  if (target instanceof Tee.Series) {
    this.series=target;
    this.chart=target.chart;
  }

  this.oldmin=0;
  this.oldmax=0;
  var scaling=1;

  this.duration=500;
  this.init=0;

  function changeAxis(o,a,amount) {
    a.automatic=false;
    var mid=(o.oldmin+o.oldmax)*0.5, range=(o.oldmax-o.oldmin)*0.5;
    a.maximum=mid+amount*range;
    a.minimum=mid-amount*range;
  }

  var o=null;

  this.setTransp=function(value) {
    if (this.series)
      this.series.format.transparency=value;
    else
      this.chart.series.each(function(s) { s.format.transparency=value; });
  }

 /**
  * @returns {Tee.Axis} Returns the mandatory axis of the animated series, or null
  * if no visible series exist.
  */
  this.getAxis=function() {
    var s=this.series || this.chart.series.firstVisible();
    return s ? s.mandatoryAxis : null;
  }

  function step(now) {

    if (!now)
        now=new Date().getTime();

    var f=(now-o.init)/o.duration, a=o.getAxis(), s=o.chart.series.items[0];
    a.automatic=false;

    if (f<1) {
        o.setTransp(1-f);

        if (s instanceof Tee.Pie) {
          s.rotation=360*(1-f);
          scaling=f;
        }
        else
          changeAxis(o,a,1+(1-f)*10);

        o.chart.draw();

        requestAnimFrame(step,o);
    }
    else
    {
        o.setTransp(0);
        a.maximum=o.oldmax;
        a.minimum=o.oldmin;
        o.chart.draw();

        if (s instanceof Tee.Pie)
           s.transform=null;
    }
  }

  this.animate=function() {

    var a=this.getAxis(), ss=this.chart.series.items;

    if (ss.length==0)
      return;

    this.init=new Date().getTime();

    this.oldmin=a.minimum;
    this.oldmax=a.maximum;

    this.setTransp(100);

    if (ss[0] instanceof Tee.Pie) {
      ss[0].transform=function() {
          this.chart.ctx.scale(scaling, scaling);
      }
    }
    else
      changeAxis(this,a,10);

    this.chart.draw();

    o=this;
    requestAnimFrame(step, this);
  }
}

Tee.SeriesAnimation.prototype=new Tee.Tool;

/**
 * @memberOf Tee.Chart
 * @constructor
 * @class Contains a list with all "tools"
 * @param {Tee.Chart} chart The parent chart this tool list belongs to.
 * @property {Tee.Tool[]} items Array of Tee.Tool objects.
 */
function Tools(chart) {
  this.chart=chart;
  this.items=[];

  this.draw=function() {
    for(var t=0, s; s=this.items[t++];)
      if (s.active) s.draw();
  }

  this.mousemove=function(p) {
    for(var t=0, s; s=this.items[t++];)
      if (s.active) s.mousemove(p);
  }

  this.mousedown=function(event) {
    for(var t=0, s, done=false; s=this.items[t++];)
      if (s.active) done=s.mousedown(event);

    return done;
  }

  this.clicked=function(p) {
    for(var t=0, s, done=false; s=this.items[t++];) {
      if (s.active && s.clicked(p)) {
         done=true;

         if (s.onclick)
            done=s.onclick(s,p.x,p.y);
      }
    }

    return done;
  }

 /**
  * @returns {Tee.Tool} Returns the tool parameter.
  */
  this.add=function(tool) {
    this.items.push(tool);
    return tool;
  }
}

Tee.RainbowPalette=function() { return ["#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#6600FF","#8B00FF"]};

/**
 * @constructor
 * @class Contains an array of colors to be used as series data fill color
 * @param {Color[]} colors The array of colors to build the palette.
 */
Tee.Palette=function(colors) {
  this.colors=colors;

 /**
  * @returns {String} Returns the index'th color in colors array (mod length
  * if index is greater than number of colors).
  * @param {Integer} index The position inside colors array (circular, if index is greater than colors length).
  */
  this.get=function(index) {
    return this.colors[ (index==-1) ? 0 : index % this.colors.length];
  }
}

/**
 * @constructor
 * @memberOf Tee.Chart
 * @class Controls how to zoom chart axes by mouse or touch drag
 * @param {Tee.Chart} chart The parent chart this zoom object belongs to.
 * @property {Boolean} enabled Allows chart zoom by mouse/touch dragging.
 * @property {Number} mouseButton Defines the mouse button that can be used to zoom (0=Left button, etc).
 * @property {Tee.Format} format Properties to control the appearance of rectangle that appears while dragging.
 */
function Zoom(chart) {
  this.chart=chart;

  /**
   * @private
   */
  this.active=false;

  this.enabled=true;

  /**
   * @private
   */
  this.done=false;

  this.mouseButton=0;

  var f=this.format=new Tee.Format(chart);
  f.fill="rgba(255,255,255,0.5)";
  f.stroke.fill="darkgray";
  f.stroke.size=2;

  //c.ctx.globalCompositeOperation="source-over";

  var r=new Rectangle();

  function check(z) {
    if (z.old.x<0) {
      r.x=z.chart.oldPos.x+z.old.x;
      r.width=-z.old.x;
    }
    else
    {
      r.x=z.chart.oldPos.x;
      r.width=z.old.x;
    }

    if (z.old.y<0) {
      r.y=z.chart.oldPos.y+z.old.y;
      r.height=-z.old.y;
    }
    else
    {
      r.y=z.chart.oldPos.y;
      r.height=z.old.y;
    }

    return r;
  }

  this.draw=function() {
    f.rectangle(check(this));
  }

  this.apply=function() {

    if ((this.old.x<0) || (this.old.y<0)) {
      this.reset();
    }
    else
    {
      check(this);

      var a=this.chart.axes;

      a.left.calcMinMax(r.y+r.height,r.y);
      a.bottom.calcMinMax(r.x,r.x+r.width);
      a.right.calcMinMax(r.y+r.height,r.y);
      a.top.calcMinMax(r.x,r.x+r.width);
    }
  }

  this.reset=function() {
      var a=this.chart.axes;
      a.left.automatic=true;
      a.bottom.automatic=true;
      a.right.automatic=true;
      a.top.automatic=true;
  }
}

/**
 * @constructor
 * @memberOf Tee.Chart
 * @class Controls how to scroll chart axes by mouse or touch drag
 * @param {Tee.Chart} chart The parent chart this scroll object belongs to.
 * @property {Boolean} enabled Allows chart scroll by mouse/touch dragging.
 * @property {Number} mouseButton Defines the mouse button that can be used to scroll (2=Right button, etc).
 * @property {String} direction Determines if scroll is allowed in "horizontal", "vertical" or "both" directions.
 */
function Scroll(chart) {
  this.chart=chart;

  /**
   * @private
   */
  this.active=false;

  this.enabled=true;

  /**
   * @private
   */
  this.done=false;

  this.mouseButton=2;
  this.direction="both";  // horizontal,vertical,both

  /**
   * @private
   */
  this.position=new Point(0,0);
}

/**
 * @memberOf Tee.Chart
 * @constructor
 * @augments Tee.Annotation
 * @class Displays text at top or bottom chart sides
 * @param {Tee.Chart} chart The parent chart this title object belongs to.
 * @param {Color} fontColor The color to fill the title text.
 */
function Title(chart, fontColor) {
  Tee.Annotation.call(this,chart);
  this.transparent=true;

  var f=this.format.font;
  //f.gradient.colors=["black","navy","DarkGrey"];
  //f.gradient.direction="leftright";
  f.shadow.visible=true;
  f.shadow.width=2;
  f.shadow.height=2;
  f.shadow.blur=8;
  f.style="18px Tahoma";
  f.fill=fontColor;

  this.padding=4;

  this.calcRect=function(fromTop) {
    this.resize();

    var size=this.bounds.height+this.padding, r=chart.chartRect;

    if (fromTop)
    {
      this.position.y=r.y;
      r.setTop(this.position.y+size);
    }
    else
    {
      this.position.y=r.height;
      r.height-=(size+this.padding);
    }

    this.position.x=0.5*(chart.canvas.width-this.bounds.width);
  }

  this.tryDraw=function(top) {
   if (this.visible && (this.text!="")) {
     this.calcRect(top);
     this.draw();
   }
  }
}

Title.prototype=new Tee.Annotation;

/**
 * @memberOf Tee.Chart
 * @constructor
 * @public
 * @class Defines the visual properties for chart background
 * @param {Tee.Chart} chart The parent chart this panel object belongs to.
 * @property {Tee.Margins} margins Controls the spacing between background panel to chart contents.
 * @property {Tee.Format} format Visual properties to paint the chart panel background.
 * @property {Boolean} transparent Determines if panel background will be filled or not.
 */
function Panel(chart)
{
  var f=this.format=new Tee.Format(chart);
  f.round.x=12;
  f.round.y=12;
  f.stroke.size=3;
  f.gradient.visible=true;
  f.gradient.direction="bottomtop";
  f.shadow.visible=true;
  f.stroke.fill="#606060";

  this.transparent=false;

  this.margins=new Margins();

  this.clear=function() {
    var b=chart.bounds;
    chart.ctx.clearRect(b.x,b.y,b.width,b.height);
  }

  this.draw=function() {
    if (this.transparent)
       this.clear();
    else
    {
      var r=chart.chartRect, sh=f.shadow;

      if (sh.visible) {
        r.width-=(0.5*Math.abs(sh.width))+2;
        r.height-=(0.5*Math.abs(sh.height))+2;

        if (sh.width<0) r.x-=sh.width;
        if (sh.height<0) r.y-=sh.height;
      }

      var s=0;

      if (f.stroke.fill!="")
      {
        s=f.stroke.size;
        if (s>1) {
          s*=0.5;
          r.x+=s;
          r.y+=s;
          r.width-=2*s;
          r.height-=2*s;
        }
      }

      if (sh.visible || (f.round.x>0) || (f.round.y>0))
        this.clear();

      f.rectangle(r);

      if (s>0) {
        r.x+=s;
        r.y+=s;
        r.width-=2*s;
        r.height-=2*s;
      }
    }
  }
}

/**
 * @memberOf Tee.Chart
 * @constructor
 * @public
 * @class Properties to display a rectangle panel around chart axes
 * @param {Tee.Chart} chart The parent chart this wall object belongs to.
 * @property {Tee.Format} format Defines visual properties to paint this wall.
 * @property {Boolean} [visible=true] Determines if this wall will be displayed or not.
 */
function Wall(chart)
{
  this.format=new Tee.Format(chart);
  this.format.fill="#E6E6E6";
  this.format.stroke.fill="black";
  this.visible=true;
  this.bounds=new Rectangle();

  this.draw=function() {
    this.format.rectangle(this.bounds);
  }
}

/**
 * @returns {Number} Returns the integer part of value, without decimals, rounded to lower.
 */
function trunc(value) {
  return value | 0;
}

/**
 * @memberOf Tee.Chart
 * @constructor
 * @class Defines a scale from minimum to maximum, to transform series points into chart canvas pixels coordinates.
 * @param {Tee.Chart} chart The chart object this axis object belongs to.
 * @param {Boolean} horizontal Determines if axis is horizontal or vertical.
 * @param {Boolean} otherSide Determines if axis is at top/right or bottom/left side of chart.
 * @property {Tee.Format} format Visual properties to draw the axis line.
 * @property {Tee.Chart.Axis-Labels} labels Properties to display axis labels at tick increments.
 * @property {Tee.Chart.Axis-Grid} grid Properties to display grid lines at tick increments.
 * @property {Tee.Chart.Axis-Ticks} ticks Properties to display tick lines at each increment.
 * @property {Tee.Chart.Axis-Ticks} innerTicks Properties to display tick lines at each increment, inside chart.
 * @property {Tee.Chart.Axis-Ticks} minorTicks Properties to display small tick lines between ticks.
 * @property {Tee.Chart.Axis-Title} title Properties to display text that describes the axis.
 */
function Axis(chart,horizontal,otherSide) {
  this.chart=chart;
  this.visible=true;
  this.inverted=false;
  this.horizontal=horizontal;
  this.otherSide=otherSide;
  this.bounds=new Rectangle();

  this.position=0;

  this.format=new Tee.Format(chart);
  this.format.stroke.size=2;

  /**
   * @constructor
   * @public
   * @class Displays text to annotate axes
   * @param {Tee.Chart} chart The chart object this axis labels object belongs to.
   * @property {Tee.Format} format Defines the visual properties to paint the axis title.
   * @property {Boolean} [visible=true] Determines if axis labels will be displayed or not.
   * @property {String} dateFormat="shortDate" Configures string format for date & time labels
   * @property {Number} rotation=0 Defines the label rotation angle from 0 to 360 degree.
   * @property {String} labelStyle="auto" Determines label contents from series data ("auto", "none", "value", "mark", "text", "x").
   * @property {Number} decimals=2 Defines the number of decimals for floating-point numeric labels.
   * @property {Boolean} alternate=false When true, labels are displayed at alternate positions to fit more labels in the same space. 
   */
  function Labels(chart,axis) {

    this.chart=chart;
    this.format=new Tee.Format(chart);
    this.decimals=2;
    this.padding=4;
    this.separation=10; // %
    this.visible=true;
    this.rotation=0;
    this.alternate=false;

    this.labelStyle="auto"; // auto,none,value,mark,text,x

    this.dateFormat="shortDate";

   /**
    * @returns {String} Returns the series label that corresponds to a given value, (or the value if no label exists).
    */
    this.getLabel=function(series,value) {

      if (axis.dateTime) {
        return new Date(value).format(this.dateFormat);
      }
      else
      {
        var v=trunc(value);

        if (v==value) {
          if (series && series.data.labels[v])
            return series.data.labels[v];
          else
            return value.toFixed(0);
        }
        else
          return value.toFixed(this.decimals);
      }
    }

   /**
    * @returns {Number} Returns the width in pixels of value converted to string.
    */
    this.width=function(value) {
      return this.format.textWidth(this.getLabel(null,value));
    }

  }

  this.labels=new Labels(chart,this);
  var f=this.labels.format.font;

  /**
   * Changes the axis maximum and minimum values
   * @param {Number} delta The positive or negative amount to scroll.
   */
  this.scroll=function(delta) {
    this.automatic=false;
    if (this.inverted) delta=-delta;
    this.minimum+=delta;
    this.maximum+=delta;
  }

  if (horizontal)  {
    f.textAlign="center";
    f.baseLine= otherSide ? "bottom" : "top";
  }
  else
  {
    f.textAlign= otherSide ? "left" : "right";
    f.baseLine="middle";
  }

  /**
   * @constructor
   * @class Format and parameters to display a grid of lines at axes increments
   * @param {Tee.Chart} chart The chart object this axis grid object belongs to.
   * @property {Tee.Format} format Visual properties to draw axis grids.
   * @property {Boolean} [visible=true] Determines if grid lines will be displayed or not.
   * @property {Boolean} [centered=false] Determines if grid lines are displayed at axis label positions or at middle between labels.
   * @property {Boolean} [lineDash=false] Draws grid lines using dash-dot segments or solid lines.
   */
  function Grid(chart) {
    this.chart=chart;
    var f=this.format=new Tee.Format(chart);
    f.stroke.fill="silver";
    f.stroke.cap="butt";
    f.fill="";
    this.visible=true;
    this.lineDash=false;
  }

  this.grid=new Grid(chart);

  /**
   * @constructor
   * @class Stroke parameters to draw small lines at axes labels positions
   * @param {Tee.Chart} chart The chart object this axis ticks object belongs to.
   * @property {Tee.Stroke} stroke Defines the visual attributes used to draw the axis ticks.
   * @property {Number} [length=4] The length of ticks in pixels.
   */
  function Ticks(chart) {
    this.chart=chart;
    this.stroke=new Stroke(chart);
    this.stroke.cap="butt";
    this.visible=true;
    this.length=4;
  }

  this.ticks=new Ticks(chart);

  this.innerTicks=new Ticks(chart);
  this.innerTicks.visible=false;

  var m=this.minorTicks=new Ticks(chart);
  m.visible=false;
  m.length=2;
  m.count=3;

  /**
   * @constructor
   * @augments Tee.Annotation
   * @class Text and formatting properties to display near axes
   * @param {Tee.Chart} chart The chart object this axis title object belongs to.
   * @param {Boolean} [transparent=true] Determines if axis title will be displayed or not.
   */
  function Title(chart) {
    Tee.Annotation.call(this,chart);
    this.padding=4;
    this.transparent=true;
  }

  Title.prototype=new Tee.Annotation;

  this.title=new Title(chart);
  this.title.format.font.textAlign="center";

  this.automatic=true;
  this.minimum=0;
  this.maximum=0;
  this.increment=0;
  this.log=false;

  this.startPos=0;
  this.endPos=0;
  this.axisSize=0;

  this.scale=0;
  this.increm=0;
  this.maxlabelwidth=0;

 /**
  * @returns {Number} Returns the approximated width in pixels of largest axis label.
  */
  this.minmaxLabelWidth=function() {
    var l=this.labels, mi=this.roundMin(), ma=this.maximum, w=l.width(mi);
    w=Math.max(w,l.width(0.5*(mi+ma)));
    return Math.max(w,l.width(ma));
  }

  this.checkMinMax=function() {
    var s=this.chart.series;

    if (this.automatic) {
      if (this.horizontal) {
        this.minimum=s.minXValue();
        this.maximum=s.maxXValue();
      }
      else
      {
        this.minimum=s.minYValue();
        this.maximum=s.maxYValue();
      }
    }
  }

 /**
  * @returns {Number} Returns if any visible series has less than n parameter values.
  */
  function anySeriesHasLessThan(c, n) {
    var res=false, len=c.chart.series.count(), t, s, isY;

    for(t=0; t<len; t++) {
      s=c.chart.series.items[t], isY=s.yMandatory;

      if (s.visible)
         if ((isY && c.horizontal) ||
            ((! isY) && (! c.horizontal))) {
              if (s.associatedToAxis(c)) {
                res=s.count()<=n;
                if (res) break;
              }
         }
    }

    return res;
  }

 /**
  * @returns {Number} Returns the next bigger value in the sequence 1,2,5,10,20,50...
  */
  function nextStep(value) {
    if (! isFinite(value)) return 1;
    else
    if (value>=10) return 10*nextStep(0.1*value);
    else
    if (value<1) return 0.1*nextStep(value*10);
    else
      return (value<2) ? 2 : (value<5) ? 5 : 10;
  }

 /**
  * @returns {Number} Returns the best appropiate distance between axis labels.
  */
  function calcIncrement(c, maxLabelSize) {
    if (c.maximum==c.minimum) return 1;
    else
    {
      var tmp=c.axisSize/maxLabelSize, less=anySeriesHasLessThan(c,tmp);
      tmp=Math.abs(c.maximum-c.minimum)/(tmp+1);
      return (less) ? Math.max(1,tmp) : nextStep(tmp);
    }
  }

  this.calcScale=function()
  {
    var la=this.labels, l;

    la.format.font.prepare();
    l= this.horizontal ? this.minmaxLabelWidth() : la.format.textHeight("Wj");

    if (la.alternate) l*=0.5;

    l+=(l*la.separation*0.02);

    this.increm = (this.increment==0) ? calcIncrement(this,l) : this.increment;

    if (this.increm<=0) this.increm=0.1;

    var range=this.maximum-this.minimum;
    if (range==0) range=1;
    else
    if (this.log) range=Math.log(range);

    this.scale=this.axisSize/range;

    var w=this.calc(this.minimum+this.increm)-this.startPos;

    if (w<l) this.increm*=2;
  }

 /**
  * @returns {Boolean} Returns if there is at least one visible series associated to this axis.
  */
  this.hasAnySeries=function() {
    var li=this.chart.series.items, len=li.length, t, s, d;

    for(t=0; t<len; t++) {
      s=li[t];

      if (s.visible && s.associatedToAxis(this)) {
        if (this.horizontal) d=s.data.x ? s.data.x : s.data.values;
        this.dateTime=d && (d.length>0) && (d[0] instanceof Date);
        return true;
      }
    }

    return false;
  }

  this.drawAxis=function() {
    var c=this.chart.ctx;
    c.beginPath();

    if (horizontal) {
      c.moveTo(this.startPos,this.axisPos);
      c.lineTo(this.endPos,this.axisPos);
    }
    else
    {
      c.moveTo(this.axisPos,this.startPos);
      c.lineTo(this.axisPos,this.endPos);
    }

    this.format.stroke.prepare();
    c.stroke();
  }

  this.drawGrids=function() {
    var c=this.chart.ctx, p, r=this.chart.chartRect,
        f=this.grid.format, x1,y1,x2,y2, v;

    c.beginPath();

    if (horizontal) {
      y1=this.bounds.y;
      y2=otherSide ? r.getBottom()-1 : r.y+1;
    }
    else {
      x1=this.bounds.x;
      x2=otherSide ? r.x+1 : r.getRight()-1;
    }

    if (f.fill!="") {
      v = this.roundMin();
      if (this.grid.centered) v+=this.increm*0.5;

      var old=f.stroke.fill;
      f.stroke.fill="";

      var oldpos, pos=-1;

      while (v <= this.maximum) {
        p=this.calc(v);

        if ((pos % 2)==0)
          (horizontal) ? f.rectangle(oldpos,y2,p-oldpos,y1-y2) : f.rectangle(x1,oldpos,x2-x1,p-oldpos);

        oldpos=p;

        v += this.increm;
        pos++;
      }

      f.stroke.fill=old;
      c.fillStyle="";
    }

      v = this.roundMin();
      if (this.grid.centered) v+=this.increm*0.5;

    while (v <= this.maximum) {
      (horizontal) ? x1=x2=this.calc(v) : y1=y2=this.calc(v);

      if (f.stroke.dash && (!c.mozCurrentTransform))
          dashedLine(c,x1,y1,x2,y2);
      else
      {
        c.moveTo(x1,y1);
        c.lineTo(x2,y2);
      }

      v += this.increm;
    }

    f.stroke.prepare();
    f.shadow.prepare(c);
    c.stroke();

  }

 /**
  * @returns {Number} Returns the axis minimum value rounded according the axis increment distance.
  */
  this.roundMin=function() {
    if (this.dateTime)
       return this.minimum;
    else
    {
      var v=trunc(this.minimum/this.increm);
      return this.increm * ((this.minimum<=0) ? v : (1+v));
    }
  }

  this.drawTicks=function(t,factor,mult) {

    var v = this.roundMin(), tl=1+t.length, tl2=1;

    if ((horizontal && otherSide) || ((!horizontal) && (!otherSide)) )
    {
      tl=-tl;
      tl2=-1;
    }

    tl*=factor;
    tl2*=factor;

    tl+=this.axisPos;
    tl2+=this.axisPos;

    var p, inc, n=1, cou=0;

    if (mult==0)
       inc=this.increm;
    else {
       n+=mult;
       inc=this.increm/n;
    }

    var c=this.chart.ctx;
    c.beginPath();

    while (v <= this.maximum) {

      if ((mult==0) || ((cou++ % n)!=0)) {
        p=this.calc(v);

        if (horizontal) {
          c.moveTo(p,tl2);
          c.lineTo(p,tl);
        }
        else
        {
          c.moveTo(tl2,p);
          c.lineTo(tl,p);
        }
      }

      v += inc;
    }

    t.stroke.prepare();
    c.stroke();
  }

  this.drawTitle=function() {
    if (this.title.text!="") {

      var tmpX,tmpY;

      if (horizontal)
      {
       tmpY = this.axisPos+this.title.padding;

       if (this.ticks.visible) tmpY += this.ticks.length;

       if (this.labels.visible) {
         this.labels.format.font.prepare();
         var h=this.labels.format.textHeight("Wj");
         if (this.labels.alternate) h*=2;
         tmpY +=h;
       }

       tmpX=this.startPos+this.axisSize*0.5-(this.title.bounds.width*0.5);

       this.title.position.x=tmpX;
       this.title.position.y=tmpY;

       this.title.forceDraw();
      }
      else
      {
       tmpX = this.axisPos-this.title.bounds.height-this.title.padding;

       if (this.ticks.visible) tmpX -= this.ticks.length;

       if (this.labels.visible) {
         var w=this.maxlabelwidth;
         if (this.labels.alternate) w*=2;
         tmpX -= w;
       }

       tmpY=this.startPos + this.axisSize*0.5 + (this.title.bounds.height);

       var ctx=this.chart.ctx;

       ctx.save();
       ctx.translate(tmpX, tmpY);
       ctx.rotate(-Math.PI/2);
       ctx.textAlign = "center";

       this.title.position.x=0;
       this.title.position.y=0;

       this.title.forceDraw();
       //ctx.fillText(this.title.text, 0, 0);

       ctx.restore();

      }
    }
  }

  var firstSeries;

  this.drawLabel=function(value,r) {
    var s, l=this.labels;

    if (firstSeries && (firstSeries.notmandatory==this))
       s=l.getLabel(firstSeries,value);
    else
       s=l.getLabel(null,value);

    r.width=l.format.textWidth(s);
    if (r.width>this.maxlabelwidth)
        this.maxlabelwidth=r.width;

    (this.horizontal) ? r.x-=0.5*r.width : r.y+=r.height*0.5;

    if (l.rotation!=0) {
       var c=this.chart.ctx;
       c.save();
       c.translate(r.x, r.y);
       c.rotate(-Math.PI*l.rotation/180);
       c.textAlign="right";
       r.x=-8;
       r.y=3;
    }

    l.format.drawText(r, s);

    if (l.rotation!=0)
      this.chart.ctx.restore();
  }

  this.drawLabels=function() {
    this.maxlabelwidth=0;

    this.labels.format.font.prepare();

    var v=this.roundMin(), r=new Rectangle(), c=this.axisPos;

    var tl= this.ticks.visible ? this.ticks.length : 0;

    tl+=this.labels.padding;

    if (this.horizontal)
      (this.otherSide) ? c -=tl : c +=tl;
    else
      (this.otherSide) ? c +=tl : c -=tl;

    var oldc=c;

    r.height=this.labels.format.textHeight("Wj");

    firstSeries=this.chart.series.firstVisible();

    var alter=this.labels.alternate, w=this.minmaxLabelWidth(), p;

    while (v <= this.maximum) {
      p=this.calc(v);

      if (this.horizontal)
      {
        r.x=p;
        r.y=c; // -r.height*0.5;

        if (alter)
            c= ( c==oldc ) ? this.otherSide ? oldc-r.height : oldc+r.height : oldc;
      }
      else
      {
        r.x=c;
        r.y=p-r.height*0.5;

        if (alter)
            c= ( c==oldc ) ? this.otherSide ? oldc+w : oldc-w : oldc;
      }

      this.drawLabel(v,r);
      v += this.increm;
    }

  }

 /**
  * @returns {Number} Returns the position in pixels for a given value, using the axis scales.
  */
  this.calc=function(value) {
    var p;

    if (this.log)
    {
      value-=this.minimum;
      p=(value<=0) ? 0 : Math.log(value) * this.scale;
    }
    else
      p=(value - this.minimum) * this.scale;

    if (this.horizontal)
       return this.inverted ? this.endPos - p : this.startPos + p;
    else
       return this.inverted ? this.startPos + p : this.endPos - p;
  }

 /**
  * @returns {Number} Returns the axis value for a given position in pixels.
  */
  this.fromPos=function(p) {
    var i = this.horizontal;
    if (this.inverted) i=!i;
    return this.minimum + ((i ? (p-this.startPos) : (this.endPos-p)) /this.scale);
  }

  this.fromSize=function(p) {
    return (p/this.scale);
  }

 /**
  * @returns {Number} Returns the size in pixels of a given value, using the axis scales.
  */
  this.calcSize=function(value) {
    return Math.abs(this.calc(value)-this.calc(0));
  }

 /**
  * @param {Number} p1 Position in pixels to be axis minimum.
  * @param {Number} p2 Position in pixels to be axis maximum.
  */
  this.calcMinMax=function(p1,p2) {
    this.automatic=false;
    var a=this.fromPos(p1), b=this.fromPos(p2), tmp;
    if (a>b) { tmp=a; a=b; b=tmp; }
    this.minimum=a;
    this.maximum=b;
  }

  this.setMinMax=function(min,max) {
    this.automatic=false;
    this.minimum=min;
    this.maximum=max;
  }
}

Axis.adjustRect=function() {
  if (this.visible) {
    if (!this.hasAnySeries()) return;

    this.checkMinMax();

    var s=0, r=this.chart.chartRect, l=this.labels;

    if (l.visible) {
      l.format.font.prepare();
      s=this.horizontal ? l.format.textHeight("Wj") : this.minmaxLabelWidth();

      if (l.alternate) s*=2;
      s+=l.padding;
    }

    if (this.ticks.visible)
      s+=this.ticks.length;

    var ti=this.title;

    if (ti.visible && ti.text && (ti.text!="")) {
      ti.resize();
      s+=ti.bounds.height; //+ti.padding;
    }

    if (this.horizontal)
      (this.otherSide) ? r.setTop(r.y + s) : r.height -= s;
    else
      (this.otherSide) ? r.width -=s : r.setLeft(r.x+s);
  }
}

/**
 * @name Axis
 */
Axis.calcRect=function() {
  if (!this.hasAnySeries()) return;

  this.checkMinMax();

  var b=this.chart.chartRect, bo=this.bounds;

  if (this.horizontal) {

    bo.y= this.otherSide ? b.y : b.y+b.height;
    bo.width=b.width;

    this.startPos=b.x;
    this.endPos=b.x+b.width;
    this.axisSize=b.width;
  }
  else
  {
    bo.x= this.otherSide ? b.x+b.width : b.x;
    bo.height=b.height;

    this.startPos=b.y;
    this.endPos=b.y+b.height;
    this.axisSize=b.height;
  }

  this.calcScale();

  // Calculate axis margins:
  if (this.automatic) {
    var s=this.chart.series, m = this.horizontal ? s.horizMargins() : s.vertMargins();

    if (m.x>0)
       this.minimum-=this.fromSize(m.x);

    if (m.y>0)
       this.maximum+=this.fromSize(m.y);
  }

  this.calcScale();

  var v= (this.horizontal) ? b.height : b.width;
  v *= this.position * 0.01;

  if (this.horizontal)
     this.axisPos= this.otherSide ? b.y+ v : b.getBottom() - v;
  else
     this.axisPos= this.otherSide ? b.getRight() - v : b.x + v;
}

Axis.draw=function() {
  if (this.visible && this.hasAnySeries()) {

    this.drawAxis();

    if (this.grid.visible) this.drawGrids();
    if (this.ticks.visible) this.drawTicks(this.ticks,1,0);
    if (this.innerTicks.visible) this.drawTicks(this.innerTicks,-1,0);
    if (this.minorTicks.visible) this.drawTicks(this.minorTicks,1,Math.max(0,this.minorTicks.count));
    if (this.labels.visible) this.drawLabels();
    if (this.title.visible && this.title.text && (this.title.text!="")) this.drawTitle();
  }
}


/**
 * @memberOf Tee.Chart
 * @constructor
 * @class Displays a list of chart series data
 * @param {Tee.Chart} chart The parent chart this legend object belongs to.
 * @property {Number} align Legend position as offset % of chart size. Default 0.
 * @property {Number} padding Percent of chart size pixels to leave as margin from legend.
 * @property {Boolean} transparent Determines to draw or not the legend background.
 * @property {Tee.Format} format Formatting properties to draw legend background and items.
 * @property {Tee.Annotation} title Draws a title on top of legend.
 * @property {Rectangle} bounds Defines the legend position in pixels.
 * @property {String} position Automatic position legend ("left", "top", "right" or "bottom").
 * @property {Boolean} visible Defines to draw or not the legend.
 * @property {Boolean} inverted When true, legend items are displayed in inverted order.
 * @property {Boolean} fontColor Determines to fill each legend item text using series or point colors.
 * @property {Stroke} dividing Draws a line between legend items.
 * @property {Symbol} symbol Properties to draw a small indicator next to each legend item.
 * @property {String} legendStyle Determines to draw all visible series names or first visible series points. ("auto", "series", "values").
 * @property {String} textStyle What to draw at each legend item for series values: "auto", "valuelabel", "label", "value", "percent", "index", "labelvalue", "percentlabel"
 */
function Legend(chart)
{
  this.chart=chart;

  this.transparent=false;

  var f=this.format=new Tee.Format(chart);
  f.fill="white";
  f.round.x=8;
  f.round.y=8;
  f.font.textAlign="right";
  f.font.baseLine="top";
  f.shadow.visible=true;

  this.title=new Tee.Annotation(chart);
  this.title.transparent=true;

  this.bounds=new Rectangle();
  this.position="right";  // left, top, right, bottom, custom
  this.visible=true;
  this.inverted=false;
  this.padding=5;
  this.align=0; // % default = 0

  this.fontColor=false;

  var d=this.dividing=new Stroke(chart);
  d.fill=""; //"rgb(220,220,220)";
  d.cap="butt";

  /**
   * @constructor
   * @public
   * @class Displays a symbol at chart legend for each legend item
   * @param {Tee.Chart} chart The parent chart this legend symbol object belongs to.
   */
  function Symbol(chart) {
    this.chart=chart;

    var f=this.format=new Tee.Format(chart);
    f.shadow.visible=true;
    f.shadow.color="silver";

    this.width=8;
    this.height=8;
    this.padding=8; // "100%"

    this.visible=true;

    this.draw=function(series,index,x,y) {
      var c=chart.ctx;

      if (series.isColorEach && (index!=-1)) {
        series.format.stroke.prepare();

        var old=c.fillStyle;

        f.fill=series.getFill(index);
        f.rectangle(x,y-this.height*0.5,this.width,this.height);

        if (series.hover.enabled && series.over==index)
         series.hover.rectangle(x,y-this.height*0.5,this.width,this.height);

        c.fillStyle=old;
      }
      else
      {
        c.beginPath();
        c.moveTo(x,y);
        c.lineTo(x+this.width,y);
        f.stroke.prepare(series.format.fill);
        c.stroke();

        if (series.hover.enabled) {
          var sv=this.chart.legend.showValues();

          if ((sv && (series.over==index)) ||
              ((!sv) && (series.over!=-1))) {
           series.hover.stroke.prepare();
           c.stroke();
          }
        }
      }
    }
  }

  /*
   * Contains properties to paint a visual representation near each legend item.
   */
  this.symbol=new Symbol(chart);

  this.itemHeight=10;
  this.innerOff=0;

  this.legendStyle="auto"; // auto, series, values, ...
  this.textStyle="auto"; // valuelabel, label, value, percent, index, labelvalue, percentlabel

 /**
  * @returns {Number} Returns the width in pixels of legend items, including text and symbols if visible.
  */
  this.totalWidth=function() {
    var w=this.itemWidth+8, s=this.symbol;
    if (s.visible) w+=s.width+s.padding;
    return w;
  }

 /**
  * @returns {Number} Returns the maximum number of vertical rows using the available height.
  */
  this.availRows=function() {
    var h=this.bounds.y;
    if (!h) h=0;
    return 1+trunc((chart.chartRect.height-h) / this.itemHeight);
  }

 /**
  * @returns {Number} Returns the number of legend items that should be displayed.
  */
  this.itemsCount=function() {
    var ss=chart.series, result=ss.visibleCount(), r=chart.chartRect;

    if ((this.legendStyle=="values") && (result>0))
       result=ss.firstVisible().count();
    else
    {
      if (((this.legendStyle=="auto") && (result>1)) || (this.legendStyle=="series"))
      {}
      else
      if (result==1)
        result=ss.firstVisible().count();
    }

    if (this.isVertical()) {
      if (result*this.itemHeight > r.height)
         result=this.availRows();
    }
    else
    {
      this.rows=1;

      var total=this.totalWidth(), pad=this.calcPadding(r);

      var chartW=r.width-2*pad;

      if (result*total > chartW) {
         var w=r.x+pad;
         if (!w) w=0;

         this.perRow=trunc(chartW / total);

         if (result > this.perRow) {
           this.rows=1+trunc(result / this.perRow);

           if (this.rows * this.itemHeight > r.height) {
             this.rows=this.availRows();
             result=this.rows * this.perRow;
           }
         }
      }
      else
        this.perRow=result;
    }

    return result;
  }

 /**
  * @returns {Boolean} Returns if legend shows series titles or a series values.
  */
  this.showValues=function() {
    var s=this.legendStyle;
    return (s=="values") || ((s=="auto") && (chart.series.visibleCount()==1));
  }

 /**
  * @returns {String} Returns the index'th legend text string.
  */
  this.itemText=function(series,index) {
    var res=series.dataText(index,this.textStyle);
    return this.onGetText ? this.onGetText(this,series,index,res) : res;
  }

  var titleHeight=0;

  this.calcItemPos=function(index, pos) {
    var i=this.itemHeight, b=this.bounds;
    pos.x=b.x;
    pos.y=b.y+this.innerOff;

    if (this.isVertical()) {
      pos.x += b.width - 6 - this.innerOff;
      pos.y += (i*0.4) + (index*i) + titleHeight;
    }
    else
    {
      pos.x += this.innerOff + (1+(index % this.perRow)) * this.totalWidth();
      pos.y += (i * (trunc(index/this.perRow) + 0.25));
    }
  }

  this.drawSymbol=function(series,index,itemPos) {
    var s=this.symbol;
    s.draw(series,index,itemPos.x-this.itemWidth - s.width-s.padding,
                                  itemPos.y+(this.itemHeight*0.4));
  }

  var itemPos={x:0,y:0}, r=new Rectangle();

  this.drawItem=function(text,series,index) {
    this.calcItemPos(index,itemPos);

    r.x=itemPos.x;
    r.y=itemPos.y;

    var old=f.font.fill;

    if (this.fontColor)
      f.font.fill= this.showValues() ? series.getFill(index) : series.format.fill;

    f.drawText(r, text);

    f.font.fill=old;

    if (this.symbol.visible)
      this.drawSymbol(series,index,itemPos);

    if ((index>0) && (this.dividing.fill!=""))
    {
      var c=chart.ctx, b=this.bounds;
      c.beginPath();

      if (this.isVertical()) {
        c.moveTo(b.x,r.y-2);
        c.lineTo(b.getRight(),r.y-2);
      }
      else
      {
        var xx=r.x - this.itemWidth -4, sy=this.symbol;
        if (sy.visible) xx-= (sy.width+sy.padding);
        c.moveTo(xx, b.y);
        c.lineTo(xx, b.getBottom());
      }

      this.dividing.prepare();
      c.stroke();
    }
  }

 /**
  * @returns {Boolean} Returns if index'th series is visible and has been displayed at legend.
  */
  this.drawSeries=function(index,order) {
    var s=chart.series.items[index];
    if (s.visible) {
      var st= (s.title=="") ? "Series "+index.toString() : s.title;
      this.drawItem(st,s,order);
      return true;
    }
    else
      return false;
  }

  this.draw=function() {
    var c=this.itemsCount(), len, t, ti=this.title;

    if (c>0) {
      if (!this.transparent)
         f.rectangle(this.bounds);

      if (titleHeight>0) {
        ti.bounds.x=this.bounds.x+4;
        ti.bounds.y=this.bounds.y+2;
        ti.doDraw();
      }

      f.font.prepare();

      r.width=this.itemWidth;
      r.height=this.itemHeight;

      if (this.showValues()) {

        var s=chart.series.firstVisible(), order=0;
        len=c;

        if (this.inverted)
        while(len--)
          this.drawItem(this.itemText(s,len),s,order++);
        else
        for(t=0; t<len; t++)
          this.drawItem(this.itemText(s,t),s,t);
      }
      else
      {
        len=chart.series.count();
        c=0;

        if (this.inverted)
        while(len--) {
          if (this.drawSeries(len,c)) c++;
        }
        else
        for(t=0; t<len; t++)
          if (this.drawSeries(t,c)) c++;
      }
    }
  }

 /**
  * @returns {Number} Returns the maximum width in pixels of all legend items text.
  */
  this.largest=function() {
    var result=0, s, t, d, c, l=chart.series;

    if (this.showValues()) {
      s=l.firstVisible();
      c=this.itemsCount();

      for(t=0; t<c; t++) {
        d=f.textWidth(this.itemText(s,t));
        if (d>result) result=d;
      }
    }
    else
    {
      c=l.count();

      for(t=0; t<c; t++) {
        s=l.items[t];

        if (s.visible) {
          d=f.textWidth(s.title);
          if (d>result) result=d;
        }
      }
    }

    return result;
  }

 /**
  * @returns {Number} Returns the distance in pixels between legend and chart bounds.
  */
  this.calcPadding=function(r) {
    //var n = parseFloat( (this.padding.indexOf("%") == -1) ? this.padding : this.padding.substring(0,this.padding.length-1));
    return 0.01 * this.padding * (this.isVertical() ? r.width : r.height );
  }

 /**
  * @returns {Boolean} Returns if legend orientation is vertical.
  */
  this.isVertical=function() {
    return (this.position=="right") || (this.position=="left");
  }

  this.calcrect=function() {
    var titleWidth=0, t=this.title, r=chart.chartRect;

    f.font.prepare();
    this.itemHeight=f.textHeight("Wj");

    this.itemWidth=this.largest();

    if (t.visible && (t.text!="")) {
      t.resize();
      titleHeight=t.bounds.height;
      titleWidth=t.bounds.width;
    }
    else {
      titleHeight=0;
    }

    var pad=this.calcPadding(r), s, b=this.bounds, a=this.align;

    if (this.isVertical()) {
      s= this.symbol.visible ? this.symbol.width+this.symbol.padding : 0;

      b.width = 6+Math.max(titleWidth, 6 + this.itemWidth + s);
      if (a==0) a=20;
      b.y = chart.bounds.height*a*0.01;
      b.height= (0.5+this.itemsCount()) * this.itemHeight + titleHeight;
    }
    else
    {
      this.itemsCount();
      b.width = pad + this.perRow * this.totalWidth();
      b.x = (a*r.width*0.01) + (0.5 *(r.width - b.width));
      b.height= this.itemHeight * (this.rows+0.25);
    }

    if (f.stroke.fill!="") {
      s=f.stroke.size;
      if (s>1) {
        b.width+=s;
        b.height+=s;
        this.innerOff=s*0.5;
      }
    }

    if (this.position=="right")
    {
      b.x = r.getRight() - b.width;
      r.setRight(Math.max(r.x,b.x-pad));
    }
    else
    if (this.position=="left")
    {
      b.x = r.x;
      r.setLeft(b.x+b.width+pad);
    }
    else
    if (this.position=="top")
    {
      b.y = r.y + pad;
      r.setTop(b.getBottom()+pad);
    }
    else
    {
      b.y = r.getBottom() - b.height - pad;
      r.setBottom(b.y - pad);
    }
  }
}

/**
 * @memberOf Tee.Series
 * @constructor
 * @augments Tee.Annotation
 * @class Formatting properties to display annotations near series data points
 * @param {Tee.Series} series The parent series this marks object belongs to.
 * @param {Tee.Chart} chart The parent chart this marks object belongs to.
 * @property {Tee.Format} arrow Displays a line from mark to corresponding series point.
 * @property {Number} [arrow.length=10] Distance in pixels from mark to corresponding series point.
 * @property {Boolean} [arrow.underline=false] Draws a line under mark text.
 * @property {String} [style="auto"] Determines the text to display inside mark.
 * @property {Boolean} visible Defines if series marks are to be displayed or not.
 * @property {Number} [drawEvery=1] Controls how many marks to skip in between. (Useful for large series).
 */
function Marks(series,chart) {
  Tee.Annotation.call(this,chart);
  this.series=series;

  this.arrow=new Tee.Format(chart);
  this.arrow.length=10;
  this.arrow.underline=false;

  this.style = "auto"; // "value", "percent", "label", "valuelabel", "percentlabel" ...

  this.drawEvery=1;
  this.visible=false;

  /*
   * @private
   */
  this.setChart=function(chart) {
    this.chart=chart;
    this.format.setChart(chart);
    this.arrow.setChart(chart);
  }

  this.drawPolar=function(center,radius,angle,index) {
    var text=this.series.markText(index),
        px=center.x+Math.cos(angle)*radius, py=center.y+Math.sin(angle)*radius,
        c=this.chart.ctx;

    this.text=text;
    this.resize();

    var b=this.bounds, p2x, p2y, p=this.position;

    radius+=this.arrow.length;
    p2x=center.x+Math.cos(angle)*radius, p2y=center.y+Math.sin(angle)*radius;

    if (Math.abs(p2x-center.x)<b.width)
      p.x=p2x-b.width*0.5;
    else
      p.x= (p2x<center.x) ? p2x-b.width : p2x;

    if (Math.abs(p2y-center.y)<b.height)
      p.y=p2y-b.height*0.5;
    else
      p.y= (p2y<center.y) ? p2y-b.height : p2y;

    c.beginPath();
    c.moveTo(px,py);
    c.lineTo(p2x,p2y);

    if (this.arrow.underline) {
      c.moveTo(p.x,p2y);
      c.lineTo(p.x+b.width,p2y);
    }

    this.arrow.stroke.prepare();
    c.stroke();

    this.draw();
  }

  this.drawMark=function(x,y,index,inverted) {

    var s = this.series.markText(index), ar=this.arrow;

    if (s && (s!="")) {
      this.text=s;
      this.resize();

      var factor= inverted ? -1 : 1, r=this.bounds, m=this.series.yMandatory;

      if (m) {
        r.x=x-(r.width*0.5);
        r.y=y-factor*(ar.length+ (inverted ? 0 : r.height));
      }
      else
      {
        r.x=x+factor*ar.length;
        if (inverted) r.x-=r.width;
        r.y=y-(r.height*0.5);
      }

      this.position.x= r.x;
      this.position.y= r.y;
      this.draw();

      var rbot=inverted ? r.y : r.getBottom(), c=this.chart.ctx;
      c.beginPath();

      if (m) {
        c.moveTo(x,rbot);
        c.lineTo(x,y);

        if (ar.underline) {
          c.moveTo(r.x,rbot);
          c.lineTo(r.x+r.width,rbot);
        }
      }
      else
      {
        var py=r.y+(r.height*0.5);
        c.moveTo(x,py);

        if (inverted) r.x+=r.width;
        c.lineTo(r.x,py);

        if (ar.underline) {
          c.moveTo(r.x,r.y+r.height);
          c.lineTo(r.x+ (inverted ? -r.width : r.width),r.y+r.height);
        }
      }

      ar.stroke.prepare();
      c.stroke();
    }
  }
}

Marks.prototype=new Tee.Annotation;

/**
 * @returns {Number} Returns the sum of all values in the array or typed-array parameter.
 * @param {Array|ArrayBuffer} a The array or typed-array to sum.
 */
function ArraySum(a){
  var sum=0, len=a.length;
  while(len--) sum+=a[len];
	return sum;
}
/**
 * @returns {Number} Returns the sum of all absolute values in the array or typed-array parameter.
 * @param {Array|ArrayBuffer} a The array or typed-array to do absolute sum.
 */
function ArraySumAbs(a){
  var sum=0, len=a.length;
  while(len--) sum+= (a[len]>0 ? a[len] : -a[len]);
	return sum;
}
/**
 * @returns {Number} Returns the maximum value in the array or typed-array parameter.
 * @param {Array|ArrayBuffer} a The array or typed-array of numbers.
 */
function ArrayMax(a){
	return Math.max.apply({},a)
}
/**
 * @returns {Number} Returns the minimum value in the array or typed-array parameter.
 * @param {Array|ArrayBuffer} a The array or typed-array of numbers.
 */
function ArrayMin(a){
	return Math.min.apply({},a)
}

/**
 * @constructor
 * @class Base abstract class to define a series of data
 * @param {Object|Tee.Chart|Number[]} o An array of numbers, or a chart or datasource object.
 * @property {Tee.Chart} chart The parent chart this Series object belongs to.
 * @property {Number[]} data.values Array of numbers as main series data.
 * @property {String[]} data.labels Array of strings used to display at axis labels, legend and marks.
 * @property {Tee.Format} format Visual properties to display series data.
 * @property {Boolean} [visible=true] Determines if this series will be displayed or not.
 * @property {String} [cursor="default"] Defines the mouse cursor to show when mouse is over a series point.
 * @property {Object} data Contains all series data values, labels, etc.
 * @property {Tee.Series.Marks} marks Displays annotations near series points.
 * @property {Boolean} [colorEach="auto"] Paints points using series fill color, or each point with a different color
 * from series palette or chart palette color array.
 */
Tee.Series=function(o,o2) {
  this.chart=null;
  this.data={ values:[], labels:[], source:null }

  this.yMandatory=true;
  this.horizAxis="bottom";
  this.vertAxis="left";

  var f=this.format=new Tee.Format(this.chart),
      ho=this.hover=new Tee.Format(this.chart), s=ho.shadow;

  f.fill="";
  f.stroke.fill="";
  this.visible=true;

  // Hover
  ho.stroke.size=3;
  ho.fill="";
  ho.stroke.fill="red";

  s.visible=true;
  s.color="red";
  s.blur=10;
  s.width=0;
  s.height=0;

  this.cursor="default";
  this.over=-1;

  this.marks=new Marks(this,this.chart);

  this.colorEach="auto";
  this.useAxes=true;
  this.decimals=2;

  this.init=function(o,o2) {
    if (typeof(o)==="object") {
      if (o) {
         if (o instanceof Array) {
            this.data.values=o;

            if (o2 instanceof Array)
              this.data.labels=o2;
         }
         else
         if (o instanceof Tee.Chart) {
            this.chart=o;
            if (o2 instanceof Array)
              this.data.values=o2;
         }
         else
         {
            this.data.source=o;
            this.refresh();
         }
      }
    }
  }

  this.init(o,o2);

 /**
  * @returns {String} Returns the color of index point in series, using series palette or chart palette.
  */
  this.getFill=function(index) {
    return this.palette ? this.palette.get(index) : this.chart.palette.get(index);
  }

 /**
  * @returns {CanvasGradient} Returns a canvas gradient using color, or color if gradient is not visible.
  */
  this.getFillStyle=function(r,color) {
    return f.gradient.visible ? f.gradient.create(r,color) : color;
  }

  this.recalcAxes=function() {
    var a=this.chart.axes;
    this._horizAxis= (this.horizAxis=="top") ? a.top : a.bottom;
    this._vertAxis= (this.vertAxis=="right") ? a.right : a.left;

    this.mandatoryAxis = this.yMandatory ? this._vertAxis : this._horizAxis;
    this.notmandatory = this.yMandatory ? this._horizAxis : this._vertAxis;
  }

  this.title="";

  this.refresh=function(failure) {
    if (this.data.source) {

      if (this.data.source instanceof HTMLTextAreaElement) {
        parseText(this.data,this.data.source.value);

        if (this.chart)
           this.chart.draw();
      }
      else
      if (this.data.source instanceof HTMLInputElement) {
        doHttpRequest(this.data.source.value, function(data) {
          parseText(this.data,data);
          this.chart.draw();
        }, function(status,statusText) { if (failure) failure(this,status,statusText ); });
      }
      else
        if (failure) failure(this);
    }
    else
    if (this.data.xml) {
      parseXML(this,this.data.xml);
      this.chart.draw();
    }
    else
    if (this.data.json) {
      parseJSON(this,this.data.json);
      this.chart.draw();
    }
  }

 /**
  * @returns {String} Returns the series index'th data label, or the value if no label exists at that index.
  */
  this.valueOrLabel=function(index) {
    var s=this.data.labels[index];

    if ( (!s) || (s==""))
      s=this.valueText(index);

    return s;
  }

 /**
  * @returns {String} Returns a percentual representation of the series index'th value, on total of series values.
  */
  this.toPercent=function(index) {
    return (100*this.data.values[index]/ArraySum(this.data.values)).toFixed(this.decimals)+" %";
  }

 /**
  * @returns {String} Returns the text string to show for a given series point index.
  * @param {Number} index The point position in series data array.
  * @param {String} style Defines how text is returned: "auto", "value", "percent", "percentlabel",
  * "valuelabel", "label", "index", "labelvalue", "labelpercent"
  */
  this.dataText=function(index,style) {
    var l=this.data.labels[index];

    if (style=="value")
      return this.valueText(index);
    else
    if (style=="percent")
      return this.toPercent(index);
    else
    if (style=="percentlabel")
      return this.toPercent(index)+ (l ? " "+l : "");
    else
    if ((style=="valuelabel") || (style=="auto"))
      return this.valueText(index)+ (l ? " "+l : "");
    else
    if (style=="label")
      return l || "";
    else
    if (style=="index")
      return index.toFixed(0);
    else
    if (style=="labelvalue")
      return (l ? l+" " : "")+this.valueText(index);
    else
    if (style=="labelpercent")
      return (l ? l+" " : "")+this.toPercent(index);
    else
      return this.valueOrLabel(index);
  }

 /**
  * @returns {String} Returns the text string to show at series marks, for a given series point index.
  */
  this.markText=function(index) {
     //visibleBar>1 ? this.valueText(t) : this.markText(t),

    var m=this.marks, res=this.dataText(index,m.style);
    return m.onGetText ? m.onGetText(this,index,res) : res;
  }

 /**
  * @returns {String} Returns the text string for a given series point index value.
  */
  this.valueText=function(index) {
      var d=this.data.values[index];

      if (d) {
        if (trunc(d)==d)
          d=d.toFixed(0);
        else
          d=d.toFixed(this.decimals);
      }
      else
        d="0";

      return d;
  }

 /**
  * @returns {Boolean} Returns if series is associated to axis, either horizontal or vertical.
  */
  this.associatedToAxis=function(axis) {
    if (axis.horizontal)
      return (this.horizAxis=="both") || (this._horizAxis==axis);
    else
      return (this.vertAxis=="both") || (this._vertAxis==axis);
  }

  this.bounds=function(r) {
    var h=this._horizAxis, v=this._vertAxis;

    r.x=h.calc(this.minXValue());
    r.width=h.calc(this.maxXValue())-r.x;

    r.y=v.calc(this.maxYValue());
    r.height=v.calc(this.minYValue())-r.y;
  }

  this.calcStack=function(index,p,value) {
    var sum=this.pointOrigin(index,false)+value, tmp, a=this.mandatoryAxis;

    p.x=this.notmandatory.calc(this.data.x ? this.data.x[index] : index);

    if (this.isStack100) {
      tmp=this.pointOrigin(index,true);
      p.y=(tmp==0) ? a.endPos : a.calc(sum*100.0/tmp);
    }
    else
      p.y=a.calc(sum);

    if (!this.yMandatory) {
      tmp=p.x;
      p.x=p.y;
      p.y=tmp;
    }
  }

 /**
  * @returns {Number} Returns the sum of all previous visible series index'th value, for stacking.
  */
  this.pointOrigin=function(index, sumAll) {
     var res=0, t, s, li=this.chart.series.items;

     for (t=0; t<li.length; t++) {
         s=li[t];

       if ((! sumAll) && (s==this)) break;
       else
       if (s.visible && (s.constructor==this.constructor) && (s.data.values.length>index)) {
        var tmp=s.data.values[index];
        res+= (sumAll && (tmp<0)) ? -tmp : tmp;
       }
     }

     return res;
  }
}

  /*
   * @private
   */
  Tee.Series.prototype.setChart=function(series,chart) {
    series.chart=chart;

    series.recalcAxes();

    series.format.setChart(chart);
    series.marks.setChart(chart);
    series.hover.setChart(chart);
  }

  Tee.Series.prototype.calc=function(index,p) {
    p.x=this.notmandatory.calc( this.data.x ? this.data.x[index] : index);
    p.y=this.mandatoryAxis.calc(this.data.values[index]);

    if (!this.yMandatory) {
      var tmp=p.x;
      p.x=p.y;
      p.y=tmp;
    }
  }

  Tee.Series.prototype.clicked=function(p) {
    return -1;
  }

  Tee.Series.prototype.mousemove=function(p) {
    if (this.hover.enabled || (this.cursor!="default")) {
      var tmp=this.clicked(p), o=this.chart;

      if (tmp!=this.over) {
        this.over=tmp;
        if (this.hover.enabled)
           requestAnimFrame(function() {o.draw()});
      }

      if ((this.cursor!="default") && (tmp!=-1)) {
        this.chart.newCursor=this.cursor;
        return true;
      }
    }

    return false;
  }

  Tee.Series.prototype.drawMarks=function() {
    var len=this.data.values.length, p=new Point(), t;
    for(t=0; t<len; t+=this.marks.drawEvery) {
      this.calc(t,p);
      this.marks.drawMark(p.x,p.y,t);
    }
  }

  Tee.Series.prototype.horizMargins=function() {}

  Tee.Series.prototype.vertMargins=function() {}

 /**
  * @returns {Number} Returns the minimum value of series x values, or zero if no x values exist.
  */
  Tee.Series.prototype.minXValue=function() {
    return (this.data.x && (this.data.x.length>0)) ? ArrayMin(this.data.x) : 0;
  }

 /**
  * @returns {Number} Returns the minimum value of series data values, or zero if no values exist.
  */
  Tee.Series.prototype.minYValue=function() {
    return this.data.values.length>0 ? ArrayMin(this.data.values) : 0;
  }

 /**
  * @returns {Number} Returns the maximum value of series x values, or data length minus one, if no x values exist.
  */
  Tee.Series.prototype.maxXValue=function() {
    if (this.data.x)
      return this.data.x.length>0 ? ArrayMax(this.data.x) : 0;
    else {
      var len=this.data.values.length;
      return len==0 ? 0 : len-1;
    }
  }

 /**
  * @returns {Number} Returns the maximum value of series values, or zero if no values exist.
  */
  Tee.Series.prototype.maxYValue=function() {
    return this.data.values.length>0 ? ArrayMax(this.data.values) : 0;
  }

  Tee.Series.prototype.calcColorEach=function() {
    this.isColorEach=(this.colorEach=="yes");
  }

 /**
  * @returns {Number} Returns the maximum of all series values, or sum of all stacked values.
  */
  Tee.Series.prototype.stackMaxValue=function() {
    if (this.stacked=="100")
       return 100;
    else
    {
      var temp= Tee.Series.prototype.maxYValue;

      if (this.stacked=="no")
         return temp.call(this);
      else
      {
        var res=temp.call(this), len=this.data.values.length;

        while(len--)
            res=Math.max(res, this.pointOrigin(len,false) + this.data.values[len]);

        return res;
      }
    }
  }

 /**
  * @returns {Number} Returns the number of series data values.
  */
  Tee.Series.prototype.count=function() { return this.data.values.length; }

  Tee.Series.prototype.addRandom=function(count, range, x) {

    if (!range) range=1000;

    var d=this.data;
    d.values.length=count;

    if (x)
      d.x=new Array(count);

    if (count>0) {
      d.values[0]=Math.random()*range;

      if (x) d.x[0]=Math.random()*range;

      for (var t=1; t<count; t++) {
        d.values[t]=d.values[t-1] + (Math.random()*range) -(range*0.5);
        if (x) d.x[t]=Math.random()*range;
      }

    }

    return this;
  }

/**
 * @returns {Array} Returns an array of series data indices sorted according to sortBy parameter.
 */
Tee.Series.prototype.doSort=function(sortBy,ascending) {
  if (sortBy=="none")
    return null;
  else
  {
    var d=this.data.values, len=d.length, sorted=new Array(len), t=0;
    for(; t<len; t++) sorted[t]=t;

    if (sortBy=="labels") {
      d=this.data.labels;
      sorted.sort( ascending ? function(a,b){
          // A=a.toLowerCase(); B=b.toLowerCase();
          return d[a]<d[b] ? 1 : d[a]==d[b] ? 0 : -1} : function(a,b){return d[b]<d[a] ? 1 : d[a]==d[b] ? 0 : -1} );
    }
    else
      sorted.sort( ascending ? function(a,b){return d[a]-d[b]} : function(a,b){return d[b]-d[a]} );

    return sorted;
  }
}

/**
 * @memberOf Tee.Chart
 * @constructor
 * @class Contains a list of chart series objects
 * @param {Tee.Chart} chart The parent chart this list of series belongs to.
 * @property {Tee.Series[]} items The array containing series instances.
 */
function SeriesList(chart)
{
  this.chart=chart;
  this.items=[];

 /**
  * @returns {Number} Returns the total number of series in chart, visible or not.
  */
  this.count=function() { return this.items.length; }

 /**
  * @returns {Boolean} Returns if {@link Tee.Point} p parameter is over any series point.
  */
  this.clicked=function(p) {
    var done=false;

    this.each(function(s) {
      if (s.visible && s.onclick) {
        var index=s.clicked(p);
        if (index!=-1)
          done=s.onclick(s,index,p.x,p.y);
      }
    });

    return done;
  }

  this.mousemove=function(p) {
    var len=this.items.length, s;

    while(len--) {
     	s=this.items[len];
      if (s.visible && s.mousemove(p))
         return;
    }
  }

 /**
  * @returns {Number} Returns the number of visible series in chart.
  */
  this.visibleCount=function(s,c,res) {
    var r=0, len=this.items.length, i;

    while(len--, i=this.items[len])
      if (i.visible && ((!c) || (i instanceof c))) {
        if (res && (i==s)) res.index=r;
        r++;
      }
    if (res) res.total=r;
    return r;
  }

  this.beforeDraw=function() {
    this.each(function(s) {
      if (s.useAxes)
        s.recalcAxes();

      s.calcColorEach();
    });
  }

 /**
  * @returns {Boolean} Returns if any visible series in chart needs axes to be represented.
  */
  this.anyUsesAxes=function() {
    var len=this.items.length, s;
    while(len--) {
      s=this.items[len];
      if (s.visible && s.useAxes)
         return true;
    }

    return false;
  }

 /**
  * @returns {Tee.Series} Returns the first visible series in chart, or null if any.
  */
  this.firstVisible=function() {
    for(var t=0, s; s=this.items[t++];)
      if (s.visible) return s;
    return null;
  }

 /**
  * Calculates the maximum amount of vertical margins in pixels from all series.
  * @returns {Tee.Point} Returns the maximum top/bottom distance in pixels that all series need to be separated from axes.
  */
  this.vertMargins=function() {
    var result, li=this.items, len=li.length, s, t;

    if (len>0) {
      result={x:0,y:0};
      s={x:0,y:0};
     	li[0].vertMargins(result);

      for(t=1; t<len; t++) {
        s.x=s.y=0;
       	li[t].vertMargins(s);
        if (s.x>result.x) result.x=s.x;
        if (s.y>result.y) result.y=s.y;
      }
    }
    return result;
  }

 /**
  * Calculates the maximum amount of horizontal margins in pixels from all series
  * @returns {Tee.Point} Returns the maximum left/right distance in pixels that all series need to be separated from axes.
  */
  this.horizMargins=function() {
    var result, li=this.items, len=li.length, s, t;

    if (len>0) {
      result={x:0,y:0};
      s={x:0,y:0};
      li[0].horizMargins(result);

      for(t=1; t<len; t++) {
        s.x=s.y=0;
       	li[t].horizMargins(s);
        if (s.x>result.x) result.x=s.x;
        if (s.y>result.y) result.y=s.y;
      }
    }
    return result;
  }

 /**
  * @returns {Number} Returns the minimum of all visible series mininum x values.
  */
  this.minXValue=function() {
    var result=Infinity, len=this.items.length, v, s;
    while(len--) {
      s=this.items[len];
      if (s.visible) {
       	v=s.minXValue();
        if (v<result) result=v;
      }
    }
    return result;
  }

 /**
  * @returns {Number} Returns the minimum of all visible series mininum data values.
  */
  this.minYValue=function() {
    var result=Infinity, len=this.items.length, v, s;
    while(len--) {
      s=this.items[len];
      if (s.visible) {
       	v=s.minYValue();
        if (v<result) result=v;
      }
    }
    return result;
  }

 /**
  * @returns {Number} Returns the maximum of all visible series maximum x values.
  */
  this.maxXValue=function() {
    var result=-Infinity, len=this.items.length, v, s;
    while(len--) {
      s=this.items[len];
      if (s.visible) {
       	v=s.maxXValue();
        if (v>result) result=v;
      }
    }
    return result;
  }

 /**
  * @returns {Number} Returns the maximum of all visible series maximum data values.
  */
  this.maxYValue=function() {
    var result=-Infinity, len=this.items.length, v, s;
    while(len--) {
      s=this.items[len];
      if (s.visible) {
       	v=s.maxYValue();
        if (v>result) result=v;
      }
    }
    return result;
  }

  this.draw=function() {
    var len=this.items.length, c=this.chart.ctx, a=this.chart.aspect, t, s;

    if (len>0) {

      var shouldClip=a.clip && this.chart.series.anyUsesAxes();

      if (shouldClip)
         a.clipRect(this.chart.chartRect);

      try
      {
        for(t=0; t<len; t++) {
          s=this.items[t];

          if (s.visible) {
            var old=c.globalAlpha;
            c.globalAlpha=(1-s.format.transparency);

            if (s.transform)
            {
               c.save();
               s.transform();
            }

            s.draw();

            if (s.transform) c.restore();

            c.globalAlpha=old;
          }
        }

      }
      finally
      {
        if (shouldClip)
           //a.clipRect(this.chart.bounds);
           c.restore();
      }

      for(t=0, s; t<len; t++) {
        s=this.items[t];

        if (s.visible && s.marks.visible) {

           if (s.transform)
           {
             c.save();
             s.transform();
           }

           s.drawMarks();

           if (s.transform) c.restore();
        }
      }
    }
  }
}

/**
 * @type SeriesList
 * Calls f function parameter for each series in list
 */
SeriesList.prototype.each=function(f) {
  var l=this.items.length, t=0;
  for(; t<l; t++) f(this.items[t]);
}

/**
 * @memberOf Tee.Chart
 * @constructor
 * @class Contains four axis objects: left, top, right and bottom
 * @param {Tee.Chart} chart The parent chart this axes object belongs to.
 */
function Axes(chart)
{
  this.chart=chart;
  this.visible=true;

  /**
   * @public
   * @type Tee.Chart.Axis
   */
  this.left=new Axis(chart,false,false);

  /**
   * @public
   * @type Tee.Chart.Axis
   */
  this.top=new Axis(chart,true,true);

  /**
   * @public
   * @type Tee.Chart.Axis
   */
  this.right=new Axis(chart,false,true);

  /**
   * @public
   * @type Tee.Chart.Axis
   */
  this.bottom=new Axis(chart,true,false);

  this.items=[this.left,this.top,this.right,this.bottom];
  this.each=function(f) { for(var t=0, a; a=this.items[t++];) f.call(a); };
}

/**
 * @example
 * var Chart1 = new Tee.Chart("canvas");
 * Chart1.addSeries(new Tee.Bar([1,2,3,4]));
 * Chart1.draw();
 * @constructor
 * @class The main Chart class
 * @param {String|HTMLCanvasElement} [canvas] Optional canvas id or <a href="http://www.w3.org/TR/html5/the-canvas-element.html">element</a>.
 * @property {HTMLCanvasElement} canvas The <a href="http://www.w3.org/TR/html5/the-canvas-element.html">canvas</a> where this chart will paint to.
 * @property {Tee.Rectangle} bounds The rectangle where this chart will be painted inside canvas.
 * @property {Tee.Palette} palette The list of colors to use as default colors for series and points.
 * @property {Tee.Chart.Aspect} aspect Contains properties related to 3D and graphics parameters.
 * @property {Tee.Chart.Panel} panel Contains properties used to fill the chart background.
 * @property {Tee.Chart.Walls} walls Contains properties used to draw chart walls around axes.
 * @property {Tee.Chart.Axes} axes Contains a list of axis used to draw series.
 * @property {Tee.Chart.Legend} legend Contains properties to control the legend, a panel showing the list of series or values.
 * @property {Tee.Chart.SeriesList} series Contains a list of Tee.Series objects that belong to this chart.
 * @property {Tee.Chart.Title} title Properties to draw text at top side of chart.
 * @property {Tee.Chart.Title} footer Properties to draw text at bottom side of chart.
 * @property {Tee.Chart.Zoom} zoom Properties to control mouse/touch dragging to zoom chart axes scales.
 * @property {Tee.Chart.Scroll} scroll Properties to control mouse/touch dragging to scroll or pan contents inside chart axes.
 * @property {Tee.Chart.Tools} tools Contains a list of Tee.Tool objects that belong to this chart.
 */
Tee.Chart=function(canvas,data,type)
{
  var ua=typeof navigator!="undefined" ? navigator.userAgent.toLowerCase() : "";
  /**
   * @constant
   * @private
   */
  this.isChrome=ua.indexOf('chrome') > -1;
  /**
   * @constant
   * @private
   */
  this.isAndroid=ua.indexOf('android') > -1;

  if (canvas) {
    if ((typeof HTMLCanvasElement!=="undefined") && (canvas instanceof HTMLCanvasElement))
       this.canvas=canvas;
    else
    if (typeof(canvas)=="string")
       this.canvas=document.getElementById(canvas);
    else
       this.canvas=canvas;
  }
  else
  {
    this.canvas=document.createElement("canvas");
    this.canvas.width=600;
    this.canvas.height=400;
  }

  var c=this.canvas;

  if (c.clientWidth==0)
    this.bounds=new Rectangle(0,0,c.width,c.height);
  else
    this.bounds=new Rectangle(0,0,c.clientWidth,c.clientHeight);

  this.chartRect=new Rectangle();
  this.chartRect.setFrom(this.bounds);

  this.palette=new Tee.Palette([ "#4466a3", "#f39c35", "#f14c14", "#4e97a8", "#2b406b",
                "#1d7b63", "#b3080e", "#f2c05d", "#5db79e", "#707070",
                "#f3ea8d", "#b4b4b4"]);

  /**
   * @memberOf Tee.Chart
   * @class Contains properties related to canvas and 2D / 3D
   * @param {Tee.Chart} chart The parent chart this aspect object belongs to.
   * @property {Boolean} clip When true, series contents will be restricted to paint inside axes boundaries.
   */
  this.aspect={
    chart:this,
    view3d:false,
    ortogonal:true,
    rotation:0,
    elevation:315,
    perspective:50,
    clip:true,

    /**
     * @param {Tee.Rectangle} r The rectangle object to apply clipping.
     */
    clipRect:function(r) {

      var c=this.chart.ctx;
      c.save();

      c.beginPath();
      c.rect(r.x,r.y,r.width,r.height);
      c.clip();
      //c.closePath();
    }
  }

  /*
   * Properties to paint the chart background
   */
  this.panel=new Panel(this);

  /**
   * @memberOf Tee.Chart
   * @constructor
   * @class Contains left, right, bottom and back wall objects
   * @param {Tee.Chart} chart The parent chart this walls object belongs to.
   * @property {Boolean} [visible=true] Determines if walls will be displayed or not.
   * @property {Tee.Chart.Wall} back Visual properties to paint the back wall.
   */
  this.walls={
    chart:this,
    visible:true,
    left:new Wall(this),
    right:new Wall(this),
    bottom:new Wall(this),
    back:new Wall(this),
    draw:function() {
      if (this.back.visible) this.back.draw();

      if (this.chart.aspect.view3d) {
        if (this.left.visible) this.left.draw();
        if (this.bottom.visible) this.bottom.draw();
        if (this.right.visible) this.right.draw();
      }
    }
  }

  var bf=this.walls.back.format;
  bf.fill="rgb(240,240,240)";
  bf.shadow.visible=true;

  /*
   * Four axes
   */
  this.axes=new Axes(this);

  /*
   * Properties to paint a list of series or values.
   */
  this.legend=new Legend(this);

  /*
   * List of Tee.Series objects that this chart contains.
   */
  this.series=new SeriesList(this);

  this.title=new Title(this, "blue");
  this.title.text="TeeChart";

  this.footer=new Title(this, "red");

  this.zoom=new Zoom(this);
  this.scroll=new Scroll(this);

  this.tools=new Tools(this);

  /**
   * @private
   */
  this.oldPos=new Point();

  /**
   * @private
   * @returns {Tee.Point} Returns the xy local coordinates from a mouse or touch event
   */
  this.calcMouse=function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0;

    if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    /*
    offsetX += stylePaddingLeft;
    offsetY += stylePaddingTop;

    offsetX += styleBorderLeft;
    offsetY += styleBorderTop;
    */

    var docX,docY;

     if (e.pageX == null)
     {
        var d= (document.documentElement &&
                document.documentElement.scrollLeft != null) ?
                document.documentElement : document.body;
        docX= e.clientX + d.scrollLeft;
        docY= e.clientY + d.scrollTop;
     }
     else
     {
        docX= e.pageX;
        docY= e.pageY;
     }

    return new Point(docX - offsetX, docY - offsetY);
  }

  this.domousemove=function(event) {
    event=event || window.event;

    if (event.touches)
       event=event.touches[event.touches.length-1];

    var c=this.chart, p=c.calcMouse(event);

    if (c.scroll.active) {

       var d=c.scroll.direction, both=(d=="both"), delta;

       if (both || (d=="horizontal")) {
         delta=c.axes.bottom.fromSize(c.oldPos.x-p.x);
         c.axes.top.scroll(delta);
         c.axes.bottom.scroll(delta);
       }

       if (both || (d=="vertical")) {
         delta= -c.axes.left.fromSize(c.oldPos.y-p.y);
         c.axes.left.scroll(delta);
         c.axes.right.scroll(delta);
       }

       c.oldPos.x=p.x;
       c.oldPos.y=p.y;

       c.scroll.done=true;

       c.canvas.oncontextmenu=function(){ return false;}

       if (c.onscroll) c.onscroll();

       requestAnimFrame(function() {c.draw();});

       return false;
    }
    else
    if (c.zoom.active) {

       if ((p.x != c.oldPos.x) || (p.y != c.oldPos.y)) {
         if (!c.zoom.old)
           c.zoom.old=new Point();

         c.zoom.old.x=p.x-c.oldPos.x;
         c.zoom.old.y=p.y-c.oldPos.y;

         requestAnimFrame(function() { c.draw(); });

         c.zoom.done=true;
       }

       return false;
    }
    else
    {
      c.newCursor=null;
      c.tools.mousemove(p);
      c.series.mousemove(p);

      var s=this.chart.canvas.style;

      if (c.newCursor) {
         if (s.cursor!=c.newCursor) {
           c.oldCursor=s.cursor;
           s.cursor=c.newCursor;
         }
      }
      else
      if ((c.oldCursor!=undefined) && (s.cursor!=c.oldCursor))
         s.cursor=c.oldCursor;

      return true;
    }
  }

  this.domousedown=function(event) {
    event=event || window.event;
    var done=false, c=this.chart,
        p=c.calcMouse(event.touches ? event.touches[0] : event),
        inRect=c.series.anyUsesAxes() && c.chartRect.contains(p);

    if (event.touches) {
      //alert("touch! "+event.touches.length.toString());
      // two-finger pinch to zoom, one finger to scroll

      if (event.touches.length>1) {
        c.zoom.active=c.zoom.enabled && inRect;
        if (c.zoom.active) c.scroll.active=false;
      }
      else {
        c.scroll.active=c.scroll.enabled && inRect;
        if (c.scroll.active) c.zoom.active=false;
      }
    }
    else
    {
      c.zoom.active=(event.button==c.zoom.mouseButton) && c.zoom.enabled && inRect;
      c.scroll.active=(event.button==c.scroll.mouseButton) && c.scroll.enabled && inRect;
    }

    c.zoom.done=false;
    c.scroll.done=false;
    c.oldPos=p;

    if (event.button==c.zoom.mouseButton)
       done=c.tools.mousedown(event);

    if (done)
      c.zoom.active=c.scroll.active=false;
    else
      done=(c.zoom.active || c.scroll.active);

    if (done) event.preventDefault();
    return !done;
  }

  this.domouseup=function(event) {
    event=event || window.event;
    var c=this.chart, done;
    c.zoom.active=false;
    c.scroll.active=false;

    if (c.zoom.done || c.scroll.done) {}
    else
       c.canvas.oncontextmenu=null;

    if (c.zoom.done) {
      c.zoom.apply();
      if (c.onzoom) c.onzoom();
      c.draw();
      done=true;
    }
    else
    {
      done=c.scroll.done;
      if (!done) {
        done=c.series.clicked(c.oldPos);
        if (!done) done=c.tools.clicked(c.oldPos);
      }
    }

    c.zoom.old=null;

    c.zoom.done=false;
    c.scroll.done=false;

    if (done) event.preventDefault();
  }

  /*
  // IE <9 attachEvent
  if (this.canvas.addEventListener) {
    this.canvas.addEventListener("mousedown", this.domousedown, false);
    this.canvas.addEventListener("mousemove", this.domousemove, false);
    this.canvas.addEventListener("mouseup", this.domouseup, false);
  }
  else {
    if (this.canvas.attachEvent) {
      this.canvas.attachEvent("onmousedown", this.domousedown);
      this.canvas.attachEvent("onmousemove", this.domousemove);
      this.canvas.attachEvent("onmouseup", this.domouseup);
    }
  }
  */

  c.onmousedown = this.domousedown;
  c.ontouchstart = this.domousedown;

  c.onmouseup = this.domouseup;
  c.ontouchstop = this.domouseup;

  c.onmousemove = this.domousemove;
  c.ontouchmove = this.domousemove;

  /**
   * @returns {Tee.Series} Returns the series parameter
   * @param {Tee.Series} series The series object to add to chart.
   */
  this.addSeries=function(series) {
    series.setChart(series,this);

    var li=this.series.items, n=li.indexOf(series);

    if (n==-1)
       n=li.push(series)-1;

    if (series.title=="")
      series.title="Series"+(1+n).toString();

    if (series.format.fill=="")
      series.format.fill=this.palette.get(n);

    return series;
  }

  this.removeSeries=function(series) {
    var li=this.series.items, n=li.indexOf(series);
    if (li!=-1)
       li.splice(n,1);
  }

  c.chart=this;

  function newSeries(v) {
    var st=type || Tee.Bar, s=c.chart.addSeries(new st(c.chart));
    s.data.values=v;
  }

  if (data && (data.length>0)) {
    if (data[0] instanceof Array)
       for(var t=0; t<data.length; t++)
         newSeries(data[t]);
    else
       newSeries(data);
  }

  /**
   * @returns {Tee.Series} Returns the index'th series in chart series list
   * @param {Integer} index The index of the chart series list to obtain.
   */
  this.getSeries=function(index) {
    return this.series.items[index];
  }

  /**
   * Main Chart draw method. Repaints all chart contents.
   */
  this.draw=function() {
   if (this.canvas.getContext)
      this.ctx = this.canvas.getContext("2d");  // native: getBackend("2d");

   if (!this.ctx)
      throw "Canvas does not provide Context";

   this.chartRect.setFrom(this.bounds);

   this.panel.draw();
   this.panel.margins.apply(this.chartRect);

   this.title.tryDraw(true);
   this.footer.tryDraw(false);

   this.series.beforeDraw();

   if (this.legend.visible) {
     this.legend.calcrect();
     this.legend.draw();
   }
   else
     this.chartRect.width -= 30;

   if (this.axes.visible && this.series.anyUsesAxes()) {

     this.axes.each(Axis.adjustRect);
     this.axes.each(Axis.calcRect);

     if (this.walls.visible) {
        this.walls.back.bounds.setFrom(this.chartRect);
        this.walls.draw();
     }

     this.axes.each(Axis.draw);
   }

   this.series.draw();
   this.tools.draw();

   if (this.zoom.active)
       this.zoom.draw();

   if (this.onDraw) this.onDraw(this);
  }

  /**
   * Paints image parameter with a PNG or JPEG picture made from canvas.
   * @param {String} image The id of an Image HTML component.
   * @param {String} format Can be "png" or "jpg"
   * @param {Number} quality From 0% to 100%, jpeg compression quality.
   */
  this.toImage=function(image,format,quality) {
    var i=document.getElementById(image);
    if (i)
      i.src= (format!="") ? this.canvas.toDataURL(format, quality) : this.canvas.toDataURL();
  }
}

/**
 * @constructor
 * @augments Tee.Series
 * @class Base abstract class to draw data as vertical or horizontal bars
 * @property {Number} [sideMargins=100] Defines the percent of bar size to use as spacing between axes.
 * @property {Boolean} [useOrigin=true] Determines if {Tee.CustomBar#origin} value is used as bar minimum.
 * @property {Number} [origin=0] Defines the value to use as bar minimum.
 * @property {Number} [barSize=100] Defines the percent size of bars on available space.
 */
Tee.CustomBar=function(o,o2) {

  Tee.Series.call(this,o,o2);

  this.sideMargins=100;
  this.useOrigin=true;
  this.origin=0;
  this.marks.visible=true;

  this.hover.enabled=true;
  
  this.barSize=100; // %
  this.barStyle="bar"; // "ellipse"

  var f=this.format;
  f.fill="";
  f.stroke.fill="black";
  f.shadow.visible=true;
  f.round.x=4;
  f.round.y=4;
  f.gradient.visible=true;

  this.stacked="no"; // "yes", "100", "sideAll", "self"

  this.drawBar=function(r) {
    if (this.barStyle=="bar")
       f.rectPath(r.x,r.y,r.width,r.height);
    else
       f.ellipsePath(this.chart.ctx, r.x+(r.width*0.5),r.y+(r.height*0.5), 2+r.width,(2+r.height)*0.38);
  }

 /**
  * @returns {Number} Returns the number of visible Tee.CustomBar series that are displayed before this series.
  */
  this.countAll=function(upToThis) {
    var res=0, len=this.chart.series.items.length, t, s;
    for (t=0; t<len; t++) {
      s=this.chart.series.items[t];
      if ((s==this) && upToThis)
         break;
      else
      if (s.visible && (s.constructor==this.constructor))
        res+=s.data.values.length;
    }

    return res;
  }

  var offset=new Point(),originPos,bar=new Rectangle(), visibleBar={total:0, index:0};

  this.calcBarOffset=function(axisSize) {
    var barSize=axisSize;

    this.countall= (this.stacked=="sideAll") ? this.countAll(true) : 0;

    var len= 2*( (this.stacked=="sideAll") ? this.countAll()-1 : this.data.values.length-1);

    barSize /= (len+(this.sideMargins*0.01));

    if (this.stacked=="no") {
      barSize /= visibleBar.total;
      offset.x=barSize* ((visibleBar.total==1) ? -0.5 : ((visibleBar.total*0.5) - visibleBar.index -1));
    }
    else
      offset.x=-barSize*0.5;

    offset.y=barSize*this.barSize*0.01;
    offset.x+=(barSize-offset.y)*0.5;
  }

  this.draw=function() {
    var len=this.data.values.length;

    if (len>0) {
      this.initOffsets();

      var p=new Point(), tmp, c=this.chart.ctx;

      if (!this.hover.enabled) {
        f.stroke.prepare();
        f.shadow.prepare(c);
      }

      for(var t=0; t<len; t++) {
        if (this.isStacked) {
          this.calcStack(t,p,this.data.values[t]);

          var v=this.pointOrigin(t,false), a=this.mandatoryAxis;

          if (this.isStack100) {
            tmp=this.pointOrigin(t,true);
            originPos=(tmp==0) ? a.endPos : a.calc(v*100.0/tmp);
          }
          else
            originPos=a.calc(v);
        }
        else
        {
          this.calc(t,p);

          if (this.stacked=="sideAll") {
            tmp=this.notmandatory.calc(this.countall+t);
            if (this.yMandatory)
               p.x=tmp;
            else
               p.y=tmp;
          }
        }

        this.calcBarBounds(p,bar,offset,originPos);

        this.drawBar(bar);

        var ff=(this.hover.enabled && (this.over==t)) ? this.hover : f;

        c.fillStyle=this.getFillStyle(bar, this.isColorEach ? this.getFill(t) : ff.fill);

        if (this.hover.enabled)
          ff.shadow.prepare(c);

        c.fill();

        if (ff.stroke.fill!="") {

          if (this.hover.enabled)
             ff.stroke.prepare();

          c.shadowColor = "transparent";
          c.stroke();

          if (ff.shadow.visible)
             c.shadowColor = ff.shadow.color;
        }

      }
    }
  }

  this.calcColorEach=function() {
    this.chart.series.visibleCount(this,Tee.CustomBar,visibleBar);
    this.isColorEach=(this.colorEach=="yes") || ((this.colorEach=="auto") && (visibleBar.total==1));
  }

  this.initOffsets=function() {
    var nomand = this.notmandatory, mand = this.mandatoryAxis,
        range=this.yMandatory ? this.maxXValue()-this.minXValue() : this.maxYValue()-this.minYValue();

    this.calcBarOffset(nomand.calcSize(range));

    originPos = this.useOrigin ? mand.calc(this.origin) : mand.inverted ? mand.startPos : mand.endPos;

    this.isStacked=(this.stacked!="no") && (this.stacked!="sideAll");
    this.isStack100=this.stacked=="100";
  }

 /**
  * @returns {Number} Returns the index of series bar that contains {@link Tee.Point} p parameter.
  */
  this.clicked=function(p) {

    this.initOffsets();

    var p2=new Point(), len=this.data.values.length, t;
    for(t=0; t<len; t++) {
        this.calc(t,p2);
        this.calcBarBounds(p2,bar,offset,originPos);

        if (bar.contains(p))
           return t;
    }

    return -1;
  }

  this.drawMarks=function() {
    var v=this.data.values, len=v.length, m=this.marks;

    if (len>0) {
      var p=new Point(), mand=this.mandatoryAxis, ox,oy, op=offset.x+(offset.y*0.5);

      if (this.yMandatory) {
        ox=op;
        oy=0;
      }
      else
      {
        ox=0;
        oy=op;
      }

      for(var t=0; t<len; t+=m.drawEvery) {
        this.calc(t,p);

        if (this.stacked=="sideAll") {
          var tmp=this.notmandatory.calc(this.countall+t);
          (this.yMandatory) ? p.x=tmp : p.y=tmp;
        }

        var inv=(this.useOrigin && (v[t] < this.origin));
        if (mand.inverted) inv=!inv;

        m.drawMark(p.x+ox, p.y+oy, t, inv);
      }
    }
  }

}

Tee.CustomBar.prototype=new Tee.Series;
Tee.CustomBar.prototype.parent=Tee.Series.prototype;
Tee.CustomBar.constructor=Tee.CustomBar;

/**
 * @constructor
 * @augments Tee.CustomBar
 * @class Draws data as vertical bars
 */
Tee.Bar=function(o,o2) {

  Tee.CustomBar.call(this,o,o2);

  this.calc=function(index,p) {
    (this.isStacked) ? this.calcStack(index,p,this.data.values[index]) : this.parent.calc.call(this,index,p);
  }

  this.vertMargins=function(p) {
    var m=this.marks;

    if (m.visible) {
       p.y=(m.arrow.length+m.format.textHeight("Wj"));

       if (this.minYValue()<this.origin)
         p.x=p.y;
    }
  }

  this.minXValue=function() {
    return this.parent.minXValue.call(this)-(this.sideMargins*0.005);
  }

  this.maxXValue=function() {
    var res=(this.stacked=="sideAll") ? this.countAll()-1 : this.parent.maxXValue.call(this);
    return res+ (this.sideMargins*0.005);
  }

  this.minYValue=function() {
    return Math.min(this.origin, this.parent.minYValue.call(this));
  }

  this.maxYValue=function() {
    return this.stackMaxValue();
  }

  this.calcBarBounds=function(p,bar,offset,originPos) {
    bar.x=p.x+offset.x;
    bar.width=offset.y;

    if (this._vertAxis.inverted)
    {
      bar.y=originPos;
      bar.height=p.y-bar.y;
    }
    else
    {
      bar.y=p.y;
      bar.height=originPos-p.y;
    }

    if (bar.height<0) {
      bar.y+=bar.height;
      bar.height=-bar.height;
    }
  }
}

Tee.Bar.prototype=new Tee.CustomBar;
Tee.Bar.prototype.parent=Tee.CustomBar.prototype;

/**
 * @constructor
 * @augments Tee.CustomBar
 * @class Draws data as horizontal bars
 */
Tee.HorizBar=function(o,o2) {

  Tee.CustomBar.call(this,o,o2);

  this.yMandatory=false;
  this.format.gradient.direction="rightleft";

 /**
  * @returns {Number} Returns the maximum width in pixels of series marks texts.
  */
  this.maxMarkWidth=function() {
    var res=0, f, l, n;

    if (this.marks.visible) {

     f=this.marks.format;
     f.font.prepare();

     l=this.count();
     while(l--) {
       n=f.textWidth(this.markText(l));
       if (n>res) res=n;
     }
    }
    return res;
  }

  this.horizMargins=function(p) {
    if (this.marks.visible) {
       var v=(this.marks.arrow.length+this.maxMarkWidth());

//       if (this.maxXValue()>=this.origin)
         p.y=v;

       if (this.minXValue()<this.origin)
         p.x=v;
    }
  }

  this.minYValue=function() {
    var res=this.parent.minXValue.call(this);
    return res-(this.sideMargins*0.005);
  }

  this.maxYValue=function() {
    var res=(this.stacked=="sideAll") ? this.countAll()-1 : this.parent.maxXValue.call(this);
    return res+(this.sideMargins*0.005);
  }

  this.minXValue=function() {
    return Math.min(this.origin, this.parent.minYValue.call(this));
  }

  this.maxXValue=function() {
    return this.stackMaxValue();
  }

  this.calcBarBounds=function(p,bar,offset,originPos) {
    bar.y=p.y+offset.x;
    bar.height=offset.y;

    if (this._horizAxis.inverted)
    {
      bar.x=p.x;
      bar.width=originPos-p.x;
    }
    else
    {
      bar.x=originPos;
      bar.width=p.x-bar.x;
    }

    if (bar.width<0) {
      bar.x+=bar.width;
      bar.width=-bar.width;
    }
  }
}

Tee.HorizBar.prototype=new Tee.CustomBar;
Tee.HorizBar.prototype.parent=Tee.CustomBar.prototype;

/**
 * @constructor
 * @augments Tee.Series
 * @class Base abstract class for line, area, scatter plots
 * @property {Tee.CustomSeries-Pointer} pointer Paints a visual representation at each point position.
 * @property {String} stacked Defines if multiple series are displayed one on top of each other.
 * @property {Number} smooth Draws lines between points as diagonals (value 0) or smooth curves (value > 0 < 1).
 */
Tee.CustomSeries=function(o,o2) {
  Tee.Series.call(this,o,o2);

  this.stacked="no"; // "yes", "100"
  this.stairs=false;

  this.hover.enabled=true;
  
  /*
   * @private
   */
  this.isStacked=false;
  this.isStack100=false;

  this.smooth=0;

  /**
   * @constructor
   * @public
   * @class Formatting properties to draw symbols at series data positions
   * @property {Number} [width=12] The horizontal size in pixels
   * @property {Number} [height=12] The vertical size in pixels
   * @property {Tee.Format} format Visual properties to paint pointers.
   * @property {Boolean} [colorEach=false] Determines if pointers will be filled using a different color

   * for each point in series.
   */
  function Pointer(chart) {

    /*
     * @private
     */
    this.setChart=function(chart) {
      this.chart=chart;
      this.format.setChart(chart);
    }

    this.chart=chart;

    /*
     * Visual properties to paint pointers
     */
    var f=this.format=new Tee.Format(chart);

    f.shadow.visible=false;
    f.fill="";
    f.gradient.colors=["white","white","white"];
    f.shadow.visible=true;

    /*
     * Determines if pointers will be displayed.
     */
    this.visible=false;

    this.colorEach=false;

    /*
     * Visual style of pointer ("rectangle", "ellipse", "triangle", "diamond", "downtriangle", "cross", "x").
     */
    this.style="rectangle";

    this.width=12;
    this.height=12;

    this.draw=function(p,index,f,fill) {
      var c=this.chart.ctx;

      if (this.transform) {
        c.save();
        this.transform(p.x,p.y,index);
      }

      var w=this.width*0.5, h=this.height*0.5;

      if (this.style=="rectangle")
        f.rectangle(p.x-w,p.y-h,this.width,this.height);
      else
      if (this.style=="ellipse")
        f.ellipse(p.x,p.y,this.width,this.height);
      else
      if (this.style=="triangle")
        f.polygon([new Point(p.x,p.y-h),
                             new Point(p.x-w,p.y+h),
                             new Point(p.x+w,p.y+h)]);
      else
      if (this.style=="downtriangle")
        f.polygon([new Point(p.x,p.y+h),
                             new Point(p.x-w,p.y-h),
                             new Point(p.x+w,p.y-h)]);
      else
      if (this.style=="diamond")
        f.polygon([new Point(p.x,p.y-h),
                             new Point(p.x-w,p.y),
                             new Point(p.x,p.y+h),
                             new Point(p.x+w,p.y)]);
      else
      {
        c.beginPath();

        if (this.style=="cross") {
          c.moveTo(p.x-w,p.y);
          c.lineTo(p.x+w,p.y);
          c.moveTo(p.x,p.y-h);
          c.lineTo(p.x,p.y+h);
        }
        if (this.style=="x") {
          c.moveTo(p.x-w,p.y-h);
          c.lineTo(p.x+w,p.y+h);
          c.moveTo(p.x-w,p.y+h);
          c.lineTo(p.x+w,p.y-h);
        }

        f.stroke.prepare(fill);
        c.stroke();
      }

      if (this.transform)
        c.restore();
    }
  }

  /*
   * Visual indication at series point positions.
   */
  this.pointer=new Pointer(this.chart);

  this.maxYValue=function() {
    return this.stackMaxValue();
  }

  this.calc=function(index,p) {
    (this.isStacked) ? this.calcStack(index,p,this.data.values[index]) : Tee.Series.prototype.calc.call(this,index,p);
  }

  this.calcColorEach=function() {
    this.isColorEach=(this.colorEach=="yes") || this.pointer.colorEach;
  }
}

Tee.CustomSeries.prototype=new Tee.Series;

Tee.CustomSeries.prototype.drawPointers=function() {
  var len=this.data.values.length, old,
      f=this.pointer.format,
      isEach=(this.colorEach=="yes") || this.pointer.colorEach;

  if (isEach)
    old=f.fill;
  else
    if (f.fill=="")
       f.fill=this.format.fill;

  var p=new Point(), g=f.gradient, t, fill=f.fill;

  for(t=0; t<len; t++) {
    this.calc(t,p);

    if (isEach) {
      fill=this.getFill(t);
      (g.visible) ? g.setEndColor(fill) : f.fill=fill;
    }

    this.getSize(t);
    this.pointer.draw(p,t,f,fill);

    if (this.hover.enabled && (this.over==t))
      this.pointer.draw(p,t,this.hover,fill);
  }

  if (isEach)
    f.fill=old;
}

/**
 * @private
 */
Tee.CustomSeries.prototype.setChart=function(series,chart) {
    var tmp=Tee.Series.prototype.setChart;
    tmp(series,chart);
    series.pointer.setChart(chart);
}

 /**
  * @returns {Number} Returns the index of the series point that contains p {@link Tee.Point} parameter.
  */
Tee.CustomSeries.prototype.clicked=function(p) {
  if (this.pointer.visible) {
    var len=this.data.values.length, r=new Rectangle(), t,
        po=this.pointer;

    for(t=0; t<len; t++) {
      this.calc(t,r);
      this.getSize(t);
      r.x-=po.width*0.5;
      r.width=po.width;
      r.y-=po.height*0.5;
      r.height=po.height;

      if (r.contains(p)) return t;
    }
  }

  return -1;
}

Tee.CustomSeries.prototype.horizMargins=function(p) {
  var po=this.pointer, s=po.format.stroke;
  if (po.visible)
    p.x=p.y=( (s.fill!="") ? s.size : 0 ) + 1+(po.width*0.5);
}

Tee.CustomSeries.prototype.vertMargins=function(p) {
  var po=this.pointer, s=po.format.stroke;
  if (po.visible)
    p.x=p.y=( (s.fill!="") ? s.size : 0 ) + 1+(po.height*0.5);
}

Tee.CustomSeries.prototype.getSize=function(index) {}

/**
 * @constructor
 * @augments Tee.CustomSeries
 * @class Draws series data as a contiguous polyline between points
 * @property {Boolean} [stairs=false] Determines if lines between points are direct (diagonals) or as stairs (horizontal and vertical).
 */
Tee.Line=function(o,o2) {

  Tee.CustomSeries.call(this,o,o2);

  this.drawLine=true;
  this.hover.enabled=false;

  var f=this.format;
  f.shadow.visible=true;
  f.shadow.blur=10;
  f.lineCap="round";

  this.doDrawLine=function(c) {
    this.isStacked=this.stacked!="no";
    this.isStack100=this.stacked=="100";

    var p=new Point(), oldX, len=this.data.values.length, t, smop, s,
        begin=0,end=len;

    if ((!this.smooth) && (!this.data.x)) {
      begin=Math.max(0,trunc(this.notmandatory.minimum)-1);
      end=Math.min(len,trunc(this.notmandatory.maximum)+2);
    }

    c.beginPath();

    if (this.smooth>0) {
      smop=new Array(2*len);

      for(t=0; t<len; t++) {
        this.calc(t,p);

        smop[2*t]=p.x;
        smop[2*t+1]=p.y;
      }

      drawSpline(c, smop, this.smooth, true);

    }
    else
    for(t=begin; t<end; t++) {
      this.calc(t,p);

      if (t==begin)
         c.moveTo(p.x,p.y);
      else
      if (this.stairs) {
         c.lineTo(oldX,p.y);
         c.lineTo(p.x,p.y);
      }
      else
         c.lineTo(p.x,p.y);

      oldX=p.x;
    }


    var st=f.stroke;

    // Chrome bug with shadow and stroke size == 1
    if (this.chart.isChrome && f.shadow.visible)
       st.size=Math.max(1.1,st.size);

    s=st.fill;
    st.prepare( (s=="") ? f.fill : s);
    f.shadow.prepare(c);

    c.stroke();
  }

  this.draw=function() {
    var len=this.data.values.length;

    if (len>0) {
      if (this.drawLine)
         this.doDrawLine(this.chart.ctx);

      if (this.pointer.visible)
         this.drawPointers();
    }
  }
}

Tee.Line.prototype=new Tee.CustomSeries;

/**
 * @constructor
 * @augments Tee.Line
 * @class Draws series data as points at vertical and horizontal axes positions
 */
Tee.PointXY=function(o,o2) {
  Tee.Line.call(this,o,o2);
  this.hover.enabled=true;
  this.pointer.visible=true;
  this.drawLine=false;
}

Tee.PointXY.prototype=new Tee.Line;

/**
 * @constructor
 * @augments Tee.Series
 * @class Draws series data as slices of a circle
 * @property {Number} [rotation=0] Rotates all slices by specified degree from 0 to 360.
 * @property {Number[]} explode Determines percent of separation from each slice to pie center.
 */
Tee.Pie=function(o,o2) {
  Tee.Series.call(this,o,o2);

  this.marks.style="percent";

  this.donut=0;
  this.rotation=0;
  this.colorEach="yes";
  this.useAxes=false;

  var f=this.format;
  f.stroke.fill="black";
  f.shadow.visible=true;
  f.gradient.visible=true;
  f.gradient.direction="radial";
  f.gradient.colors=["white","white","white"];

  this.hover.enabled=true;

  this.sort="values";
  this.orderAscending=false;

  this.explode=null;

  this.marks.visible=true;

  this.concentric=false;

 /**
  * @returns {Number} Returns the index'th pie slice value.
  */
  this.getValue=function(index) {
    return this.data.values[index];
  }

  this.calcCenter=function(t,radius,mid,center) {
    if (this.explode) {
      var v=this.explode[t];
      if (v) {
        v=radius*v*0.01;
        center.x+=(v*Math.cos(mid));
        center.y+=(v*Math.sin(mid));
      }
    }
  }

  this.clicked=function(p) {
    var c=this.chart.ctx, len=this.data.values.length, t, index;

    endAngle=angle=Math.PI*this.rotation/180.0;

    for (t=0; t<len; t++) {
      index = sorted ? sorted[t] : t;
      this.slice(c,index);

      if (c.isPointInPath(p.x,p.y))
        return index;
    }

    return -1;
  }

  var total, piex, piey, radius, donutRadius,
      center={x:0,y:0}, sorted, angle, endAngle, hoverang;

  function calcPos(angle,p) {
    p.x=center.x+Math.cos(angle)*donutRadius;
    p.y=center.y+Math.sin(angle)*donutRadius;
  }

  this.slice=function(c,index) {
    var p=new Point();

    endAngle+=Math.PI*2*( this.data.values[index] /total);

    center.x=piex;
    center.y=piey;
    this.calcCenter(index,radius,(angle+endAngle)*0.5,center);

    if (this.donut==0) {
       p.x=center.x;
       p.y=center.y;
    }
    else
       calcPos(angle,p);

    c.beginPath();
    c.moveTo(p.x,p.y);
    c.arc(center.x,center.y,radius,angle,endAngle,false);

    if (this.donut!=0)
       calcPos(endAngle,p);

    c.lineTo(p.x,p.y);

    if (this.donut!=0)
      c.arc(center.x,center.y,donutRadius,endAngle,angle,true);

    c.closePath();

    if (index==this.over)
      hoverang=angle;

    angle=endAngle;
  }

  this.fill=function(i) {
    return this.getFillStyle(this.chart.chartRect,this.getFill(i));
  }

  this.slices=function(shadow) {
    var c=this.chart.ctx, len=this.data.values.length, t, index;

    endAngle=angle=Math.PI*this.rotation/180.0;

    for(t=0; t<len; t++) {

      index = sorted ? sorted[t] : t;

      this.slice(c,index);

      if (shadow)
         f.shadow.prepare(c);
      else
         c.fillStyle=this.fill(index);

      c.fill();

      if (!shadow) {
         var st=f.stroke;

         if (st.fill!="") {
           st.prepare();
           c.stroke();
         }
      }
    }
  }

  this.draw=function() {
    var len=this.data.values.length;

    if (len>0) {

      var h=0, m=this.marks;

      if (f.shadow.visible)
         h+=2*f.shadow.height;

      if (m.visible) {
        m.format.font.prepare();
        h+=m.format.textHeight("Wj")+m.arrow.length*0.5;
      }

      var r=new Rectangle(), visiblePie={total:0, index:-1};
      r.setFrom(this.chart.chartRect);
      this.chart.series.visibleCount(this,Tee.Pie,visiblePie);

      if ((!this.concentric) && (visiblePie.total>1)) {
        var cols=Math.round(Math.sqrt(visiblePie.total)), rows=Math.round(visiblePie.total/cols);

        r.width/=cols;
        r.x+=(visiblePie.index % cols)*r.width;

        r.height/=rows;
        r.y+=trunc(visiblePie.index/cols)*r.height;
      }

      piex=r.x+(r.width*0.5);
      piey=r.y+(r.height*0.5);

      radius=r.width*0.5;
      var r2=(r.height-2*h)*0.5;

      if (r2<radius) radius=r2;

      donutRadius=radius*this.donut*0.01;

      total=ArraySumAbs(this.data.values);

      sorted=this.doSort(this.sort, this.orderAscending);

      this.slices(true);
      this.slices(false);

      if (this.hover.enabled && (this.over!=-1)) {
        var st=this.hover;
        if (st.stroke.fill!="") {
          endAngle=angle=hoverang;

          var c=this.chart.ctx;
          this.slice(c,this.over);
          c.fillStyle=this.fill(this.over);
          st.draw(c,null,r.x,r.y,r.width,r.height);
        }
      }
    }
  }

  this.drawMarks=function() {
    var endAngle=angle=Math.PI*this.rotation/180.0, mid,
        v=this.data.values, len=v.length, index, t;

    for(t=0; t<len; t+=this.marks.drawEvery) {

      index= sorted ? sorted[t] : t;

      endAngle+=Math.PI*2*(v[index] /total);
      mid=(angle+endAngle)*0.5;
      center.x=piex;
      center.y=piey;
      this.calcCenter(t,radius,mid,center);
      this.marks.drawPolar(center, radius, mid , index);
      angle=endAngle;
    }
  }
}

Tee.Pie.prototype=new Tee.Series;

/**
 * @constructor
 * @augments Tee.CustomSeries
 * @class Draws series data as filled mountain segments between points
 * @property {Boolean} [useOrigin=false] Determines if {Tee.Area#origin} value is used as area minimum.
 * @property {Number} [origin=0] Defines the value to use as area minimum.
 */
Tee.Area=function(o,o2) {

  Tee.CustomSeries.call(this,o,o2);

  this.useOrigin=false;
  this.origin=0;

  var f=this.format;
  f.shadow.visible=true;
  f.lineCap="round";
  f.stroke.fill="black";
  f.fill="";

  var r=new Rectangle();

  this.draw=function() {
    var len=this.data.values.length;

    if (len>0) {
      var a=this.mandatoryAxis, nm=this.notmandatory, originPos, isY=this.yMandatory;

      if (this.useOrigin)
        originPos=a.calc(this.origin);
      else
      if ((isY && a.inverted) || ((!isY) && (!a.inverted)))
        originPos=a.startPos;
      else
        originPos=a.endPos;

      this.isStacked=this.stacked!="no";
      this.isStack100=this.stacked=="100";

      var start, p=new Point(), old, t, c=this.chart.ctx, smop,
          doStack=this.isStacked, // && (visibleBar.index>0),
          begin=0,end=len;

      if ((!this.smooth) && (!this.data.x)) {
        begin=Math.max(0,trunc(nm.minimum)-1);
        end=Math.min(len,trunc(nm.maximum)+2);
      }

      c.beginPath();

      if (this.smooth>0) {
        smop=new Array(2*len);

        for(t=0; t<len; t++) {
          this.calc(t,p);

          smop[2*t]=p.x;
          smop[2*t+1]=p.y;
        }

        start= isY ? smop[0] : smop[1];
        drawSpline(c, smop, this.smooth, true);

        if (doStack) {
          var tmp=0;

          for (t=len-1; t>=0; t--) {
            this.calcStack(t,p,0);
            smop[tmp++]=p.x;
            smop[tmp++]=p.y;
          }

          c.lineTo(smop[0], smop[1]);

          drawSpline(c, smop, this.smooth, false);
        }
      }
      else
      {
        this.calc(begin,p);
        c.moveTo(p.x,p.y);
        start= isY ? p.x : p.y;
        old=isY ? p.y : p.x;

        if (this.stairs)
          for(t=begin+1; t<end; t++) {
            this.calc(t,p);
            c.lineTo(p.x,old);
            c.lineTo(p.x,p.y);
            old=isY ? p.y : p.x;
          }
        else
          for(t=begin+1; t<end; t++) {
            this.calc(t,p);
            c.lineTo(p.x,p.y);
          }
      }

      if (doStack) {
        if (this.smooth==0)
          for (t=end-1; t>=begin; t--) {
            this.calcStack(t,p,0);
            if (this.stairs) {
              c.lineTo(p.x,old);
              c.lineTo(p.x,p.y);
              old=isY ? p.y : p.x;
            }
            else
              c.lineTo(p.x,p.y);
          }
      }
      else
      {
        if (isY) {
          c.lineTo(p.x,originPos);
          c.lineTo(start,originPos);
        }
        else
        {
          c.lineTo(originPos,p.y);
          c.lineTo(originPos,start);
        }
      }

      c.closePath();

      var g=f.gradient;
      if (g.visible)
        g.colors[g.colors.length-1]=f.fill;

      this.bounds(r);
      f.draw(c,null,r.x,r.y,r.width,r.height);

      if (this.pointer.visible)
         this.drawPointers();
    }
  }

  this.minYValue=function() {
    var v=this.yMandatory ? Tee.Series.prototype.minYValue.call(this) : Tee.Series.prototype.minXValue.call(this);
    return this.yMandatory ? this.useOrigin ? Math.min(v,this.origin) : v : v;
  }

  this.minXValue=function() {
    var v=this.yMandatory ? Tee.Series.prototype.minXValue.call(this) : Tee.Series.prototype.minYValue.call(this);
    return this.yMandatory ? v : this.useOrigin ? Math.min(v,this.origin) : v;
  }

  this.maxYValue=function() {
    return this.yMandatory ? this.stackMaxValue() : Tee.Series.prototype.maxXValue.call(this);
  }

  this.maxXValue=function() {
    return this.yMandatory ? Tee.Series.prototype.maxXValue.call(this) : this.stackMaxValue();
  }
}

Tee.Area.prototype=new Tee.CustomSeries;

/**
 * @constructor
 * @augments Tee.Area
 * @class Horizontal area style
 */
Tee.HorizArea=function(o,o2) {
  Tee.Area.call(this,o,o2);
  this.yMandatory=false;
}
Tee.HorizArea.prototype=new Tee.Area;

/**
 * @constructor
 * @augments Tee.Pie
 * @class Draws series data as slices of a circle, with a center hole
 * @property {Number} [donut=50] Percent of hole size relative to pie radius. From 0 to 100.
 */
Tee.Donut=function(o,o2) {
  Tee.Pie.call(this,o,o2);
  this.donut=50;
}

Tee.Donut.prototype=new Tee.Pie;

/**
 * @constructor
 * @augments Tee.PointXY
 * @class Draws data as points, each one with a different size or radius
 * @property {Object} data Contains each bubble x, value and radius.
 * @property {Number[]} data.radius Defines each bubble radius value.
 */
Tee.Bubble=function(o,o2) {
  Tee.PointXY.call(this,o,o2);
  var p=this.pointer;
  p.colorEach=true;
  p.style="ellipse";
  p.format.gradient.visible=true;
  p.format.gradient.direction="radial";
}

Tee.Bubble.prototype=new Tee.PointXY;

Tee.Bubble.prototype.getSize=function(index) {
  var s=(this.data.radius) ? this._vertAxis.calcSize(this.data.radius[index]) : 0;
  this.pointer.width=s;
  this.pointer.height=s;
}

Tee.Bubble.prototype.horizMargins=function(p) {

  this.calcWidth=function(index) {
    this.getSize(index);
    var res=1+(this.pointer.width*0.5), s=this.pointer.format.stroke;
    if (s.fill!="") res+=s.size;
    return res;
  }

  if (this.pointer.visible) {
    p.x=this.calcWidth(0);
    p.y=this.calcWidth(this.count()-1);
  }
}

Tee.Bubble.prototype.vertMargins=function(p) {

  this.calcHeight=function(index) {
    this.getSize(index);
    var res=1+(this.pointer.height*0.5), s=this.pointer.format.stroke;
    if (s.fill!="") res+=s.size;
    return res;
  }

  if (this.pointer.visible) {
    p.x=this.calcHeight(0);
    p.y=this.calcHeight(this.count()-1);
  }
}

/**
 * @constructor
 * @augments Tee.PointXY
 * @class Draws financial OHLC data as Candle or CandleBar points.
 * @property {String} style Defines candle style ("candle", "bar", "openclose").
 */
Tee.Candle=function(o,o2) {
  Tee.PointXY.call(this,o,o2);

  this.pointer.width=7;
  this.pointer.format.stroke.visible=false;

  this.higher=this.pointer.format;
  this.higher.fill="green";
  this.lower=new Tee.Format(this.chart);
  this.lower.fill="red";
  this.lower.stroke.visible=false;

  this.style="candle";
  
  /*
   * @private
   */
  this.setChart=function(series,chart) {
    var tmp=Tee.PointXY.prototype.setChart;
    tmp(series,chart);
    this.lower.setChart(chart);
  }

  this.draw=function() {
    var d=this.data, len=d.values.length, t, p=new Point(),
      po=this.pointer, w=po.width*0.5, o,h,l, m=this.mandatoryAxis, y, he,
      c=this.chart.ctx, col, x;

    for (t=0; t<len; t++) {
      this.calc(t,p);
      x=p.x;
      o=m.calc(d.open[t]);
      h=m.calc(d.high[t]);
      l=m.calc(d.low[t]);

      if (p.y>o) {
        y=o;
        he=p.y-o;
        col=this.lower;
      }
      else {
        y=p.y;
        he=o-y;
        col=this.higher;
      }

      if (this.style=="bar") {
        c.beginPath();

        c.moveTo(x,h);
        c.lineTo(x,l);
        c.moveTo(x-w,o);
        c.lineTo(x,o);
        c.moveTo(x,p.y);
        c.lineTo(x+w,p.y);

        col.stroke.prepare(col.fill);

        c.stroke();
      }
      else
      {
        if (this.hover.enabled && (this.over==t))
          this.hover.rectangle(x-w,y,po.width,he);
        else
          col.rectangle(x-w,y,po.width,he);
      }

      if (this.style!="openclose")
      if ((h<y) || (l>(y+he))) {
        c.beginPath();

        c.moveTo(x,y);
        c.lineTo(x,h);

        c.moveTo(x,y+he);
        c.lineTo(x,l);

        if (this.hover.enabled && (this.over==t))
          this.hover.stroke.prepare(col.fill);
        else
          col.stroke.prepare(col.fill);

        c.stroke();
      }
    }
  }

  this.minYValue=function() {
    return this.data.low.length>0 ? ArrayMin(this.data.low) : 0;
  }

  this.maxYValue=function() {
    return this.data.high.length>0 ? ArrayMax(this.data.high) : 0;
  }

  this.addRandom=function(count) {
    var d=this.data;
    d.values.length=count;
    d.close=d.values;
    if (d.open) d.open.length=count; else d.open=new Array(count);
    if (d.high) d.high.length=count; else d.high=new Array(count);
    if (d.low) d.low.length=count; else d.low=new Array(count);

    if (count>0) {
      var tmp=25+Math.random()*1000, o;

      for (var t=0; t<count; t++) {
        o=d.open[t]=tmp;
        tmp=d.close[t]=tmp+(Math.random()*50)-25;
        d.high[t]=Math.max(o,tmp)+Math.random()*10;
        d.low[t]=Math.min(o,tmp)-Math.random()*10;
      }
    }
  }
}

Tee.Candle.prototype=new Tee.PointXY;

Tee.Candle.prototype.clicked=function(p) {
  var w=this.pointer.width, m=this.mandatoryAxis, n=this.notmandatory,
      d=this.data, len=d.values.length, r=new Rectangle(), t, o,c;

  r.width=w;

  for(t=0; t<len; t++) {
    r.x=n.calc(t)-w*0.5;

    o=m.calc(d.open[t]), c=m.calc(d.close[t]);
    r.y=(o>c) ? c : o;
    r.height=Math.abs(o-c);

    if (r.contains(p)) return t;
  }

  return -1;
}

Tee.Candle.prototype.vertMargins=function(p) {}

})(exports);


