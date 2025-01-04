let video;
let handpose;
let predictions = [];

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.parent('videoContainer'); // Attach video to the container
    video.show(); // Ensure the video is shown

    handpose = ml5.handpose(video, modelReady);
    handpose.on("predict", results => {
        predictions = results;
    });
}

function modelReady() {
    console.log("Model ready!");
}

function draw() {
    image(video, 0, 0, width, height);

    if (predictions.length > 0) {
        let hand = predictions[0];
        for (let i = 0; i < hand.landmarks.length; i++) {
            let [x, y, z] = hand.landmarks[i];
            fill(0, 255, 0);
            noStroke();
            ellipse(x, y, 10, 10);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
