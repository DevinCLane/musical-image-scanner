// import image
// get shadows or contours or any data from the image
// Convert that into frequency

let ready = false;
let chorus = undefined;
let reverb = undefined;
let synth = undefined;
let plucky = undefined;
let crusher = undefined;
let distortion = undefined;
let fm = undefined;
let soprano = undefined;
let alto = undefined;
let tenor = undefined;
let bass = undefined;
const now = Tone.now();
let myImage;
let c;

document.getElementById('start').addEventListener('click', async () => {
	i = 0; // resets the counter back to zero, this way we can play the song/animation again
    clear(); // clears the canvas so that we can draw the image again
    await Tone.start() // allows the audio context to start so we can play audio
    reverb = new Tone.Reverb(2).toDestination();
    chorus = new Tone.Chorus(4, 2.5, 0.5).connect(reverb);
    distortion = new Tone.Distortion(0.8).connect(reverb);
    fm = new Tone.FMSynth().connect(distortion);
    crusher = new Tone.BitCrusher(4).connect(chorus);
    plucky = new Tone.PluckSynth().connect(crusher);
    synth = new Tone.PolySynth(Tone.Synth).connect(chorus);
    ready = true;
	console.log('audio is ready')
})

document.getElementById('new-image').addEventListener('click', async () => {
    myImage = loadImage('https://source.unsplash.com/random/1000x1000');
})

// create an average, remove the A from the rgba
const averagePixels = array => {
    let sum = 0;
    let length = 0;
    for (let i = 0; i < array.length; i++) {
        if (i % 4 !== 0) { // ignore the 4th value which is the alpha
            sum += array[i];
            length++
        }
    }
    return sum / length;
}



// const synth = new Tone.Synth().toDestination();

function preload() {
    myImage = loadImage('https://source.unsplash.com/random/1000x1000');
}

function setup() {
    createCanvas(1000, 1000);
    frameRate(7);
    colorMode(HSL);
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

    let oneImageBand = myImage.height / 4;
    let sopranoImageBand = myImage.get(i, 0, 25, oneImageBand)
    let altoImageBand = myImage.get(i, oneImageBand, 25, oneImageBand)
    let tenorImageBand = myImage.get(i, oneImageBand * 2, 25, oneImageBand)
    let bassImageBand = myImage.get(i, oneImageBand * 3, 25, oneImageBand)


    let imageColumn = myImage.get(i, 0, 25, myImage.height)
    // let horizontalImageBand = myImage.get(i, imageColumn, myImage.height / 4)
    imageColumn.loadPixels();
    sopranoImageBand.loadPixels();
    altoImageBand.loadPixels();
    tenorImageBand.loadPixels();
    bassImageBand.loadPixels();

    console.log(tenorImageBand.pixels)

    // setting up chords
    // approx frequency range of vocals from https://onlinelibrary.wiley.com/doi/pdf/10.1002/9781119164746.app2
    // 250 - 1000
    soprano = lerp(250, 1000, averagePixels(sopranoImageBand.pixels)/255)
    console.log(soprano)
    // synth.triggerAttack(soprano, now)
    // 200 - 700
    alto = lerp(200, 700, averagePixels(altoImageBand.pixels)/255)
    console.log(alto)
    // synth.triggerAttack(alto, now)
    // 110 -- 425
    tenor = lerp(110, 425, averagePixels(tenorImageBand.pixels)/255)
    console.log(tenor)
    // synth.triggerAttack(tenor, now)
    // 60 - 350
    bass = lerp(60, 350, averagePixels(bassImageBand.pixels)/255)
    console.log(bass)
    // synth.triggerAttack(bass, now)

    // synth.triggerRelease([soprano, alto, tenor, bass], now);
    plucky.triggerAttackRelease(tenor, now)
    fm.triggerAttackRelease(bass, now)
    synth.triggerAttackRelease([soprano, alto], now)

    // todo: programmatically change effect parameters and synth parameters in here 
    crusher.bits = lerp(0, 16, averagePixels(tenorImageBand.pixels)/255)
    chorus.frequency = lerp(0, 16, averagePixels(altoImageBand.pixels)/255)
    // reverb.decay = lerp(0, 10, averagePixels(bassImageBand.pixels)/255) 
    // linear interpolation to get a range of pitches I like
    // let pitch = lerp(60, 900, averagePixels(imageColumn.pixels)/255)
    // console.log(pitch)
    // synth.triggerAttackRelease(pitch, '16n')
    
    image(imageColumn, i, 0)
    i+=25
}