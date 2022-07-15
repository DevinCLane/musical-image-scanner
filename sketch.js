// import image
// get shadows or contours or any data from the image
// Convert that into frequency

let ready = false;

document.getElementById('start').addEventListener('click', async () => {
	i = 0;
    ready = true;
    clear();
    await Tone.start()
	console.log('audio is ready')
})

// create an average
const average = array => {
    return array.reduce((a, b) => a + b) / array.length;
}

// from https://p5js.org/reference/#/p5.Image/get
let myImage;
let c;
const synth = new Tone.Synth().toDestination();

function preload() {
    myImage = loadImage('https://source.unsplash.com/random/1000x1000');
}

function setup() {
    createCanvas(1000, 1000);
    frameRate(10);
    // background(myImage);
    // noStroke();
// todo: loop across the image size
// send this data to tone.js
/* 
get() syntax: get(x, y, w, h)
x Number: x-coordinate of the pixel
y Number: y-coordinate of the pixel
w Number: width
h Number: height 
*/

    // synth.triggerAttackRelease(c[0], '32n');
}

// function mousePressed() {
//     colorData = myImage.get(mouseX, mouseY)
//     synth.triggerAttackRelease(colorData[0], '16n')
//     console.log(colorData)
// }

let i = 0;
function draw() {
    if (!ready) {
        return;
    }
    if (i >= myImage.width) {
        ready = false;
        return;
    }
    let imageColumn = myImage.get(i, 0, 25, myImage.height);
    image(imageColumn, i, 0)
    imageColumn.loadPixels();

    // linear interpolation to get a range of pitches I like
    let pitch = lerp(60, 900, average(imageColumn.pixels)/255)

    const now = Tone.now()
    // trigger the attack immediately
    console.log('ok')
    synth.triggerAttackRelease(pitch, '16n', now)
    // wait one second before triggering the release
    // synth.triggerAttackRelease(pitch, '16n')
    i++
}