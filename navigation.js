const icons = {};
let xPos = [];
let t = 0;
let hold = 0;

const iconNames = ['account','cancel','chat','dropdown','event','google','home','notes','people','secret','share','status','stats','tasks','tools','vote'];

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
    
let style = {};
let loading_data = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    style = {
        background: '#000000',        // Black
        text: '#D3D3D3',              // Light Gray for primary text
        accentColor1: '#6B8E23',      // Olive Drab
        accentColor2: '#4B5320',      // Army Green
        accentColor3: '#F0E68C',      // Khaki
        accentColor4: '#2F4F4F',      // Dark Gray
        iconColor: '#D3D3D3',         // Light Gray for icons
        navBarColor: '#6B8E23',       // Olive Drab for navigation bar
    };
    xPos = [
        (width / 30) * 3,
        (width / 30) * 9,
        width / 2,
        (width / 30) * 21,
        (width / 30) * 27,
        width
    ];
    
    loadIcons().then(() => {
        loading_data = false;
      });
}

function displayNav(x) {
    const images = [
        icons.tasks,
        icons.stats,
        icons.home,
        icons.notes,
        icons.tools
    ];
    const names = ["Tasks", "Stats", "Home", "Notes","Tools"];

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
            if (mouseX < xPos[i + 1] - size) {
                x = i + 1;
                break;
            }
        }
    }

    if (hold < 10 && mouseIsPressed && mouseY > height * 0.91) {
        window.location.href = "https://freys1er.github.io/Grind/" + names[x - 1];
    }

    for (let i = 0; i < xPos.length; i++) {
        if (i < x && xPos[i] > pos.a[i]) {
            xPos[i] = pos.a[i];
        }
        if (i >= x && xPos[i] < pos.b[i]) {
            xPos[i] = pos.b[i];
        }
    }

    if (!x) {
        x = -1;
    }
    fill(style.navBarColor);
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
            tint(style.iconColor);
            fill(style.iconColor);
        }

        image(images[i], xPos[i], height * 0.955, size, size);
        
        if (i === x - 1) {
            fill(0);
            text(names[i], xPos[i] + width * 0.15, height * 0.96);
        }
    }

    tint("white");
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
function getPoint(ax, ay, cx, cy, z) {
    let angle = atan2(cy - ay, cx - ax);
    let x = ax + z * cos(angle);
    let y = ay + z * sin(angle);
    return { x: x, y: y };
}
function draw(){
    background(style.background);
    if (loading_data){
        loading();
    }else{
        displayNav(1);
    }
}