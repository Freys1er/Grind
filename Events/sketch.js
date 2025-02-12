let sheetUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUIkukgCXVmCxGbztGHTbFyB8umF3M82jteRydSF_eXbJPjmcPTjUfVyClU-NPkHQ2V7V8wk87rKF1/pub?gid=0&single=true&output=csv";
let names = [];
let content = [];
let images = [];
let loadedImages = [];
let mask;
let newsreaderFont;
let hold = 0;

let scroll = {};

function setup() {
  newsreaderFont = loadFont("../newsfont.ttf"); // Adjust the path as needed

  loadData().then(loadImages).then(loadIcons).then(() => {
    loading_data = false;
  });

  console.log(loadedImages)

  createCanvas(windowWidth, windowHeight);

  scroll.pos = -height / 3;
  scroll.vel = 0;
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
    displayNav(4);
  }

  mouseTime();
}
function mouseTime() {
  if (mouseIsPressed) {
    hold++;
  } else {
    hold = 0;
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
