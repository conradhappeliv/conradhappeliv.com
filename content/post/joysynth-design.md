+++
author = "Conrad Henry Appel, IV"
categories = ["Engaged Learning", "web audio api", "gamepad api"]
date = 2017-04-14T00:00:00Z
description = ""
draft = false
slug = "joysynth-design"
tags = ["Engaged Learning", "web audio api", "gamepad api"]
title = "JoySynth"

+++

The instrument that originally started out as a native C++ application has transformed into a more robust, "multiplayer" web instrument. Use it to generate menacing basslines, a lonely robot whining, all of BB-8's voice lines, and more.

### Concept

The main concept of this instrument experiment is to use any game controller as an interface to create music. In this case, I mimic a keyboard synthesizer, but instead the keys and knobs with the buttons and axes available on the controller. However, this concept could also be generalized to other situations, such as using the controller as a MIDI controller or as an effects controller like the [Korg Kaossilator](http://www.korg.com/us/products/dj/kaossilator2/). 

### Usage

To use the JoySynth, all you have to do is go to [/joysynth/](https://conradhappeliv.com/joysynth/) and connect any standard controller (such as an Xbox 360 controller). As soon as you do, you can start making sounds by pulling the right trigger, which acts as a cutoff for a low-pass filter (and a stand-in for volume in this case). Pitch is controlled using the left joystick, and current octave is switched using the X and Y buttons. The left trigger activates a delay effect that really beefs up the sound. You can change the current waveform by moving the right joystick in any direction (top-right for "smooth" sounds and bottom-left for "harsh" sounds). You can also turn on a pitch snap by pressing the start button and changing the scale by using the D-Pad.

Then, you can add more controllers for more sound. Either you can have others play with you, or you can use all the controllers yourself by locking sounds in and changing them one at a time (lock using the LB, RB, RS, and A buttons)

### Implementation

The entirety of the project is implemented in HTML5/CSS3/JS (ES6) utilizing the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) and [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API).

#### Audio Node Graph

Here is a basic diagram of how the nodes in the Web Audio graph are laid out for each separate controller:

    |->sin osc------\
    |->square osc----\             delay2--\ 
    |                merger-->LPF--|    |   compressor-->gain-->out
    |->sawtooth osc--/             delay1--/
    |->triangle osc-/
    |
    ^ LFO (fed into osc frequencies for pitch modulation)

Then, the culmination of all the controllers are connected as such:

    JoySynth1 ------\
    JoySynth2 -------\
                      merger---->compressor----> output
    JoySynth3 -------/
    JoySynth4 ------/

#### Update Loop

The information from the controller is updated in the animation loop of the browser using `requestAnimationFrame()`. First, I check to see if there are any new gamepads connected or if any gamepads were disconnected. Next, during each frame the relevant nodes in the audio graph are updated with values based on that frame's controller values, such as the oscillator frequencies or the filter's cutoff. 

#### Design Decisions

First off, I chose to replace a plain volume control with a low-pass filter and a cutoff control. I did this because I felt that in the end, both controls achieved the same goal, but having a filter allowed the user to be more expressive with the sound. Not only does changing the cutoff affect the perceived volume, but it adds "warmth" by boosting frequencies near the cutoff, giving the sound a sort of resonance. Plus, it gives the user extra control over the overall frequency content of the signal separate from the waveform control.

Second, I believe it was important to add the pitch snap feature - meaning that instead of a continuous set of available frequencies, the pitch control is limited to set values on a scale. Maintaining a consistent in-tune pitch is slightly tougher using the small joystick on the controller when compared to an actual physical instrument. However, it can still be necessary to be in tune when playing with other musicians, and this feature enables that.

The configuration that the controls are mapped to is designed to be as intuitive as possible to anyone, but especially those who've played any modern game with a controller. Controls that are meant to be "toggleable" or only active when held are mapped to buttons and controls that should have a continuous range of values are mapped to continuous controls such as joysticks or triggers. In video games, the left joystick is always mapped to the character's main movement, and in JoySynth, the left joystick is also mapped to the main pitch control. Also in video games, the main action is commonly mapped to the right trigger, and in JoySynth, the main volume/cutoff control is too. The other controls also have similar feelings to other controls that you might find in games.

While not perfect, I believe that allowing up to four controllers was an important feature as it makes for a much more viable instrument. For as long as it's been around, music has largely been about collaborating and creating with other people, and this feature allows people to do just that. It's even possible for everyone, regardless of skill level, to always be mostly in tune with everyone else by using the pitch snap feature.

##### Feature List

* LPF
* Delay
* Pitch snap (with multiple scales)
* Octave up/down
* Wave-shaping
* Locks for most controls

### Future Work

* Better UI (it's still hard for people to pick it up and play)
* Effects other than delay (maybe chosen using the unused D-Pad buttons)
* Fix volume issues (it's hard to distinguish between users)
* Create a more dynamic user-interface (icons fading between colors)

Plug in a controller (or 4!) and check out the project at https://conradhappeliv.com/joysynth/