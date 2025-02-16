function setup() {
  init();
}

function draw() {
  background(style.background);
  if (loading_data) {
    loading();
  } else {
    displayTasks();
    displayNav(5);
  }

  mouseHold();
}


function displayTasks() {
  scroll.pos -= scroll.vel;
  scroll.vel *= 0.94; // Damping to slow down over time

  if (scroll.pos < -tasks.length * height * 0.1 + height) {
    scroll.pos = -tasks.length * height * 0.1 + height;
  }

  if (scroll.pos > 0) {
    scroll.pos = 0;
  }

  for (let i = 0; i < tasks.length; i++) {
    noFill();
    strokeWeight(2);
    stroke(style.accentColor1);
    push();
    translate(0, scroll.pos + (i + 1) * height * 0.1);
    line(width * 0.02, 0, width * 0.98, 0);
    pop();
  }
}




