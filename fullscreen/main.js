// Classes
class Vector2 {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  static fromMouse () { return new Vector2(mouseX, mouseY); }

  copy () { return new Vector2(this.x, this.y); }

  scaleFromScreen () {
    this.x /= canvas.w;
    this.y /= canvas.h;

    return this;
  }

  scaleToScreen () {
    this.x *= canvas.w;
    this.y *= canvas.h;

    return this;
  }

  equals (other) {
    if (other instanceof Vector2) {
      return this.x === other.x && this.y === other.y;
    } else console.error(`Bad type.`);
  }
  
}

class Point {
  constructor (pos) {
    this.pos = pos;
  }

  copy () { return new Point(this.pos); }

  draw () {
    const screenPos = this.pos.copy().scaleToScreen();
    
    noFill(); stroke(colors.black); strokeWeight(5);
    point(screenPos.x, screenPos.y);
  }

  equals (other) {
    if (other instanceof Point) {
      return this.pos.equals(other.pos);
    } else console.error(`Bad type.`);
  }
}

// Globals
let canvas = {
  e: null, // Canvas element

  w: null, // Canvas width
  h: null, // Canvas height
};

let colors = {};

let points = [];
let wrapPoints = [];

// p5 Functions
function setup () {
  // Canvas
  canvas.e = createCanvas();
  canvas.e.parent(`container`);
  windowResized();

  // Variables
  colors = {
    black: color(0),
    gray: color(128),
    white: color(255),

    green: color(0, 255, 0),
    blue: color(0, 0, 255),
    red: color(255, 0, 0),
  }
}

function draw () {
  // Clearing
  background(colors.white);

  // Drawing
  for (let p of points) p.draw();

  // Draw Wrap
  if (wrapPoints.length > 1) {
    stroke(colors.black); strokeWeight(1);

    const tp = wrapPoints.map(x => x.copy().scaleToScreen());
    
    for (let i = 1; i < wrapPoints.length; i ++) {
      const last = tp[i - 1];
      const now = tp[i];

      line(last.x, last.y, now.x, now.y);
    }

    line(tp.last().x, tp.last().y, tp[0].x, tp[0].y);
  }
}

function windowResized () {
  const size = { w: window.innerWidth, h: window.innerHeight };

  canvas.w = size.w;
  canvas.h = size.h;

  resizeCanvas(size.w, size.h);
}

function mousePressed () {
  const pos = Vector2.fromMouse().scaleFromScreen();

  points.push(new Point(pos));

  giftWrap();
}

// Functions
function giftWrap () {
  let wrap = [];

  let tempPoints = points
    .map(point => point.pos)
    .sort((a, b) => a.x - b.x);
  let pointOnHull = tempPoints[0];

  let i = 0;
  
  while (true) {
    wrap[i] = pointOnHull.copy();
    let endpoint = tempPoints[0].copy();
    for (let j = 1; j < tempPoints.length; j ++) {
      if (endpoint.equals(pointOnHull) || isLeft(wrap[i], endpoint, tempPoints[j])) {
        endpoint = tempPoints[j].copy();
      }
    }

    i += 1;
    pointOnHull = endpoint.copy();

    if (endpoint.equals(wrap[0])) break;
  }

  wrapPoints = wrap;
}

// Returns whether or not a given Vector2 is to the left of a given line.
function isLeft (l1, l2, p) {
  return ( (l2.x - l1.x) * (p.y - l1.y) - (l2.y - l1.y) * (p.x - l1.x) ) > 0;
}

// Prototypes
Array.prototype.last = function () {
  return this[this.length - 1];
}