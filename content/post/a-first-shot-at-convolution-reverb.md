+++
author = "Conrad Henry Appel, IV"
categories = ["Engaged Learning"]
date = 2016-07-27T00:00:00Z
description = ""
draft = false
slug = "a-first-shot-at-convolution-reverb"
tags = ["Engaged Learning"]
title = "A First Shot at Convolution Reverb"

+++

One of the DSP challenges I wanted to work on during this project was a real-time reverb - easy in concept, but a bit more challenging to execute.

Overview 
--------

At its heart, reverb is the result of a sound bouncing off of any number of surfaces in an environment - leaving behind echos that change the characteristics of the perceived sound. Each environment has its own characteristic echo, or impulse response. This led me to thinking that the most intuitive way to implement the reverb is through a convolution of the synthesizer's generated signals with a room's IR. 

I found a bunch of seemingly well-recorded impulse responses at [Echothief] recorded all over the world, from bridges to caves to racquetball courts. I decided to use one of the longer IRs from this collection to work with, as this poses a greater computational challenge and a more noticeable end effect.

The Naive Approach
------------------

The most obvious way to perform a convolution of two signals is by using the definition of convolution in the time-domain:

![Convolution Definition](/img/convdef.png)
    
This is the resulting code implemented in C++:

    vector<double> convolve(vector<double> a, vector<double> b) {
        vector<double> result;
        reverse(b.begin(), b.end());
        // create a resulting vector of the correct size, initialized to 0
        result.insert(result.begin(), a.size() + b.size() - 1, 0); 
        // perform the convolution
        for(int i = 0; i <  a.size() + b.size() - 1; i++) {
            int min = (i >= b.size()-1) ? i - (b.size()-1) : 0;
            int max = (i < a.size()-1) ? i : a.size()-1;
            for(int j = min; j <= max; j++) {
                result[i] += a[j] * b[i-j];
            }
        }
        return result;
    }

While this technique works, with any impulse response of more than a thousand samples or so (just a few milliseconds with a sample rate of 44100 Hz), the computation takes far too long to complete, and this poses a problem because the resulting instrument must feel like everything is happening in real-time. When analysing the algorithm, we can see that this delay occurs because it is an O(n^2) algorithm, so with each added sample, the number of calculations required increases exponentially. So, knowing this will only work with small IRs, we need to find another method to compute the convolutions.

Enter the Convolution Theorem...
--------------------------------

The Convolution Theorem states that you can do the same convolution as described above like so: take the Discrete Fourier Transform of both the input signal `x[n]` and the impulse response `h[n]`, then do a point-by-point multiplication of the resulting transforms (`Y[n] = X[n]H[n]`), and then calculate the Inverse Discrete Fourier Transform of the resulting vector `Y[n]` for the result.

In its simplest form, this process heavily reduces the amount of work needing to be done. The heaviest work is in the computation of the DFTs, each of whose runtime falls into O(nlogn), making the runtime of the entire algorithm also O(nlogn), much less than the time-domain convolution's O(n^2). On top of this, there are other optimizations that can be done. For example, the DFT of the IR can be precomputed and reused for each requested buffer, we can ignore very-high and very-low frequency content that falls outside of the range of human hearing since this is an audio project, we can utilize multiprocessing to share the work across processor cores, and we can split up the IR into blocks that don't need to be processed until they actually need to be output (we don't need the entire reverb all at once).

Current Status and Other Options
--------------------------------

At this point, I have the convolution reverb implemented and working. However, before I can commit it, I have to work through some optimization issues that might cause JACK to terminate the process due to it taking too much time to compute. I have a feeling these delays are being caused by internal memory allocations or deallocations in the C++ vector class, so I might have to switch to using simple dynamically-allocated arrays in order to fix the issues.

However, there is a chance that the computation of the FFT for every buffer also might be taking up too much time, and considering I'm working on a general-purpose OS unoptimized for realtime applications, I might need to look into other algorithms for computing a reverb to achieve my goal. Will update this post when more information is available.

[echothief]: http://www.echothief.com/ "Echothief"
[partitionedconv]: http://cnmat.berkeley.edu/system/files/attachments/main.pdf "Implementing Real-Time Partitioned Convolution Algorithms on Conventional Operating Systems"