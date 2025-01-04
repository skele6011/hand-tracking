let video;
let handpose;
let predictions = [];

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    handpose = ml5.handpose(video, {
        flipHorizontal: true // Add this to correct mirror effect
    }, modelReady);
    
    handpose.on("predict", results => {
        predictions = results;
    });
}

function modelReady() {
    console.log("Model ready!");
}

function draw() {
    // Show video normally
    image(video, 0, 0, width, height);

    // Draw hand skeleton
    if (predictions.length > 0) {
        drawKeypoints();
        drawSkeleton();
    }
}

function drawKeypoints() {
    const hand = predictions[0];
    const landmarks = hand.landmarks;

    // Draw keypoints
    for (let i = 0; i < landmarks.length; i++) {
        const [x, y] = landmarks[i];
        fill(0, 255, 0);
        noStroke();
        circle(x, y, 10);
    }
}

function drawSkeleton() {
    const hand = predictions[0];
    const annotations = hand.annotations;
    
    // Draw palm
    stroke(255, 0, 0);
    strokeWeight(2);
    for (let j = 0; j < annotations.palmBase.length; j++) {
        const [x, y] = annotations.palmBase[j];
        circle(x, y, 5);
    }

    // Draw fingers
    const fingers = Object.keys(annotations).filter(key => key !== 'palmBase');
    for (let finger of fingers) {
        const points = annotations[finger];
        for (let i = 0; i < points.length - 1; i++) {
            const [x1, y1] = points[i];
            const [x2, y2] = points[i + 1];
            line(x1, y1, x2, y2);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
