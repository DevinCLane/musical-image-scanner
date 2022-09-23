# [Musical Image Scanner](https://musical-image-scanner.netlify.app/) by Devin Lane
Given an image, turn it into sound.

## How do you use it? 

[Go to https://musical-image-scanner.netlify.app/](https://musical-image-scanner.netlify.app/)

- Click `play`, and a song is played from a random image from [Unsplash](https://unsplash.com/). If you click the button again, the same song is played.

- If you press `stop`, audio is stopped. If you press `play` again, the song will start from the beginning.

- If you click `Load a new random image` a new random image is loaded, then you may click `play` again for a new song.

- If you click `Upload`, you may upload your own image. Then press `play`.

## How does it work?

- A random image is loaded from Unsplash, or a user uploads an image. 
- Within the code, each image is "split" into columns, and each column "split" into four rows. 
- The color values of each row are averaged, and then those numbers are interpolated (lerped) into frequency values which are fed into a synthesizer. 
- The result is four parts of music playing together.

## What tools are used?

- HTML, CSS, JavaScript, as well as the JavaScript libraries p5.js and Tone.js.

- The instruments used are guitar samples played by Devin Lane, and three instruments from Tone.js: a Karplus-String string synthesizer, a Frequency Modulator synth, and a "regular" synth. 

## What would you do if you had more time?

- Establish a musical frequency framework and perhaps use a 12-tone system. Currently each frequency is translated directly from a color value into a frequency and played as is. The resultant sound is very microtonal, which is evocative from one perspective, or slightly dissonant from another perspective. For example, a pitch of 474.88hz might be played, which lies between C#2 (497.87hz) and D2 (469.92) in an equal-tempered A440 tuning system.
- Include a "pause" function. This would allow you to stop a song, and then resume from the same position. Currently if you press `stop`, when you press `play` again, the song restarts.
- Add rhythm controls and include more tempo variability in the compositions. For example, a different data point such as line values could change the tempo of the piece of music.
- Allow different data pieces to modulate the effect parameters.
- Test on mobile and allow users to upload images with their phones.
- Add "image loaded" notifications when a new image is loaded. Make it clearer that the user should press `play` after the new image is loaded.
- Play with new tones, different synthesizers, new samples, different parameters of the synthesizers. More generally improve the musical composition. Perhaps include different presets the user may select.
- Explore possibilities of using machine learning image detection for examples such as "if there's a cat, play this noise". 

## Contact
Devin Lane
[https://www.devinlane.com/](https://www.devinlane.com/)
