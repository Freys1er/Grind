function setup() {
  createCanvas(windowWidth, windowHeight);
  colors = [
    '#1E3A5F', // Military
    '#D32F2F', // Democracy
    '#1976D2', // Information
    '#388E3C', // Administration 
    '#FBC02D', // Economy
    '#7B1FA2'  // Social
  ];
}

let colors = [];
let branch = [];
let branches = ["Military", "Democracy", "Information", "Administration", "Economy", "Social"];
let t = 0;
let x = 0;
let hold = 0;
function draw() {
  if (x < 100) {
    x++;
    t = animate(x, 0, 100, -100, 50)
    home();
  } else if (branch.length === 0) {
    home();
  }

  if (mouseIsPressed) {
    hold++;
  } else {
    hold = 0;
  }
}
function safeReplace(newDir) {
  // Get the current URL using window.location.href
  let url = window.location.href;

  // Use URL constructor to parse the URL
  let parsedURL = new URL(url);

  // Get the base URL (protocol + hostname)
  let baseURL = parsedURL.protocol + '//' + parsedURL.hostname;

  // Check if the URL ends with '/Hive'
  let path = parsedURL.pathname;
  if (path.endsWith('/Hive')) {
      // Keep only the '/Hive' directory
      baseURL += '/Hive';
  }

  // Add the new directory
  let newUrl = baseURL + '/' + newDir + "/";

  console.log(url, newUrl);

  if (url !== newUrl) {
      window.location.replace(newUrl);
  }
}
function animate(x, a, b, c, d) {
  // Ensure p5.js functions are properly referenced
  let minVal = Math.min(a, b);
  let maxVal = Math.max(a, b);
  let constrainedX = constrain(x, minVal, maxVal);
  let t = map(constrainedX, a, b, 0, 1);

  // Apply the atan function for a smooth transition
  let smoothT = (Math.atan((t - 0.5) * 20) / Math.PI) + 0.5;

  // Map the smoothT value to the desired output range [c, d]

  return map(smoothT, 0, 1, c, d);
}
let frame = 0;
let d = [0, 0];
function home() {
  background(0);
  push();
  translate(width / 2, height / 2);
  stroke(255);
  d[0] = d[1];
  d[1] = Math.floor(((Math.atan2(mouseY - height / 2, mouseX - width / 2) * (180 / Math.PI) + 360) % 360) / 60);

  let s;
  let x;
  if (d[1] !== d[0]) {
    frame = frameCount;
  }
  for (let i = 0; i < 2; i++) {
    let p;
    for (let j = 0; j < 6; j++) {
      x = i * 100 + t;
      s = constrain(200 - x, 0, x);
      if (i === 1) {
        if ((7 - d[1]) % 6 === j) {
          let text_x = animate(frameCount - frame, 0, 20, x * 0.6, x);
          x += animate(frameCount - frame, 0, 10, 0, 100);
          s += animate(frameCount - frame, 0, 50, 0, 150);


          textAlign(CENTER, CENTER);
          noStroke();
          fill(255);
          textSize(x / 10);
          text(branches[j],
            text_x * sin((j * PI) / 3),
            text_x * cos((j * PI) / 3));

          if (hold > 0 && hold < 10 && !mouseIsPressed) {
            safeReplace(branches[j]);
          }
        } else {
          textAlign(CENTER, CENTER);
          noStroke();
          fill(255);
          textSize(x / 10);

          let text_x = x * 0.6;

          text(branches[j],
            text_x * sin((j * PI) / 3),
            text_x * cos((j * PI) / 3));
        }
        stroke(colors[j]);
      }

      if (x < 0) {
        stroke(0);
      }
      strokeWeight(min(200 - x, 0) + 5);
      noFill();
      p = getPoint(
        x * sin((j * PI) / 3),
        x * cos((j * PI) / 3),
        x * sin(((j + 1) * PI) / 3),
        x * cos(((j + 1) * PI) / 3),
        s
      );
      line(x * sin((j * PI) / 3), x * cos((j * PI) / 3), p.x, p.y);
      p = getPoint(
        x * sin((j * PI) / 3),
        x * cos((j * PI) / 3),
        x * sin(((j - 1) * PI) / 3),
        x * cos(((j - 1) * PI) / 3),
        s
      );
      line(x * sin((j * PI) / 3), x * cos((j * PI) / 3), p.x, p.y);
    }
  }
  pop();
}

function getPoint(ax, ay, cx, cy, z) {
  let angle = atan2(cy - ay, cx - ax);
  let x = ax + z * cos(angle);
  let y = ay + z * sin(angle);
  return { x: x, y: y };
}

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    x = 0;
  }
});