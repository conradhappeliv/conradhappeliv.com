+++
author = "Conrad Henry Appel, IV"
categories = ["Engaged Learning"]
date = 2016-04-12T00:00:00Z
description = ""
draft = false
slug = "deliverable-goal-1"
tags = ["Engaged Learning"]
title = "Deliverable Goal #1"

+++

My first goal for a deliverable for the project will be based off of this image, which is itself based off of many traditional synthesizer configurations.<!--more-->

![Xbox Layout for Goal 1](/img/xboxlayout.png)

Description of Controls
-----------------------

* Left joystick: pitch control
    
    Push up for a higher pitch, down for a lower pitch.
    
* Right joystick: waveform select

    Fade between different waveforms, each with its individual sound characteristics. For example, this may mean you can push up for a square wave, right for a sinusoid, down for a triangle wave, and left for a sawtooth wave. If you move between two of the directions, the resulting wave will have characteristics of each around it.
    
* Left trigger & shoulder button: "Depth" filter

    My initial idea of this is something like a reverb or delay that adds depth to a potentially otherwise-boring signal. This could also be something like Frequency Modulation, with the axis controlling either peak frequency deviation or frequency of the carrier wave. The shoulder button would switch between "effects".
    
* Right trigger & shoulder button: "Brightness" filter

    This control follows the same pattern as the left trigger. However, this control would most likely drive an attenuating filter such as a low-pass, high-pass, band-pass, or band-stop filter.
    
* "A" button: vibrato

    As commonly controlled by a modulation wheel on traditional synthesizers. Creates a wobbly, more unstable sound created by modulating the frequency of the main signal with another low-frequency signal.
    
* "B" button: pitch snap toggle
 
    Turns on or off pitch snapping to a predefined musical scale. When off, the instrument will sound more like a theremin. When on, the pitch of the instrument will "bounce" between defined notes on a musical scale.
    
* "X" button: move octave down

    Adjust the current base octave down by one. Should be easily achievable by simply dividing frequencies by 2 for each octave down.
    
* "Y" button: move octave up

    Opposite of X button.
    
* D-pad: pitch snap scale

    Used to define which notes the B button's pitch snap should adhere to. Left and right buttons will modulate key (A, A&#9839;, B, etc), and up and down buttons will choose the type of scale (major, minor, pentatonic, etc).
    
* "Select" button: hold all axes

    Will "freeze" any non-toggleable controls to free up fingers for other controls. In the current layout, would most likely freeze pitch, filters, vibrato, and waveform select.
    
    
I believe this list of controls will give me a lot to work on in the coming months. Once I get all of these implemented, I think I will have the knowledge to implement whatever I can dream of and be more creative with the device.