# Musical Image Scanner
Given an image, turn it into sound.

## How do you use it? 

[Click here](https://musical-image-scanner.netlify.app/)

- Click play, and a song is played from a random image from [Unsplash](https://unsplash.com/). If you click the button again, the same song is played.

- If you press "stop" audio is stopped. If you press play again, the song will start from the beginning.

- If you click "Load a new random image" a new random image is loaded, then you may click "play" again for a new song.

- If you click "upload", you can upload your own image. Then press play.

## How does it work?

A random image is loaded from Unsplash. Within the code, each image is "split" into columns, and each column split into four rows. The color values of each row are averaged, and then those numbers are interpolated into frequency values which are fed into a synthesizer. The result is four parts of music playing together.

## What tools are used?

- HTML, CSS, JavaScript, as well as the JavaScript libraries p5.js and Tone.js.

- The instruments used are guitar samples played by Devin Lane, and three instruments from Tone.js: a Karplus-String string synthesizer, a Frequency Modulator synth, and a "regular" synth. 

## What would you do if you had more time?

- Establish a musical frequency framework and perhaps use a 12-tone system. Currently each frequency is played as is, so everything sounds very microtonal (e.g., a pitch of 474.88hz might be played, which lies between C# and D in an equal-tempered A440 tuning system)
- Include a "pause" function, so that you can stop a song, and have it resume from the same position. Currently you may stop, and if you press play again, the song restarts.
- Add rhythm controls and give more thought to tempo. Perhaps a different data point like line values could change the tempo of the piece of music.
- Allow different data pieces to modulate the effect parameters.
- Test on mobile and allow users to upload images with their phones.
- Add "image loaded" notifications when a new image is loaded. Make it clearer that the user should press play after new image is loaded.
- Play with new tones, different synthesizers, new samples. More generally improve the musical composition. Perhaps include different presets the user may select
