let video;
let handpose;
let predictions = [];

function setup() {
    createCanvas(1280, 480);
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    handpose = ml5.handpose(video, modelReady);
    handpose.on("predict", results => {
        predictions = results;
    });
}

function modelReady() {
    console.log("Model ready!");
}

function draw() {
    background(50);
    
    // Left side - video
    push();
    image(video, 0, 0, 640, 480);
    pop();
    
    // Right side - hand tracking visualization
    push();
    translate(640, 0);
    fill(30);
    rect(0, 0, 640, 480);
    
    if (predictions.length > 0) {
        const hand = predictions[0];
        
        // Draw dots in red
        for (let i = 0; i < hand.landmarks.length; i++) {
            const [x, y] = hand.landmarks[i];
            fill(255, 0, 0);  // Changed to red
            noStroke();
            circle(x, y, 10);
        }
        
        // Draw lines in green
        stroke(0, 255, 0);  // Changed to green
        strokeWeight(2);
        
        // Draw connections between landmarks
        const fingers = [
            [0, 1, 2, 3, 4],        // thumb
            [0, 5, 6, 7, 8],        // index finger
            [0, 9, 10, 11, 12],     // middle finger
            [0, 13, 14, 15, 16],    // ring finger
            [0, 17, 18, 19, 20]     // pinky
        ];
        
        for (let finger of fingers) {
            for (let i = 0; i < finger.length - 1; i++) {
                const [x1, y1] = hand.landmarks[finger[i]];
                const [x2, y2] = hand.landmarks[finger[i + 1]];
                line(x1, y1, x2, y2);
            }
        }

        // Determine hand type - inverted logic
        const thumb = hand.landmarks[4];  // Thumb tip
        const pinky = hand.landmarks[20]; // Pinky tip
        const isRightHand = thumb[0] > pinky[0];  // Changed from < to >
        
        // Display prediction text
        fill(255);
        noStroke();
        textSize(32);
        textAlign(CENTER);
        text(`Predicted: ${isRightHand ? 'Right' : 'Left'} Hand`, 320, 50);
    }
    pop();
}
