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
let shift = 0;
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
    let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1737979596&single=true&output=csv";
    let table = loadTable(url, "header", "csv", () => {
      data = table.getArray();  // Set data to .getArray
      console.log('Data loaded');
      resolve();
    }, (err) => {
      console.error('Error loading data:', err);
      reject(err);
    });
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

  loadIcons().then(() => {
    return loadData();
  }).then(() => {
    loading_data = false;
    console.log('Icons and data loaded');
  }).catch((err) => {
    console.error('Error:', err);
  });

  textFont("sans-serif")
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
      text(
        notes.name,
        width / 30,
        (height / 10) * 9.4,
        width - width / 15
      );
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

  fill(style.back);
  noStroke();
  text("◄", s * 20, s * 20);
  if (hold === 1 && button(0, 0, s * 40, s * 40)) {
    notes.next = false;
    notes.progress = 1;
    stage = "FLOW";
    choosen = "";
    wait = true;
    scroll.pos = height / 3;
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
    textSize(min(s * 50, (width / sets[i][2].length) * 2));
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
        print(file);
      }
      saverecent(choosen);
    }
  }
}
let timer_start = 0;
let card_number = 0;
function flashcards() {
  fill(style.background);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textSize(s * 20);
  fill(style.setsTitle);
  noStroke();
  text(choosen.name, width / 2, height / 40);
  textSize(s * 25);

  let sortedFile = file.sort((obj1, obj2) => obj1.rating - obj2.rating);
  let card_number = file.indexOf(sortedFile[user_memory]);

  if (ans) {
    text(file[card_number].question + "\n\n\n" + file[card_number].answer, shift * 3, height / 2, width);
  } else {
    text(file[card_number].question, shift * 3, height / 2, width);
  }

  if (hold > 0 && !wait) {
    shift += mouseX - pmouseX;
  } else {
    shift = 0;
  }
  if (!mouseIsPressed) {
    wait = false;
    //YES
    if (shift * 3 < -width / 4) {
      print("The user knew: " + file[card_number].question);
      file[card_number].rating += 1 / (millis() - timer_start);
      wait = true;
      ans = false;
    }
    //NO
    if (shift * 3 > width / 4) {
      if (!ans) {
        print("The user saw the answer to: " + file[card_number].question);
        wait = true;
        ans = true;
      } else {
        print("The user did'nt know: " + file[card_number].question);
        file[card_number].rating -= 1 / (millis() - timer_start);
        wait = true;
        ans = false;
      }
    }

    if (shift * 3 > width / 4 || shift * 3 < -width / 4) {
      timer_start = millis();
    }
  }

  textAlign(LEFT, TOP);
  fill(style.exit);
  noStroke();
  rect(width / 80, height / 4, height / 120, height / 2, 20);
  if (mouseIsPressed && mouseX < width / 20) {
    stage = "EXIT-FLOW";
    wait = true;
  }
}

//INTERFACE
function draw() {
  textStyle(BOLD);
  if (loading_data) {
    loading();
    type.hide();
  } else if (stage === 'LOADING') {
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
  }
  if (stage === "NOTES") {
    shownotes(file);
    type.hide();
  }

  if (stage === "EXIT-FLOW") {
    type.hide();
    flow();
    push();
    translate(mouseX, 0);
    flashcards();
    pop();
    if (hold === 0) {
      if (mouseX < width / 2) {
        stage = "FLASHCARDS";
      } else {
        stage = "FLOW";
      }
    }
  }
  mouseHold();
}