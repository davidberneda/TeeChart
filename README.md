
TeeChart Javascript charting, module for Node.js and jQuery plugin.

Steema Software https://www.steema.com
=====================================

Charting module using TeeChart for JavaScript.
Free for non-commercial use. See license.txt.
 
For TeeChart Javascript demos, documentation, support:

https://www.steema.com/product/html5

Node.js Dependencies:
---------------------

To create and render a chart picture at server-side,
an HTML5 <canvas> node library is required.

TeeChart has been tested on Linux using node.js and
node-canvas module.


Installation:
-------------

-Install node.js:
 https://nodejs.org

-Install node-canvas module:
 https://github.com/LearnBoost/node-canvas

Or:

npm install teechart

Running included example:
-------------------------

# node main.js

This small javascript code will accept requests via web to
return an image/png sample chart:

http://127.0.0.1:4242


Notes:
------

The important bits of code are:

1) Using TeeChart and node-canvas modules:

  var tee=require('./lib/teechart.js'),

      Canvas=require('./node-canvas/lib/canvas.js');

2) Creating a Tee.Chart, passing the canvas:

  var canvas = new Canvas(500,300),

      chart = new tee.Tee.Chart(canvas);

3) Manually specifying chart size (this step should not
   be mandatory in future releases) :

     chart.bounds.set(0,0,500,300);

4) Add chart series, data, change formatting, etc, and DRAW:

  chart.title.text="Node.js and TeeChart";

  chart.addSeries(new tee.Tee.Bar([5,3,7,1,2]));

  chart.draw();

5) Return the chart as image, or save it to a file, etc
   (Check node-canvas documentation for more options)

  res.writeHead(200, {'Content-Type': 'text/html'});

  res.end("<html><body><img src='"+canvas.toDataURL()+"'/></body></html>");



=======
