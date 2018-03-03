+++
author = "Conrad Henry Appel, IV"
categories = ["Engaged Learning"]
date = 2016-06-15T00:00:00Z
description = ""
draft = false
slug = "midsummer-progress-report"
tags = ["Engaged Learning"]
title = "Midsummer Progress Report"

+++

As of now, I've got most of the functionality for the first goal created and working.

Basic Synthesis
---------------

Right now, the synthesis is done in the time domain. The process is as follows: check the controller's axis positions and use them to calculate what the pitch should be, and then until the given buffer size is full, generate one period of the signal at a time. The amount of samples required for each buffer depends on the current sample rate and frequency, and is related by `floor(sampleRate/freq)`. So, for example, in order for a 440 Hz sine wave to fill up a 1024 sample buffer at a sample rate of 44100 Hz, the current code will call the synthesis method 11 times, each time adding 100 samples to the buffer using this formula: `cos(i*2*Pi* freq/sampleRate)`. This leads to the following result in the buffer:

![Sine Synthesis](/img/sin0.png)

<audio src="/snd/sin.wav" controls>

The same process is followed for each other type of basic wave type. For the square wave, the sine wave formula is simply rounded to -1 or 1. 

![Square Synthesis](/img/square0.png)

<audio src="/snd/square.wav" controls>

For a sawtooth wave, the following formula is employed, which is basically the formula for a straight line: `i*freq/sampleRate*2 - 1`

![Sawtooth Synthesis](/img/sawtooth0.png)

<audio src="/snd/saw.wav" controls>

And then for a simple triangle wave, there are two stages: for half the samples, it uses the sawtooth formula, and then for the second half, it uses a reversed sawtooth formula: `-1*((i-sampleRate/freq/2)*2/*sampleRate/freq*2 - 1)`.

![Triangle Synthesis](/img/triangle0.png)

<audio src="/snd/tri.wav" controls>


Wave Morphing
-------------

To create a more unique and controllable sound, we can combine all the waves together. With the default control positions (meaning each wave is at .25 amplitude, when 1 is the maximum amplitude), this is the result we get:

![Combined Wave](/img/combinedwave0.png)

From here, it is super easy to morph the wave using a single joystick on the controller - each direction (up/down/left/right) is assigned a different wave to emphasize, and the formula to adjust all four waves is as such, where ampx and ampy are determined the positions of the 2D joystick and overallamp is determined by the left trigger: 

    Sine: overallamp * (.5 + .5 * ampy)
    Square: overallamp * (.5 + .5 * ampy * -1)
    Sawtooth: overallamp * (.5 + .5 * ampx)
    Triangle: overallamp * (.5 + .5 * ampx * -1)
    
> _It's worth mentioning here that at least for now, one of the triggers on the controller has been reserved for a volume control, as it seems necessary to enable the user to have any control over dynamics - an essential aspect of music. This may change later when more filters are implemented that may replace the overall volume control._

The result is sometimes unexpected due to the constructive and destructive interference caused by peaks and troughs lining up when adding the waves - *I think there's potential here for further exploration*.

Portamento
----------

Portamento, or pitch smoothing, is handled by this line:

    if (smoothing && !pitch_snap) newfreq = (newfreq * (1 - smoothing) + prev_freq * (1 + smoothing)) / 2.;
    
The `smoothing` variable can also be read as a "rate of change". That is, if set to 0, the pitch will change instantly to the new value. If set close to 1, the perceived pitch will take an incredibly long time to reach the newly-calculated pitch (and if set to 1, will never even move).
 
 Currently, this is only enabled when pitch snap isn't. In the future, this may change - especially when different scales are implemented into the pitch snapping. However, currently, it makes the pitch snapping continue to sound like a theremin, instead of moving between distinct notes.

Misc Basic Controls
-------------------

The basic joystick API provided in the Linux kernel doesn't report button press or button release events, but you still want to do certain events only once on a button press or release, so we have to implement this functionality ourselves. In order to accomplish this, I wrote a callback mechanism that calls a function when a button is reported as having a different value than the last report. This mechanism allows for super easy assignment of controls to functions, as demonstrated in this snippet:

    js.set_button_press_callback(0, [&mod_on]() { mod_on = true; });
    js.set_button_release_callback(0, [&mod_on]() { mod_on = false; });
    js.set_button_press_callback(1, [&pitch_snap]() { pitch_snap = !pitch_snap; });
    js.set_button_press_callback(2, [&](){ if(octave > lowest_octave) octave--; });
    js.set_button_press_callback(3, [&](){ if(octave < highest_octave) octave++; });
    js.set_button_press_callback(9, [&pitch_lock]() { pitch_lock = !pitch_lock; });
    js.set_button_press_callback(10, [&wave_lock]() { wave_lock = !wave_lock; });
    
As seen in this example, a bunch of functions could be set-up for the controller in one line each. Pressing A turns on frequency modulation, and then releasing it turns it off. Pressing B toggles pitch-snapping (covered below). Pressing X lowers the pitch by an octave, and pressing Y raises it. Pressing the left stick locks the course pitch. Pressing the right stick freezes the current wave type.

The `octave` variable is used in the determination of course pitch - for each octave higher, the pitch is doubled, and for each octave lower, the pitch is halved.

The pitch and wave lock switches simply hold the previous values of pitch and wave amplitudes, respectively, skipping new 

The pitch snap and modulation implementations are described below.

Pitch Snap
----------

The basic principle of the pitch snapping is rounding the current value of the course pitch to one that's known. This allows the user to use the synthesizer more like a real tuned instrument, instead of like a theremin. The ratios used to determine the pitches to round to are those described on the [Interval (Music)][interval] Wikipedia page. Then, finding the appropriate pitch to round to is as simple as using C++'s algorithm for finding the first element lower than our current pitch value in the vector of known pitches (`lower_bound`) and checking the upper and lower value to see which is closer.

Later, I will be able to simulate different scales by removing certain pitches from the known-pitches array.

Modulation
----------

The modulation feature most commonly present in modern synthesizers is that which changes the frequency up and down at a relatively low frequency in order to create a "wobbly" effect. To implement this, we have a representation of a LFO within our Synthesizer class, in which the current position determines what the current adjustment to pitch should be. After each period of the wave is requested (as described above), the position in the LFO is advanced the same number of samples in the returned period and the next period multiplies its pitch by the value of the LFO at the new position.

The values in the LFO range from about 0.933033 to about 1.07177, which is approximately the same distance above and below the reference pitch when you take into account the logarithmic pattern perceived pitch values follow.

Current Problems
----------------

Right now, there's a big flaw in the basic synthesis routine caused by rounding of numbers. When adjusting pitch on a fine scale, this snippet of code used to generate a single period of samples causes problems: 

    for(int i = 0; i < sampleRate/freq; i++)
    
For example, if the sample rate is fixed at 44100 Hz, any frequency between about 436.637 Hz and 441 Hz will cause the period to be 100 samples. Once you move ever so slightly outside of this range, there's a distinct "snap" that occurs when the number of samples changes.

A few ideas I've thought of to deal with this issue: 
    
* extend the current method to generate individual periods of the same frequency until the remainders lines up again
* use the remainder from the sample amount as a sort of offset/phase in the next period's calculation
* consider switching over to generating buffers in the frequency domain, which already has phase built into the complex number domain



[interval]: https://en.wikipedia.org/wiki/Interval_(music)Size_of_intervals_used_in_different_tuning_systems "Interval (Music)"