+++
author = "Conrad Henry Appel, IV"
categories = ["web audio api", "Engaged Learning"]
date = 2017-04-12T00:00:00Z
description = ""
draft = false
slug = "drawsyn-design"
tags = ["web audio api", "Engaged Learning"]
title = "DrawSyn"

+++

DrawSyn is an experimental music-creation machine written for modern web browsers with three main components: a sequencer, a "drawable" waveform, and various slider controls for modifying the sound.

[![DrawSyn Header](/img/drawsyn-1.png)](https://conradhappeliv.com/drawsyn/)

<iframe width="560" height="315" src="https://www.youtube.com/embed/YdHWEAewGHQ" frameborder="0" allowfullscreen></iframe>

### Concept

It started out as an idea while doing research for my Engaged Learning project. I felt like creativity was stifled when limited to the generic four predefined waveforms present on most synthesizers (sine, sawtooth, triangle, and square waves - perhaps noise also). Sure, a musician could use a sampler to load up a custom waveform, but options for modifying the sound after the fact are generally limited to speeding up or slowing down the sample in order to change its pitch. Plus, modifying the waveform in realtime is nearly impossible.

Another creativity-limiting component of nearly every musical instrument used in modern Western music is the twelve-tone temperament, in which there are 12 predefined semitones per octave, and any note that falls outside of those pitches is seen as out-of-tune. While it is still possible to be very creative using the 12-tone scale, I believe there is a relatively-unexplored realm of music to be found in microtonality.

Lastly, in general, it's generally pretty difficult for people who are trained on a specific instrument (or not at all) to pick up a new instrument and be able to make musical sounds on it.

With these previous limitations in mind, I came up with three unique components for this synthesizer:

1. Realtime-drawable waveforms
2. Adjustable microtonal scales
3. Accessible dot sequencer

### Design

A large goal of this mini-project was to design an "instrument" that anyone could easily dive into to make some unique sounds. As soon as someone loads the page for the first time, they are given a very brief walkthrough (implemented using [Intro.js](http://introjs.com/)), after which they can go right into creating sounds. In order to maximize accessibility, I wanted to create a fully-touchable interface. Touching any of the controls has an immediate effect on the sounds being played. I used a stark white on almost-black color scheme to signify that any object on the webpage can be clicked/touched. The entirety of the interface is implemented so that anyone with no knowledge of music theory or synthesizers can still easily use the application.

### Implementation

The entirely of the project was created in vanilla HTML5, CSS3, & Javascript (ES6), so it should run on most modern web browsers without a hitch (it was tested most extensively on Chrome 57). The audio system is handled by the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), with a custom oscillator built inside a [Script Processor Node](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode). 

The Web Audio API actually provides support to use custom waveforms as oscillators like I'm doing. Weirdly enough, it only provides this support if you supply your waveform in the frequency domain. I chose to implement my own oscillator because should I have used the [PeriodicWave](https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave) class from the Web Audio API, I would constantly need to be performing Fourier Transforms of the user's input and the browser would subsequently need to constantly be performing inverse transforms. This seems like it would be very inefficient in the end.

A big implementation problem is adapting the user's drawn waveform to be used at any frequency as required by the input to the synthesizer (in this case, the dot sequencer). As an easy, efficient solution, I use [linear interpolation](https://en.wikipedia.org/wiki/Interpolation#Linear_interpolation) to estimate what value the waveform should hold at any continuous point along the line. Using this technique, I can resample a waveform with any arbitrary length to any other length in order to accurate synthesize specific frequencies. For example, assuming a 44100 Hz sampling rate, if the user's waveform is 1024 samples long, I could resample it into a length of 100 samples necessary per period to create a 441 Hz frequency.

A couple of things had to be done to make the website mobile-friendly. First off, the interface had to be fully responsive - each component had to scale to whatever screen size the user may be using. Secondly, the audio system had to use a larger buffer size to give the less-performant mobile devices more time to do the necessary processing. Unfortunately, this comes at the expense of a larger latency between when a control is pressed and when a change is heard. However, for this type of application, the latency gain doesn't have a hugely negative effect on the overall quality of the instrument.

The sequencer is simply an array of CSS-styled HTML `<div>`s that when clicked set a corresponding boolean in a 2D array. From this array, each column is triggered all at once when its beat comes up. For each dot that is flipped on in that column, the frequency played is a function of the "octave" and "difference" controls. Octave determines the lowest note possible in the sequencer (defaulting to 440 Hz, or an A note), and difference determines the offset in frequency for each note above the bottom (from 10 Hz to 200 Hz).

### Results

In the end, this project turned out better than I had originally imagined it. After spending a short amount of time playing around with the controls, the user can create all sorts of cool patterns, ranging from percussive drum-like beats to spooky melodies to morphing soundscapes and more.

The limitations of the application actually seem to be its strength in that it helps the user to let go of what they are used to and to fully unlock their creativity. It is incredibly easy to make "mistakes" that turn out to sound good in the end.

![Happy accidents](/content/images/2017/04/happyaccidents-1.jpg)

### Future Work

* Presets, Loading/Saving, & Sharing (through custom links)
* Waveform drawing via "nodes", rather than free-draw
* More intelligent buffer size choices
* Browser compatibility checks/warnings


Check out the project here: https://conradhappeliv.com/drawsyn/