let user_memory = 2;
//VARS
let stage = "LOADING";
let choosen = null;
let points = [];
let s = 0;
let end = 0;
let total = 0;
let redirect = "LOADING";
let cookies;

//FLASHCARDS
let h = {
  keys: [],
  titles: [],
  names: [],
  r: [],
  scroll: [],
  menu: false,
  recent: [],
};
let file;
let index = 0;
let wait = false;
let ans = false;
let streak = 0;
let qanda = 0;
let start = 0;
let search = "";
let glide = {
  info: 0,
  up: true,
};
//NOTES
let notes = {
  progress: 1,
  len: 0,
  next: 0,
  count: 0,
};

let data;

function contains(a, b) {
  // Convert both strings to lowercase
  let lowerA = a.toLowerCase();
  let lowerB = b.toLowerCase();

  // Remove special characters from both strings
  let cleanedA = lowerA.replace(/[^a-z0-9]/gi, "");
  let cleanedB = lowerB.replace(/[^a-z0-9]/gi, "");

  // Check if the cleaned string a contains the cleaned string b
  return cleanedA.includes(cleanedB);
}

//filters
function filtersets(term) {
  if (!term) {
    term = "";
  }
  sets = [];
  for (let i = 0; i < data.length; i++) {
    if (contains(data[i].join(""), term)) {
      sets.push(data[i]);
    }
  }
}

function mouseWheel(event) {
  scroll.pos -= event.delta;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  s = min([width, height]) / 500;
}

function loadData() {
  return new Promise((resolve, reject) => {
    let url =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1737979596&single=true&output=csv";
    let table = loadTable(
      url,
      "header",
      "csv",
      () => {
        data = table.getArray(); // Set data to .getArray
        console.log("Data loaded");
        resolve();
      },
      (err) => {
        console.error("Error loading data:", err);
        reject(err);
      }
    );
  });
}

function setup() {
  angleMode(DEGREES);

  glide.info = (height / 5) * 2;

  s = min([width, height]) / 100;

  type = createInput();
  type.style("background-color", color(0, 0, 0, 0));
  type.style("border-color", color(0, 0, 0, 0));
  type.style("color", color(0, 0, 0, 0));
  type.value(" ");

  init();

  loadIcons()
    .then(() => {
      return loadData();
    })
    .then(() => {
      loading_data = false;
      console.log("Icons and data loaded");
    })
    .catch((err) => {
      console.error("Error:", err);
    });

  textFont("sans-serif");

  card = {
    number: 0,
    shift: 0,
    y: 0,
    flip: 0,
    x: 0,
  };

  options = {
    left: "KNOWN",
    right: "REVEAL",
  };
}
//FUNCTIONS
function todate(x) {
  x = x.split(" ")[0].split("/");
  return (
    [
      "January",
      "Febuary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][int(x[0]) - 1] +
    " " +
    x[1] +
    ", " +
    x[2]
  );
}

function button(x, y, w, h) {
  return mouseX > x && mouseY > y && mouseX < x + width && mouseY < y + h;
}

//APPS
function shownotes(x) {
  background(style.background);
  x = x.split(/<|>/);
  if (mouseIsPressed) {
    scroll.vel = pmouseY - mouseY;
    scroll.pos -= scroll.vel;
    scroll.vel *= 0.95;
  }
  if (scroll.pos < -notes.len) {
    notes.next = true;
    scroll.pos = -notes.len;
  }
  if (scroll.pos > 0) {
    scroll.pos = 0;
  }
  j = 0;
  fill(style.text);
  notes.count = 0;
  i = 1;
  push();
  translate(0, scroll.pos);
  while (notes.count < notes.progress && i < x.length) {
    if (x[i] === "H1") {
      textAlign(CENTER, TOP);
      textSize(s * 70);
      text(x[i + 1], 0, j, width);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "H2") {
      textAlign(CENTER, TOP);
      textSize(s * 50);
      text(x[i + 1], 0, j, width);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "H3") {
      textAlign(LEFT, TOP);
      textSize(s * 30);
      text(x[i + 1], width / 60, j, width);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "H4") {
      textAlign(LEFT, TOP);
      textSize(s * 20);
      text(x[i + 1], width / 60, j, width);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "H5") {
      textAlign(LEFT, TOP);
      textSize(s * 15);
      text(x[i + 1], width / 60, j, width);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "BR") {
      notes.name = x[i + 1];
      notes.count++;
      j += s * 30;
    }
    i += 2;
  }
  pop();
  notes.len = j - height * 0.7;

  if (notes.count > notes.progress) {
    notes.next = false;
    notes.progress = 1;
    stage = "FLOW";
    choosen = "";
    wait = true;
  }

  if (notes.next) {
    textSize(s * 30);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(style.button);
    rect(width / 30, (height / 10) * 9, width - width / 15, height / 12, 10);
    if (notes.progress * 2 < x.length) {
      fill(style.background);
      text(notes.name, width / 30, (height / 10) * 9.4, width - width / 15);
      textStyle(NORMAL);
      if (
        button(
          width / 30,
          (height / 10) * 9,
          width - width / 15,
          height / 12
        ) &&
        hold === 1
      ) {
        notes.next = false;
        notes.progress++;
        if (notes.name === "DONE") {
          notes.next = false;
          notes.progress = 1;
          stage = "FLOW";
          choosen = "";
          wait = true;
        }
      }
    }
  }
}

function saverecent() {
  for (let i = 0; i < h.recent.length; i++) {
    if (h.recent[i] === choosen) {
      h.recent.splice(i, 1);
    }
  }
  h.recent.splice(0, 0, choosen);
  storeItem("Recent_Sets", h.recent);
}

function flow() {
  background(style.background);
  if (search !== type.value()) {
    search = type.value();
    filtersets(search);
  }

  if (mouseIsPressed) {
    scroll.vel = pmouseY - mouseY;
  }

  scroll.pos -= scroll.vel;
  scroll.vel *= 0.95;

  if (scroll.pos < -data.length * height * 0.22 + height * 0.91) {
    scroll.pos = -sets.length * height * 0.22 + height * 0.91;
  }
  if (scroll.pos > height / 9) {
    scroll.pos = height / 9;
  }
  stroke(style.setsStroke);
  fill(style.background);
  strokeWeight(2);
  rect(
    width / 80,
    -height * 0.1 + scroll.pos,
    width - width / 40,
    height / 20,
    20
  );

  type.size(width - width / 40, height / 20);
  type.position(width / 80, -height * 0.1 + scroll.pos);

  textAlign(CENTER, CENTER);
  noStroke();
  fill(style.text);
  textSize(s * 20);
  text(
    type.value(),
    width / 80,
    -height * 0.1 + scroll.pos,
    width - width / 40
  );
  if (type.value().length <= 1) {
    text(
      "Search " + total + " flashcards",
      width / 80,
      -height * 0.075 + scroll.pos,
      width - width / 40
    );
  }
  noStroke();

  for (let i = 0; i < sets.length; i++) {
    fill(style.setsFill);
    stroke(style.setsStroke);

    rect(
      width / 80,
      i * height * 0.22 + scroll.pos - height / 40,
      width - width / 40,
      height * 0.19,
      20
    );

    noStroke();
    textSize(min(s * 50, (width / sets[i][2].length) * 1.5));
    fill(style.setsText);
    text(sets[i][2], width / 2, i * height * 0.22 + scroll.pos + height / 40);

    textSize(s * 30);
    if (sets[i][4] === "NOTES") {
      text("Notes", width / 2, i * height * 0.22 + scroll.pos + height / 10);
    } else {
      text(
        floor(sets[i][3].split("#").length / 2) + " flashcards",
        width / 2,
        i * height * 0.22 + scroll.pos + height / 10
      );
    }

    textSize(s * 15);

    text(sets[i][0], width / 4, i * height * 0.22 + scroll.pos + height / 7);
    text(
      sets[i][1],
      (width / 4) * 3,
      i * height * 0.22 + scroll.pos + height / 7
    );

    if (
      hold < 10 &&
      hold > 0 &&
      abs(pmouseX - mouseX) >= abs(pmouseY - mouseY) &&
      !mouseIsPressed &&
      button(
        width / 80,
        i * height * 0.22 + scroll.pos - height / 40,
        width - width / 40,
        height * 0.19
      ) &&
      mouseY < height * 0.91
    ) {
      stage = sets[i][4];
      file = sets[i][3];
      choosen = sets[i][2];

      if (stage !== "NOTES") {
        stage = "FLASHCARDS";
        file = file.split("#");
        done = [];
        for (let i = 0; i < file.length; i += 2) {
          done.push({
            question: file[i],
            answer: file[i + 1],
            rating: 0,
          });
        }
        file = done;
        sortedFile = file.sort((obj1, obj2) => obj1.rating - obj2.rating);
        print(file);
      }
      saverecent(choosen);
    }
  }
}
let sortedFile;
let timer_start = 0;
let card;
let options;
function flashcards() {
  fill(style.background);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textSize(s * 20);
  fill(style.setsTitle);
  noStroke();
  text(choosen, width / 2, height / 40);
  textSize(s * 25);

  fill(0);
  strokeWeight(8);
  stroke(style.green);
  rect(width * 0.1, (height - width * 0.8) / 2, width * 0.8, width * 0.8, 10);
  noStroke();
  fill(255);

  if (card.shift > 0) {
    card.after = file.indexOf(sortedFile[user_memory - 1]);
  } else {
    card.after = file.indexOf(sortedFile[user_memory + 1]);
  }

  text(
    file[card.after].question,
    width * 0.1,
    height / 2 - textHeight(file[card.after].answer, width * 0.8) / 4,
    width * 0.8
  );

  push();
  translate(card.x + width / 2, 0);
  scale(card.flip, 1);
  translate(-width / 2 - card.x, 0);

  translate(card.x, card.y);

  if (mouseIsPressed) {
    if (!ans) {
      angleMode(RADIANS);
      card.flip = sin(map(card.shift, 0, width / 2, PI / 2, 0));
      card.x = min(card.shift * 2, 0);
    } else {
      card.x = card.shift * 2;
    }
  } else {
    card.x = 0;
    card.y = 0;
    card.flip = 1;
  }

  fill(0);
  strokeWeight(8);
  if (ans) {
    stroke(style.red);
  } else {
    stroke(style.green);
  }
  rect(width * 0.1, (height - width * 0.8) / 2, width * 0.8, width * 0.8, 10);

  noStroke();
  fill(style.setsTitle);

  card.number = file.indexOf(sortedFile[user_memory]);

  if (ans) {
    text(
      file[card.number].answer,
      width * 0.1,
      height / 2 - textHeight(file[card.number].answer, width * 0.8) / 4,
      width * 0.8
    );
  } else {
    text(
      file[card.number].question,
      width * 0.1,
      height / 2 - textHeight(file[card.number].answer, width * 0.8) / 4,
      width * 0.8
    );
  }
  pop();

  if (hold > 0 && !wait) {
    card.shift += mouseX - pmouseX;
    card.y += mouseY - pmouseY;
  } else {
    card.shift = 0;
    card.y = 0;
  }
  if (!mouseIsPressed) {
    wait = false;
    //YES
    if (card.shift * 2 < -width / 2) {
      print("The user knew: " + file[card.number].question);
      file[card.number].rating += 1 / (millis() - timer_start);
      wait = true;
      ans = false;

      options.left = "KNOWN";
    }
    //NO
    if (card.shift * 2 > width / 2) {
      if (!ans) {
        print("The user saw the answer to: " + file[card.number].question);
        wait = true;
        ans = true;

        options.right = "FORGOT";
      } else {
        print("The user did'nt know: " + file[card.number].question);
        file[card.number].rating -= 1 / (millis() - timer_start);
        wait = true;
        ans = false;

        options.right = "REVEAL";
      }
    }

    if (card.shift * 2 > width / 2 || card.shift * 2 < -width / 2) {
      timer_start = millis();
      sortedFile = file.sort((obj1, obj2) => obj1.rating - obj2.rating);
    }
  }

  fill(255);
  textSize(14);
  text(options.left, width * 0.2, height * 0.92);
  text(options.right, width * 0.8, height * 0.92);

  push();
  translate(width * 0.8, height * 0.9);
  rotate(PI / 2);
  translate(-width * 0.05, -width * 0.05);

  image(icons.swipe, 0, 0, width * 0.1, width * 0.1);
  pop();

  push();
  translate(width * 0.2, height * 0.9);
  rotate(PI / 2);
  scale(1, -1);
  translate(-width * 0.05, -width * 0.05);

  image(icons.swipe, 0, 0, width * 0.1, width * 0.1);
  pop();
}

//INTERFACE
function draw() {
  textStyle(BOLD);
  if (loading_data) {
    loading();
    type.hide();
  } else if (stage === "LOADING") {
    //DATA WRANGLING - FLAHSCARDS
    for (let i = 0; i < data.length; i++) {
      total += data[i][3].split("#").length;
    }
    filtersets();

    stage = "FLOW";
  }
  if (stage === "FLOW") {
    flow();
    type.show();
    displayNav(3);
  }
  if (stage === "FLASHCARDS") {
    flashcards();
    type.hide();
    imageMode(CORNER);
    image(icons.home, width * 0.02, width * 0.02, width * 0.08, width * 0.08);

    if (
      area(0, 0, width / 10, width / 10) &&
      !mouseIsPressed &&
      hold < 10 &&
      hold > 0
    ) {
      stage = "FLOW";
    }
  }
  if (stage === "NOTES") {
    shownotes(file);
    type.hide();
    imageMode(CORNER);
    image(icons.home, width * 0.02, width * 0.02, width * 0.08, width * 0.08);

    if (
      area(0, 0, width / 10, width / 10) &&
      !mouseIsPressed &&
      hold < 10 &&
      hold > 0
    ) {
      notes.next = false;
      notes.progress = 1;
      stage = "FLOW";
      choosen = "";
      wait = true;
      scroll.pos = height / 3;
    }
  }
  mouseHold();
}
function textHeight(text, maxWidth) {
  let words = text.split(" ");
  let line = "";
  let y = 0;
  let lineHeight = textAscent() + textDescent();

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";
    let testWidth = textWidth(testLine);
    if (testWidth > maxWidth && i > 0) {
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  return y + lineHeight;
}
