# Algorithm Visualizer

Watch sorting algorithms work, one step at a time.

**Live demo:** https://dongyuanzhai.github.io/algo-visualizer

## Features

- Bubble, selection and insertion sort
- Play, pause, step forward and step back
- Speed slider
- Live count of comparisons and array writes
- Keyboard shortcuts: Space to play or pause, Left and Right arrows to step
- Light and dark mode, works on phones

## How it works

Each algorithm in `algorithms.js` sorts a copy of the array and records every step (compare, swap, write, sorted) into a list. It never touches the screen. `main.js` plays that list back, which makes pausing and stepping backwards easy.

## Run locally

Open `index.html` in a browser. No build step, no dependencies.

## Adding an algorithm

1. Write a function in `algorithms.js` that returns a list of steps
2. Add it to the `ALGORITHMS` object at the bottom of that file
3. Add an `<option>` to the dropdown in `index.html`
