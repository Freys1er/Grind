let apps = [];
let icons = [];
 
let iconSize = 60;
let padding = iconSize/3;

function preload() {
  let table = loadTable('https://docs.google.com/spreadsheets/d/e/2PACX-1vTWAuLn4XudySGae0MS_WttqyTjxwpDdLtooJffbZSinP15gCx0pyIlSgXbKxZnf7ysk7VkZ53bopfD/pub?gid=0&single=true&output=csv', 'csv', 'header', () => {
    for (let i = 0; i < table.getRowCount(); i++) {
      let name = table.getString(i, 'name');
      let icon = table.getString(i, 'icon');
      let url = table.getString(i, 'url');
      apps.push({ name, icon, url });
      print({ name, icon, url });
      loadImage(icon, img => icons[i] = img, () => icons[i] = null);
    }
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop(); // No need to continuously draw\
  iconSize = 60;
}

function draw() {
  iconSize = min({height,width})/6;
  padding = iconSize/3;
  
  background(0);

  let cols = floor(width / (iconSize + padding)); // Number of columns
  let rows = ceil(apps.length / cols); // Number of rows

  let startX = padding;
  let startY = padding;

  for (let i = 0; i < apps.length; i++) {
    let x = startX + (i % cols) * (iconSize + padding);
    let y = startY + floor(i / cols) * (iconSize + padding);
    drawIcon(apps[i], icons[i], x, y * 1.2, iconSize);
  }
}

function drawIcon(app, img, x, y, size) {
  fill(255);
  stroke(0);
  strokeWeight(30);
  rect(x-padding/4, y-padding/4, size+padding/2, size+padding/2,30); // Draw the rounded rectangle

  if (img) {
    let gfx = createGraphics(size, size);
    gfx.image(img, 0, 0, size, size);
    gfx.noFill();
    gfx.stroke(255);
    gfx.strokeWeight(2);
    gfx.rect(0, 0, size, size, 30);
    image(gfx, x, y, size, size); // Draw the image with rounded corners
  }

  noFill();
  stroke(0);
  strokeWeight(30);
  rect(x-padding/4, y-padding/4, size+padding/2, size+padding/2,40); // Draw the rounded rectangle

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

  print(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw(); // Redraw the canvas after resizing
}
