# image-to-song
Given an image, turn it into sound.

## How do you use it? 

Click the button, and a song is played. If you click the button again, the same song is played.

If you click "new image" a new random image is loaded, then you may click "play song" again, for a new song.

## How does it work?

A random image is loaded from Unsplash. Within the code, each image is "split" into 40 horizontal bands of pixels. Each band's color values are averaged, and then those numbers are interpolated into frequency values which are fed into a synthesizer.

## What tools are used?

HTML, CSS, JavaScript, as well as the JavaScript libraries p5.js and tone.js.

## What was your thought process in building this solution?

## What sort of challenges or tradeoffs did you encounter, and how did you solve these issues?

## What would you do if you had more time?
- Have the stop button restart from the same position
- Add rhythm controls
- Use line data for effect modulation
- Test on mobile and allow users to upload images with their phones

## Do you have any feedback for us on this assignment? Any other questions?

## To do

- allow user input of images
- "next random image" button should load a new random image


