let sheetUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUIkukgCXVmCxGbztGHTbFyB8umF3M82jteRydSF_eXbJPjmcPTjUfVyClU-NPkHQ2V7V8wk87rKF1/pub?gid=0&single=true&output=csv";
let names = [];
let content = [];
let images = [];
let loadedImages = [];
let mask;
let newsreaderFont;
let style;
let icons = {};
let xPos = [];

let t = 0;

let scroll = {};

let iconNames = ['account', 'cancel', 'chat', 'dropdown', 'event', 'home', 'people', 'secret', 'share', 'status', 'vote'];

function loadIcons() {
  return new Promise((resolve, reject) => {
    let loadedIcons = [];
    let iconsToLoad = iconNames.length;

    for (let i = 0; i < iconNames.length; i++) {
      let icon = iconNames[i];
      loadImage(`../icons/${icon}.svg`,
        (img) => {
          icons[icon] = img;
          loadedIcons.push(img);

          // Check if all icons are loaded
          if (loadedIcons.length === iconsToLoad) {
            resolve(loadedIcons);
          }
        },
        (err) => {
          console.error(`Failed to load icon: ${icon}`, err);
          reject(err);
        }
      );
    }
  });
}

function setup() {
  newsreaderFont = loadFont("../newsfont.ttf"); // Adjust the path as needed

  loadData().then(loadImages).then(loadIcons).then(() => {
    loading_data = false;
  });

  console.log(loadedImages)

  createCanvas(windowWidth, windowHeight);

  scroll.pos = -height / 3;
  scroll.vel = 0;

  style = {
    background: "rgb(0,0,0)", // Dark background
    icon: "rgb(117,114,131)", // Slightly lighter grey for icons
    navigationBar: "rgb(22,19,38)", // Dark bar

    // Additional colors
    primaryGold: "rgb(255, 215, 0)", // Gold for primary elements
    accentYellow: "rgb(255, 235, 59)", // Yellow for accents
    textPrimary: "rgb(255, 255, 255)", // White for primary text
    textSecondary: "rgb(200, 200, 200)", // Light grey for secondary text
    highlight: "rgb(255, 140, 0)", // Darker yellow-orange for highlights
    border: "rgb(50, 50, 50)", // Dark grey for borders
    hoverEffect: "rgb(100, 100, 100)", // Slightly lighter grey for hover effects
    shadowEffect: "rgba(0, 0, 0, 0.5)", // Shadow effect
  };

  xPos = [
    (width / 30) * 3,
    (width / 30) * 9,
    width / 2,
    (width / 30) * 21,
    (width / 30) * 27,
    width
  ];
}
function mouseWheel() {
  scroll.pos -= event.delta
}
let loading_data = true;
function draw() {

  imageMode(CORNER);

  if (loading_data) {
    loading();
  } else {

    background(style.background); // Dark mode background
    fill(255);


    displayFeed();
    displayNav(3);
  }
}

function loadData() {
  return fetch(sheetUrl)
    .then((response) => response.text())
    .then((csv) => {
      let rows = csv.split("\n").slice(1); // Remove header row
      rows.forEach((row) => {
        let columns = row.split(",");
        names.push(columns[0].trim());
        images.push(columns[1].trim());
        content.push(columns[2].trim());
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function loadImages() {
  return new Promise((resolve, reject) => {
    let mask = null;
    let imagesToLoad = images.length;

    for (let i = 0; i < images.length; i++) {
      loadImage(
        images[i],
        (img) => {
          if (!mask) {
            mask = createMask(img.width, img.height);
          }
          img.mask(mask);
          loadedImages.push(img);

          // Check if all images are loaded
          if (loadedImages.length === imagesToLoad) {
            resolve(loadedImages);
          }
        },
        (err) => {
          console.error(`Failed to load image: ${images[i]}`, err);
          reject(err);
        }
      );
    }
  });
}
function createMask(w, h) {
  let mask = createGraphics(w, h);
  mask.fill(255);
  mask.rect(0, 0, w, h, 60); // Draws a rectangle with rounded corners
  return mask;
}

function mouseDragged() {
  scroll.vel = pmouseY - mouseY;
}

let y = 0;
function displayFeed() {
  textSize(20);
  scroll.pos -= scroll.vel;
  scroll.vel *= 0.94; // Damping to slow down over time

  if (scroll.pos < height * 0.85 - y) {
    scroll.pos = height * 0.85 - y;
  }
  if (scroll.pos > height * 0.03) {
    scroll.pos = height * 0.03;
  }
  y = 0;
  for (let i = 0; i < names.length; i++) {

    let s = textAscent() + textDescent();
    if (scroll.pos + y > -height * 0.2) {
      push();
      translate(0, scroll.pos + y);


      if (area(0, scroll.pos + y + height * -0.01, width * 0.9, height * 0.27 + s)) {
        fill(0);
        rect(width * 0.02, height * -0.01, width * 0.96, height * 0.27 + s, 20);
      }

      noStroke();
      // Draw text
      fill(255);
      textAlign(LEFT, TOP);
      textStyle(BOLD);

      textFont(newsreaderFont);
      text(names[i], width * 0.08, height * 0.27, width * 0.84);


      textAlign(RIGHT, TOP);
      textFont('sans-serif');
      text("⇗", width * 0.08, height * 0.27, width * 0.84);

      // Draw image if loaded
      let thumb_nail = loadedImages[i];
      if (thumb_nail) {
        image(thumb_nail, width * 0.05, 0, width * 0.9, height * 0.25);
      }
      pop();
    }

    y += height * 0.27 + s;
    if (scroll.pos + y + height * -0.01 > height) {
      break;
    }
  }

  fill(255);
  textSize(15);
  textAlign(CENTER, CENTER)
  text("Your all caught up!", width / 2, scroll.pos + y + height * 0.02)
}

function area(x, y, w, h) {
  return mouseX > x && mouseY > y && mouseX < x + w && mouseY < y + h;
}
function getPoint(ax, ay, cx, cy, z) {
  let angle = atan2(cy - ay, cx - ax);
  let x = ax + z * cos(angle);
  let y = ay + z * sin(angle);
  return { x: x, y: y };
}
function loading() {
  background(0);
  t++;
  if (t === 100) {
    t = 0;
  }
  push();
  translate(width / 2, height / 2);
  stroke(255);

  for (let i = 0; i < 3; i++) {
    let x = i * 100 + t;

    let s = constrain(200 - x, 0, x);

    strokeWeight(min(200 - x, 0) + 5);
    if (200 - x < -5) {
      stroke(0);
    }
    let p;
    for (let j = 0; j < 6; j++) {
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
  noStroke();
  textSize(width / 20);
  textAlign(CENTER, CENTER);
  fill(255);
  if (frameCount > 100) {
    text("This is taking longer then usual...", width / 2, height * 0.8);
  }
}
function displayNav(x) {
  const images = [
    icons.people,
    icons.vote,
    icons.status,
    icons.event,
    icons.secret
  ];
  const names = ["Social", "Issues", "Home", "Events", "Secrets"];

  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  let size = height * 0.04;

  let pos = {
    a: [
      (width / 30) * 3,
      (width / 30) * 7,
      (width / 30) * 11,
      (width / 30) * 15,
      (width / 30) * 19
    ],
    b: [
      (width / 30) * 11,
      (width / 30) * 15,
      (width / 30) * 19,
      (width / 30) * 23,
      (width / 30) * 27
    ]
  };

  for (let i = 0; i < xPos.length; i++) {
    if (mouseY > height * 0.91) {
      if (mouseX < xPos[i + 1]) {
        x = i + 1;
        break;
      }
    }
  }

  for (let i = 0; i < xPos.length; i++) {
    if (i < x && xPos[i] > pos.a[i]) {
      xPos[i] = pos.a[i];
    }
    if (i >= x && xPos[i] < pos.b[i]) {
      xPos[i] = pos.b[i];
    }
  }

  fill(255, 0, 0);
  text(x, 100, 100);
  if (!x) {
    x = -1;
  }
  fill(style.navigationBar);
  noStroke();
  rect(0, height * 0.91, width, height);
  if (mouseY > height * 0.87) {
    cursortype = "pointer";
  }
  imageMode(CENTER);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(height / 40);

  fill(255);
  rect(xPos[x - 1] - size * 0.8, height * 0.93 - size * 0.1, width * 0.38, size * 1.5, 100);

  for (let i = 0; i < images.length; i++) {
    if (x === i + 1) {
      tint("#000000");
      fill(255);
    } else {
      tint(style.icon);
      fill(style.icon);
    }
    image(images[i], xPos[i], height * 0.955, size, size);
    if (i === x - 1) {
      fill(0);
      text(names[i], xPos[i] + width * 0.15, height * 0.96);
    }
  }

  tint("white");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
