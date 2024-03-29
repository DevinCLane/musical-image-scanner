/* 
Turn an image into song by Devin Lane

Analyzes color data and turns it into music.
Splits each image into columns, and each column into four sections.
We then average the color value of each section and assign it to a pitch.
Then we move left to right until the image is fully drawn upon our canvas.
*/

// variables
let canvasWidth = 600;
let canvasHeight = 600;
let userImg;
let ready = false;

let chorus = undefined;
let reverb = undefined;
let synth = undefined;
let plucky = undefined;
let crusher = undefined;
let distortion = undefined;
let fm = undefined;
const now = Tone.now();

let soprano = undefined;
let alto = undefined;
let tenor = undefined;
let bass = undefined;

let myImage;
let c;


/* 
Tone.js audio setup
*/

// sampler
const sampler = new Tone.Sampler({
	urls: {
		"C4": "guitar1.mp3",
		"E4": "guitar2.mp3",
		"G4": "guitar3.mp3",
		"D3": "guitar4.mp3",
	},
	release: 1,
	baseUrl: "/samples/",
})

reverb = new Tone.Reverb(2).toDestination();
chorus = new Tone.Chorus(4, 2.5, 0.5).connect(reverb);
distortion = new Tone.Distortion(0.8).connect(reverb);
fm = new Tone.FMSynth().connect(distortion);
crusher = new Tone.BitCrusher(4).connect(chorus);
plucky = new Tone.PluckSynth().connect(crusher);
synth = new Tone.PolySynth(Tone.Synth).connect(chorus);
sampler.chain(chorus, reverb, Tone.Destination)


// play button
const startButton = document.getElementById('start');
startButton.addEventListener('click', async () => {
	i = 0; // resets the counter back to zero, this way we can play the song/animation again
    clear(); // clears the canvas so that we can draw the image again
    await Tone.start() // allows the audio context to start so we can play audio
    await Tone.loaded()
    ready = true;
	console.log('audio is ready')
})

// stop button
document.getElementById('stop').addEventListener('click', () => {
    ready = false;
})

// new random image button
const newImage = document.getElementById('new-image');
newImage.addEventListener('click', async () => {
    myImage = await loadImage(`https://picsum.photos/600?random=${Date.now()}`);
    canvasResizer(myImage);
    clear();
})

// Average helper function: create an average, remove the A from the RGBA values;
const averagePixels = array => {
    let sum = 0;
    let length = 0;
    for (let i = 0; i < array.length; i++) {
        // ignore the 4th value which is the alpha (i.e., skip 3, 7, 11, 15, 19...)
        // this way we get more variability within the color averages, otherwise everything has 255 bringing it closer together
        if (i % 4 !== 3) { 
            sum += array[i];
            length++
        }
    }
    return sum / length;
}

// calculate standard deviation
// https://stackoverflow.com/questions/7343890/standard-deviation-javascript
function getStandardDeviation (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

// canvas resize helper function
    // if the image is taller than 600px, resize it, but maintain aspect ratio
    // from https://p5js.org/reference/#/p5/createFileInput
function canvasResizer (myImage) {
    if(myImage.height !== canvasHeight){
        myImage.resize(myImage.width*canvasHeight/myImage.height, canvasHeight)
        resizeCanvas(myImage.width, myImage.height)
        canvasWidth = myImage.width
        canvasHeight = myImage.height
      }
} 


function preload() {
    myImage = loadImage('https://picsum.photos/600');
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(5.2);
}

let i = 0;
function draw() {
    // Don't draw anything until our play button is pushed
    if (!ready) {
        return;
    }
    // stop drawing the image once there's no more image to draw
    if (i >= myImage.width) {
        ready = false;
        return;
    }

    // resize the canvas if the image is too big
    canvasResizer(myImage);

    // split the image into columns. We will analyze one column at a time musically, and draw it.
    let imageColumn = myImage.get(i, 0, 25, myImage.height)

    // within one vertical band, split the image into four horizontal bands and use them for soprano, alto, tenor, bass
    let oneImageBand = myImage.height / 4;
    let sopranoImageBand = myImage.get(i, 0, 25, oneImageBand)
    let altoImageBand = myImage.get(i, oneImageBand, 25, oneImageBand)
    let tenorImageBand = myImage.get(i, oneImageBand * 2, 25, oneImageBand)
    let bassImageBand = myImage.get(i, oneImageBand * 3, 25, oneImageBand)
    
    // p5.js needs us to run this function to load the pixel data into the [pixels] attribute
    imageColumn.loadPixels();
    sopranoImageBand.loadPixels();
    altoImageBand.loadPixels();
    tenorImageBand.loadPixels();
    bassImageBand.loadPixels();

    // setting up chords
    // approx frequency range of vocals from https://onlinelibrary.wiley.com/doi/pdf/10.1002/9781119164746.app2
    // 250 - 1000 soprano
    soprano = lerp(250, 1000, averagePixels(sopranoImageBand.pixels)/255)
    console.log(soprano, "soprano note")
    // synth.triggerAttack(soprano, now)
    // 200 - 700 alto
    alto = lerp(200, 700, averagePixels(altoImageBand.pixels)/255)
    console.log(alto, "alto note")
    // synth.triggerAttack(alto, now)
    // 110 -- 425 tenor
    tenor = lerp(110, 425, averagePixels(tenorImageBand.pixels)/255)
    console.log(tenor, "tenor note")
    // synth.triggerAttack(tenor, now)
    // 60 - 350 bass
    bass = lerp(60, 350, averagePixels(bassImageBand.pixels)/255)
    console.log(bass, "bass note")
    // synth.triggerAttack(bass, now)

    // play the notes here
    sampler.triggerAttackRelease(alto, now)
    plucky.triggerAttackRelease(tenor, now)
    fm.triggerAttackRelease(bass, now)
    synth.triggerAttackRelease(soprano, now)

    // todo: programmatically change effect parameters and synth parameters in here 
    // crusher.bits = lerp(0, 16, getStandardDeviation(bassImageBand.pixels)/255)
    // chorus.frequency = lerp(0, 16, averagePixels(altoImageBand.pixels)/255)
    
    // draw the image one 'imageColumn' at a time from left to right, at the speed of the frame rate
    image(imageColumn, i, 0)
    // move 25 pixels at a time from left to right
    i+=25
}

// Handle user uploaded images
// References:
// https://editor.p5js.org/rjgilmour/sketches/uUPvCTZ2R
// https://p5js.org/reference/#/p5/createFileInput
function handleFile() {
    const selectedFile = document.getElementById('upload');
    const myImageFile = selectedFile.files[0];
    let urlOfImageFile = URL.createObjectURL(myImageFile);
    userImg = loadImage(urlOfImageFile);
    myImage = userImg;
    clear();
}

