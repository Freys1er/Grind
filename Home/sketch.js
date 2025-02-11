let apps = [];
let sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUIkukgCXVmCxGbztGHTbFyB8umF3M82jteRydSF_eXbJPjmcPTjUfVyClU-NPkHQ2V7V8wk87rKF1/pub?gid=597840129&single=true&output=csv";
let hold = 0;

let iconSize = 60;
let padding = iconSize / 3;

function loadData() {
  return fetch(sheetUrl)
    .then((response) => response.text())
    .then((csv) => {
      let rows = csv.split("\n").slice(1); // Remove header row
      rows.forEach((row) => {
        let columns = row.split(",");
        let name = columns[0].trim();
        let icon = columns[1].trim();
        let url = columns[2].trim();

        loadImage(icon, (img) => {
          // Image loaded successfully
          apps.push({ name, icon: img, url });
        }, () => {
          // Image loading failed
          apps.push({ name, icon: null, url });
        });
      });
      console.log(apps);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function loadImage(url, onSuccess, onError) {
  let img = new Image();
  img.onload = () => onSuccess(img);
  img.onerror = () => onError();
  img.src = url;
}
function mouseTime() {
  if (mouseIsPressed) {
    hold++;
  } else {
    hold = 0;
  }
}
let loading_data = true;
function setup() {
  loadData().then(loadIcons).then(() => {
    loading_data = false;
  });
  createCanvas(windowWidth, windowHeight);
  iconSize = 60;
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

function draw() {
  imageMode(CORNER);
  if (loading_data) {
    loading();
  } else {

    iconSize = min([height, width]) / 6;
    padding = iconSize / 3;

    background(0);

    let cols = floor(width / (iconSize + padding)); // Number of columns
    let rows = ceil(apps.length / cols); // Number of rows

    let startX = padding;
    let startY = padding;

    for (let i = 0; i < apps.length; i++) {
      let x = startX + (i % cols) * (iconSize + padding);
      let y = startY + floor(i / cols) * (iconSize + padding);
      drawIcon(apps[i], x, y * 1.2, iconSize);
    }

    displayNav(3);
    mouseTime();
  }
}

function drawIcon(app, x, y, size) {
  fill(255);
  stroke(0);
  strokeWeight(30);
  rect(x - padding / 4, y - padding / 4, size + padding / 2, size + padding / 2, 30); // Draw the rounded rectangle

  if (app.icon) {
    let gfx = createGraphics(size, size);
    gfx.image(app.icon, 0, 0, size, size);
    gfx.noFill();
    gfx.stroke(255);
    gfx.strokeWeight(2);
    gfx.rect(0, 0, size, size, 30);
    image(gfx, x, y, size, size); // Draw the image with rounded corners
  }

  noFill();
  stroke(0);
  strokeWeight(30);
  rect(x - padding / 4, y - padding / 4, size + padding / 2, size + padding / 2, 40); // Draw the rounded rectangle

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text(app.name, x + size / 2, y + size + 10);
}

function mousePressed() {
  let cols = floor(width / (iconSize + padding)); // Number of columns
  let rows = ceil(apps.length / cols); // Number of rows

  let startX = padding;
  let startY = padding;

  for (let i = 0; i < apps.length; i++) {
    let x = startX + (i % cols) * (iconSize + padding);
    let y = startY + floor(i / cols) * (iconSize + padding);
    if (
      mouseX > x &&
      mouseX < x + iconSize &&
      mouseY > y &&
      mouseY < y + iconSize
    ) {
      window.open(apps[i].url);

      print(apps[i].url);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw(); // Redraw the canvas after resizing
}
