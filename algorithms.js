// Every algorithm here sorts a COPY of the array and records each step.
// It never touches the screen. main.js plays the recorded steps back.
//
// Step types
//   { type: "compare", i, j }     looking at a[i] and a[j]
//   { type: "swap", i, j }        exchange a[i] and a[j]
//   { type: "write", i, value }   set a[i] = value  (useful for merge sort)
//   { type: "sorted", i }         a[i] is now in its final position

function bubbleSort(input) {
  const a = input.slice();
  const steps = [];
  const n = a.length;

  for (let end = n - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      steps.push({ type: "compare", i, j: i + 1 });
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        steps.push({ type: "swap", i, j: i + 1 });
        swapped = true;
      }
    }
    steps.push({ type: "sorted", i: end });

    // No swaps in a full pass means everything left is already in order.
    if (!swapped) {
      for (let k = end - 1; k >= 0; k--) steps.push({ type: "sorted", i: k });
      return steps;
    }
  }
  if (n > 0) steps.push({ type: "sorted", i: 0 });
  return steps;
}

function selectionSort(input) {
  const a = input.slice();
  const steps = [];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ type: "compare", i: min, j });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      steps.push({ type: "swap", i, j: min });
    }
    steps.push({ type: "sorted", i });
  }
  if (n > 0) steps.push({ type: "sorted", i: n - 1 });
  return steps;
}

function insertionSort(input) {
  const a = input.slice();
  const steps = [];
  const n = a.length;

  for (let i = 1; i < n; i++) {
    // Walk a[i] left until the value before it is not larger.
    let j = i;
    while (j > 0) {
      steps.push({ type: "compare", i: j - 1, j });
      if (a[j - 1] <= a[j]) break;
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      steps.push({ type: "swap", i: j - 1, j });
      j--;
    }
  }
  for (let k = 0; k < n; k++) steps.push({ type: "sorted", i: k });
  return steps;
}

// Add new algorithms here, and a matching <option> in index.html.
const ALGORITHMS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
};
