/* 
To do:
- Make the music sound cooler
- New random image should work
- Resize user uploaded images so they fit the canvas
- Change the whole canvas to make it smaller so the layout looks nicer
- Add nice CSS
- Change the browse button to look nice, and give confirmation of new upload
- add line data to pitch
*/

/* 
Turn an image into song by Devin Lane

Analyzes color data and turns it into music.
Splits each image into columns, and each column into four sections.
We then average the color value of each section and assign it to a pitch.
Then we move left to right until the image is fully drawn upon our canvas.
Effect parameters are modulated according to different data in the image.
*/

// variables
let canvasWidth = 1000;
let canvasHeight = 1000;
let input;
let userImg;
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

// play button
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

// new random image
document.getElementById('new-image').addEventListener('click', async () => {
    // loadImage('https://source.unsplash.com/random/1000x1000', img => {
    //     myImage = image(img, 0, 0);
    // });
    myImage = await loadImage('https://source.unsplash.com/random?sig=2/1000x1000');
    myImage.loadPixels();
    console.log(myImage)
    ready = false;
    i = 0;
    clear();
})

// new random image
document.getElementById('new-image').addEventListener('click', () => {
    // loadImage('https://source.unsplash.com/random/1000x1000', img => {
    //     myImage = image.get(img, 0, 0);
    // });
    // myImage = await loadImage('https://source.unsplash.com/random/1000x1000');
    // // myImage.loadPixels();
    // console.log(myImage)
    // ready = false;
    // i = 0;
    // clear();
})

// console.log(myImage)

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


function preload() {
    myImage = loadImage('https://source.unsplash.com/random/1000x1000');
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(7);
    // colorMode(HSL);
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

    // synth.triggerRelease([soprano, alto, tenor, bass], now);
    
    plucky.triggerAttackRelease(tenor, now)
    fm.triggerAttackRelease(bass, now)
    synth.triggerAttackRelease([soprano, alto], now)

    // todo: programmatically change effect parameters and synth parameters in here 
    crusher.bits = lerp(0, 16, getStandardDeviation(bassImageBand.pixels)/255)
    chorus.frequency = lerp(0, 16, averagePixels(altoImageBand.pixels)/255)
    // reverb.decay = lerp(0, 10, averagePixels(bassImageBand.pixels)/255) 
    // linear interpolation to get a range of pitches I like
    // let pitch = lerp(60, 900, averagePixels(imageColumn.pixels)/255)
    // console.log(pitch)
    // synth.triggerAttackRelease(pitch, '16n')
    
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
}

