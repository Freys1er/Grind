function setup() {
  init();

  for (let i = 0; i < 10; i++) {
    tasks.push({
      name: "Test Task " + i,
      created: epoch() - random(0, 1000000),
      last: epoch() - random(86400-5000, 86400)
    });
  }
}

let tasks = [];

function epoch(date = null) {
  if (date === null) {
    date = new Date(); // Use the current date if no parameter is provided
  }
  return Math.floor(date.getTime() / 1000); // Divide by 1000 to get seconds since epoch
}

function draw() {
  background(style.background);
  if (loading_data) {
    loading();
  } else {
    displayTasks();
    displayNav(1);
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
      textAlign(RIGHT,CENTER);
      textSize(18);
      text(time_left, width * 0.95, height * 0.04);
      image(icons.fire, width * 0.95 - height * 0.04, height * 0.01, height * 0.04, height * 0.04);
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

}




