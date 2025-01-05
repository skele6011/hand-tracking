let detections = [];
let faceModel;

async function initFaceTracking(videoElement) {
    try {
        console.log('Loading face detection model...');
        faceModel = await faceLandmarksDetection.load(
            faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
        );
        console.log('Face model loaded!');
        detectFace(videoElement);
    } catch (error) {
        console.error('Error loading face model:', error);
    }
}

async function detectFace(videoElement) {
    if (!videoElement || !videoElement.elt) return;

    try {
        const faces = await faceModel.estimateFaces({
            input: videoElement.elt
        });

        if (faces.length > 0) {
            detections = faces;
        } else {
            detections = [];
        }
    } catch (error) {
        console.error('Face detection error:', error);
    }

    requestAnimationFrame(() => detectFace(videoElement));
}

function drawFaceLandmarks() {
    if (detections.length === 0) return;

    const face = detections[0];
    
    // Draw points
    fill(255, 0, 0);
    noStroke();
    face.scaledMesh.forEach(point => {
        circle(point[0], point[1], 3);
    });

    // Draw face contours
    stroke(0, 255, 0);
    strokeWeight(1);
    noFill();

    // Draw basic face contours
    let contours = [
        face.annotations.silhouette,
        face.annotations.leftEyebrowUpper,
        face.annotations.rightEyebrowUpper,
        face.annotations.leftEye,
        face.annotations.rightEye,
        face.annotations.lipsUpperOuter,
        face.annotations.lipsLowerOuter
    ];

    contours.forEach(contour => {
        beginShape();
        contour.forEach(point => {
            vertex(point[0], point[1]);
        });
        endShape(CLOSE);
    });

    // Draw status text
    fill(255);
    noStroke();
    textSize(24);
    textAlign(LEFT, TOP);
    text('Face tracking: Active', 10, 10);
}
