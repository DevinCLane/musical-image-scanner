// import image
// get shadows or contours or any data from the image
// Convert that into frequency

// document.getElementById('start').addEventListener('click', async () => {
// 	await Tone.start()
// 	console.log('audio is ready')
// })


// from https://p5js.org/reference/#/p5.Image/get
let myImage;
let c;
const synth = new Tone.Synth().toDestination();

function preload() {
    myImage = loadImage('https://source.unsplash.com/random/1000x1000');
}

function setup() {
    createCanvas(1000, 1000);
    background(myImage);
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
    // c = myImage.get(60, 90);
    // console.log(c)
    // synth.triggerAttackRelease(c[0], '32n');
}

function mousePressed() {
    colorData = myImage.get(mouseX, mouseY)
    synth.triggerAttackRelease(colorData[0], '16n')
    console.log(colorData)
}

//get() returns color here