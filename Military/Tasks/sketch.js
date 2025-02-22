
function setup() {

  inputs.title = createInput()
    .position(width * 0.02, height * 0.2)
    .size(width * 0.95, height * 0.05)
    .style("background", "none")
    .style("border", "none")
    .style("color", "rgba(0,0,0,0)");
  inputs.description = createInput()
    .position(width * 0.02, height * 0.31)
    .size(width * 0.95, height * 0.195)
    .style("background", "none")
    .style("border", "none")
    .style("color", "rgba(0,0,0,0)");

  numbers.hours = {
    value: 0,
    scroll: 0,
    velocity: 0,
    selected: [],
    options: [],
  };

  for (let i = 0; i < 24; i++) {
    let j = (i + 6) % 24;
    numbers.hours.options.push([j, 0], [j, 30]);
    numbers.hours.selected.push(false, false);
  }

  init();

  tasks = getItem("tasks");

  if (!tasks) {
    tasks = [];
  }

  task.animate = 0;
  task.display = false;

  drag.create = false;
  animation.create = 0;
}


let inputs = {};
let numbers = {};
let tasks = [];

function epoch(date = null) {
  if (date === null) {
    date = new Date(); // Use the current date if no parameter is provided
  }
  return (date.getTime() / 1000); // Divide by 1000 to get seconds since epoch
}

let task = {};
let drag = {};
let animation = {};

function draw() {
  background(style.background);
  if (loading_data) {
    loading();
  } else if (task.display) {
    inputs.title.show();
    inputs.description.show();

    push();
    translate(0,animation.create);
    create_task();
    pop();

    if (task.animate < 20) {
      task.animate++;
      animation.create = animate(task.animate, 0, 20, height, 0);
    } else {
      if (mouseY > animation.create + height * 0.01 && mouseY < animation.create + height * 0.1 && mouseIsPressed) {
        drag.create = true;
        task.animate = 0;
      }
      if (!mouseIsPressed && drag.create) {
        drag.create = false;

        if (animation.create > height * 0.05) {
          task.display = false;
          tasks.push({
            name: inputs.title.value(),
            description: inputs.description.value(),
            created: epoch(),
            last: epoch(),
          });
          updateTasks();
          storeItem("tasks", tasks);
          inputs.title.value("");
          inputs.description.value("");

          animation.create = 0;
        }
      }
    }

    if (drag.create) {
      animation.create = mouseY - height * 0.05;
    }
    fill(255,0,0);
    text(mouseY,10,10);

  } else {
    displayTasks();
    displayNav(1);
  }

  if (!task.display) {
    //inputs.title.hide();
    //inputs.description.hide();
  }

  mouseHold();
}


function updateTasks() {
  tasks.sort((a, b) => a.last - b.last);
}

function displayTasks() {
  scroll.pos -= scroll.vel;
  scroll.vel *= 0.94; // Damping to slow down over time

  if (scroll.pos < -tasks.length * height * 0.08 + height * 0.7) {
    scroll.pos = -tasks.length * height * 0.08 + height * 0.7;
  }

  if (scroll.pos > 0) {
    scroll.pos = 0;
  }

  for (let i = 0; i < tasks.length; i++) {
    push();
    translate(0, scroll.pos + i * height * 0.07 + height * 0.1);

    let streak = floor(tasks[i].last / 86400) - floor(tasks[i].created / 86400);
    if (streak < 0) {
      streak = 0;
    }

    let time_left = floor((tasks[i].last + 86400) - epoch());

    if (time_left < 3600) {
      fill(style.warning);
      textAlign(RIGHT, CENTER);
      textSize(18);
      text(time_left, width * 0.95, height * 0.04);
    }

    if (streak > 0) {
      fill(style.taskFill);
      noStroke();
      if (area(width * 0.06, scroll.pos + i * height * 0.07 + height * 0.1, width * 0.88, height * 0.07)) {
        fill(style.taskHover);
      }
      rect(width * 0.02, height * 0.016, height * 0.04, height * 0.04, 6);

      textAlign(CENTER, CENTER);
      textSize(20);
      fill(style.text);
      text(streak, width * 0.02, height * 0.038, height * 0.047);
    } else {
      stroke(style.taskFill);
      if (area(width * 0.06, scroll.pos + i * height * 0.07 + height * 0.1, width * 0.88, height * 0.07)) {
        fill(style.taskHover);
      }
      noFill();
      rect(width * 0.02, height * 0.016, height * 0.04, height * 0.04, 6);
    }

    strokeWeight(1);
    stroke(style.taskHover);
    line(width * 0.13, height * 0.07, width, height * 0.07, 20);

    fill(style.text);
    textSize(18);
    textAlign(LEFT, TOP);
    noStroke();

    textStyle(NORMAL);
    text(tasks[i].name, width * 0.13, height * 0.01);

    pop();

    if (area(width * 0.06, scroll.pos + i * height * 0.07 + height * 0.1, width * 0.88, height * 0.07)) {
      if (hold === 1) {
        tasks[i].last = epoch();
        updateTasks();
      }
    }
  }

  strokeWeight(4);
  fill(style.taskNew);

  if (area(width - height * 0.01, height * 0.01, width * 0.98 - width - height * 0.09, height * 0.04)) {
    fill(style.taskHover);
  }
  fill(style.text);
  textSize(18);
  noStroke();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("Create", width * 0.88, height * 0.04);

  if (mouseX > width * 0.8 && mouseY < height / 15 && mouseIsPressed) {
    task.display = true;
  }
}

function create_task() {
  fill(10);
  rect(0, height * 0.05, width, height * 2, 20);

  noStroke();
  fill(style.header.color);
  rect(0, height * 0.05, width, height * 0.04, 20);
  rect(0, height * 0.07, width, height * 0.04);

  noFill();
  stroke(style.inputarea.border);
  line(0, height * 0.11, width, height * 0.11);

  noStroke();
  fill(150);
  rect(width * 0.45, height * 0.06, width * 0.1, height / 120, 20);

  fill(style.title.color);
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Create new task", width / 2, height * 0.09);

  fill(style.inputarea.color);
  rect(0, height * 0.13, width, height * 0.1);
  rect(0, height * 0.24, width, height * 0.24);
  rect(0, height * 0.49, width, height * 0.24);

  //Task name
  textAlign(LEFT, TOP);
  textSize(15);
  fill(style.title.color);
  text("Task name", width * 0.03, height * 0.14, width * 0.98, height * 0.06);

  fill(0, 0, 0, 0);
  stroke(style.textbox.border);
  strokeWeight(2);
  rect(width * 0.02, height * 0.165, width * 0.96, height * 0.06, 2);

  noStroke();
  fill(style.title.color);
  textSize(20);
  if (inputs.title.value()) {
    text(inputs.title.value(), width * 0.05, height * 0.18, width * 0.98);
  } else {
    fill(style.italic);
    textStyle(ITALIC);
    text("Name of task", width * 0.05, height * 0.18, width * 0.98);
  }
  textStyle(BOLD);

  //Task description
  textSize(15);
  fill(255);
  text("Description", width * 0.03, height * 0.25, width * 0.98, height * 0.06);

  fill(0, 0, 0, 0);
  strokeWeight(2);
  stroke(style.textbox.border);
  rect(width * 0.02, height * 0.275, width * 0.96, height * 0.2, 2);

  noStroke();
  fill(style.title.color);
  textSize(16);
  if (inputs.description.value()) {
    text(inputs.description.value(), width * 0.05, height * 0.29, width * 0.96);
  } else {
    fill(style.italic);
    textStyle(ITALIC);
    text("Enter description", width * 0.05, height * 0.29, width * 0.96);
  }

  //Number scale for repititions

  numbers.hours.scroll += numbers.hours.velocity;
  numbers.hours.velocity *= 0.95;
  if (mouseIsPressed) {
    numbers.hours.velocity = pmouseX - mouseX;
  }

  if (
    numbers.hours.scroll >
    numbers.hours.options.length * height * 0.17 + width / 50 - width
  ) {
    numbers.hours.scroll =
      numbers.hours.options.length * height * 0.17 + width / 50 - width;
    numbers.hours.velocity = 0;
  }
  if (numbers.hours.scroll < 0) {
    numbers.hours.scroll = 0;
    numbers.hours.velocity = 0;
  }

  textAlign(LEFT, TOP);
  textSize(15);
  fill(style.title.color);
  textStyle(BOLD);
  text("Hours due", width * 0.03, height * 0.5, width * 0.98, height * 0.06);

  textAlign(CENTER, CENTER);
  textSize(20);
  let is_in_button = false;
  for (let i = 0; i < numbers.hours.options.length; i++) {
    if (
      area(
        i * height * 0.17 + width / 50 - numbers.hours.scroll,
        height * 0.58,
        height * 0.15,
        height / 15
      )
    ) {
      if (hold < 10 && hold > 0 && !mouseIsPressed && abs(pmouseX - mouseX) < 1) {
        numbers.hours.selected[i] = !numbers.hours.selected[i];
      } else {
        is_in_button = true;
      }
      if (numbers.hours.selected[i]) {
        fill(style.button.hover.on);
      } else {
        fill(style.button.hover.off);
      }
    } else {
      if (numbers.hours.selected[i]) {
        fill(style.button.default.on);
      } else {
        fill(style.button.default.off);
      }
    }
    rect(
      i * height * 0.17 + width / 50 - numbers.hours.scroll,
      height * 0.55,
      height * 0.15,
      height / 15,
      10
    );

    fill(255);
    text(
      to_time(numbers.hours.options[i]),
      i * height * 0.17 + width / 50 - numbers.hours.scroll,
      height * 0.55 + height / 30,
      height * 0.15
    );
  }
  if (is_in_button) {
    cursor("pointer");
  } else {
    cursor("default");
  }
}

function animate(x, a, b, c, d) {
  // Ensure p5.js functions are properly referenced
  let minVal = Math.min(a, b);
  let maxVal = Math.max(a, b);
  let constrainedX = constrain(x, minVal, maxVal);
  let t = map(constrainedX, a, b, 0, 1);

  // Apply the atan function for a smooth transition
  let smoothT = Math.atan((t - 0.5) * 20) / Math.PI + 0.5;

  // Map the smoothT value to the desired output range [c, d]
  return map(smoothT, 0, 1, c, d);
}
function number(name, y) {
  textStyle(BOLD);
  push();
  translate(0, y);
  noFill();
  stroke(255);
  //window for numbers
  line(width * 0.4, height * 0.1, width * 0.4, 0);
  line(width * 0.6, height * 0.1, width * 0.6, 0);

  fill(255);
  noStroke();
  textSize(30);
  textAlign(CENTER, CENTER);

  for (let i = numbers[name].min; i <= numbers[name].max; i++) {
    textSize(
      map(
        abs(width / 2 - ((i * width) / 5 - numbers[name].scroll + width / 2)),
        0,
        width,
        50,
        0
      )
    );
    fill(
      map(
        abs(width / 2 - ((i * width) / 5 - numbers[name].scroll + width / 2)),
        0,
        width,
        255,
        -100
      )
    );
    text(
      i + numbers[name].value,
      (i * width) / 5 - numbers[name].scroll + width / 2,
      height * 0.05
    );
  }

  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width * 0.4, height * 0.1);
  rect(width * 0.6, 0, width, height * 0.1);

  numbers[name].scroll += numbers[name].velocity;
  numbers[name].velocity *= 0.9;
  if (mouseIsPressed) {
    numbers[name].velocity = pmouseX - mouseX;

    numbers[name].animate = 0;
  }

  if (numbers[name].scroll < 0) {
    numbers[name].scroll = 0;
    numbers[name].velocity = 0;
  }
  if (
    numbers[name].scroll >
    (width / 5) * (numbers[name].max - numbers[name].min)
  ) {
    numbers[name].scroll =
      (width / 5) * (numbers[name].max - numbers[name].min);
    numbers[name].velocity = 0;
  }

  if (abs(numbers[name].velocity) < 0.1 && !mouseIsPressed) {
    numbers[name].animate++;
    numbers[name].scroll = animate(
      numbers[name].animate,
      0,
      20,
      numbers[name].ppos,
      Math.floor((numbers[name].ppos + width / 10) / (width / 5)) * (width / 5)
    );
  } else {
    numbers[name].ppos = numbers[name].scroll;
  }
  pop();
}

function to_time(x) {
  let a = x[1];
  if (a < 10) {
    a = "0" + a;
  } else {
    a = "" + a;
  }
  return x[0] + ":" + a;
}
