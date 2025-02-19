const icons = {};
let xPos = [];
let t = 0;
let hold = 0;

const iconNames = ['account', 'cancel', 'chat', 'dropdown', 'event', 'google', 'home', 'notes', 'people', 'secret', 'share', 'status', 'stats', 'tasks', 'tools', 'vote', 'swipe'];

function mouseHold() {
    if (mouseIsPressed) {
        hold++;
    } else {
        hold = 0;
    }
}


function loadIcons() {
    return new Promise((resolve, reject) => {
        let loadedIcons = [];
        let iconsToLoad = iconNames.length;

        for (let i = 0; i < iconNames.length; i++) {
            let icon = iconNames[i];
            loadImage(`https://freys1er.github.io/Hive/icons/${icon}.svg`,
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

function init() {
    createCanvas(windowWidth/1, windowHeight/1);
    style = {
        background: '#000000',        // Black (no change)
        text: '#A9A9A9',              // Darker Light Gray
        accentColor1: '#1E3A5F',      // Dark Slate Blue
        accentColor2: '#2E4057',      // Dark Steel Blue
        accentColor3: '#2E4057',      // Dark Steel Blue
        accentColor4: '#B0C4DE',      // Light Steel Blue
        accentColor5: '#1C1C1C',      // Very Dark Gray
        iconColor: '#A9A9A9',         // Darker Light Gray for icons
        navBarColor: '#1976D2',       // Education (no change)
        taskFill: '#2B3E50',          // Darker Air Force Blue
        taskNew: '#37474F',           // Darker Cadet Grey
        taskHover: '#6B7280',         // Darker Lighter Air Force Blue
        setsText: '#D3D3D3',          // Light Gray for sets text
        setsFill: '#000000',          // Indigo for sets fill
        setsStroke: '#1976D2',        // Purple for sets stroke
        exit: '##008BF8',              // Crimson for exit
        back: '#008BF8',              // Gold for back
        setsTitle: '#FFFFFF',         // Dark Orange for sets title
        button: '#AAAAAA',             // Example color for button (Deep Orange)
        green: '#1eb955',
        red: '#f53e27'
    };


    xPos = [
        (width / 30) * 3,
        (width / 30) * 9,
        width / 2,
        (width / 30) * 21,
        (width / 30) * 27,
        width
    ];


    scroll = {
        pos: 0,
        vel: 0
    };
}
function safeReplace(newDir) {
    // Get the current URL using window.location.href
    let url = window.location.href;
  
    // Use URL constructor to parse the URL
    let parsedURL = new URL(url);
  
    // Get the base URL (protocol + hostname)
    let baseURL = parsedURL.protocol + '//' + parsedURL.hostname;
  
    // Check if the URL contains '/Hive' and ends with or after '/Hive'
    let path = parsedURL.pathname;
    if (path.includes('/Hive')) {
        // Keep the path up to and including '/Hive'
        let hiveIndex = path.indexOf('/Hive') + '/Hive'.length;
        baseURL += path.slice(0, hiveIndex);
    }
  
    // Add the new directory
    let newUrl = baseURL + '/' + newDir + "/";
  
    console.log(url, newUrl);
  
    if (url !== newUrl) {
        window.location.href = (newUrl);
    }
  }
function displayNav(x) {
    const images = [
        icons.tasks,
        icons.stats,
        icons.home,
        icons.notes,
        icons.tools
    ];
    const names = ["-", "-", "Home", "-", "-"];

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

    if (hold > 0 && hold < 10 && !mouseIsPressed && mouseY > height * 0.91) {
        const urls = ["Information","Information","Information","Information","Information"];
        safeReplace(urls[x - 1]);
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
    angleMode(RADIANS);
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

function area(x, y, w, h) {
    return mouseX > x && mouseY > y && mouseX < x + w && mouseY < y + h;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
    scroll.vel = pmouseY - mouseY;
}

let scroll = {};

function mouseWheel() {
    scroll.pos -= event.delta
}


function animate(x, a, b, c, d) {
    // Ensure p5.js functions are properly referenced
    let minVal = Math.min(a, b);
    let maxVal = Math.max(a, b);
    let constrainedX = constrain(x, minVal, maxVal);
    let t = map(constrainedX, a, b, 0, 1);

    // Apply the atan function for a smooth transition
    let smoothT = (Math.atan((t - 0.5) * 20) / Math.PI) + 0.5;

    // Map the smoothT value to the desired output range [c, d]
    return map(smoothT, 0, 1, c, d);
}