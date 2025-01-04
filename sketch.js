let video;
let handpose;
let predictions = [];

function setup() {
    createCanvas(1280, 480);  // Make canvas wider (doubled width)
    video = createCapture(VIDEO);
    video.size(640, 480);     // Keep original video size
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
    background(50);  // Dark background
    
    // Draw video on the left side
    image(video, 0, 0, 640, 480);
    
    // Draw hand visualization on the right side
    if (predictions.length > 0) {
        push();
        translate(640, 0);  // Move to right side
        // Draw visualization area background
        fill(30);
        rect(0, 0, 640, 480);
        drawKeypoints();
        drawSkeleton();
        determineAndDisplayHand();
        pop();
    }
}

function drawKeypoints() {
    const hand = predictions[0];
    const landmarks = hand.landmarks;

    // Scale the points to fit the visualization area
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

function determineAndDisplayHand() {
    const hand = predictions[0];
    const thumb = hand.annotations.thumb[3];  // Tip of thumb
    const pinky = hand.annotations.pinky[3];  // Tip of pinky
    
    // If thumb is to the left of pinky, it's likely a right hand
    const isRightHand = thumb[0] < pinky[0];
    
    // Display the prediction
    fill(255);
    stroke(0);
    strokeWeight(2);
    textSize(32);
    textAlign(LEFT, TOP);
    text(`Predicted: ${isRightHand ? 'Right' : 'Left'} Hand`, 10, 10);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
