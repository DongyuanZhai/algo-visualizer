// The player: takes the steps recorded by algorithms.js and shows them.

const SIZE = 30;

const barsEl = document.getElementById("bars");
const algoEl = document.getElementById("algo");
const speedEl = document.getElementById("speed");
const playBtn = document.getElementById("play");
const captionEl = document.getElementById("caption");
const comparisonsEl = document.getElementById("comparisons");
const writesEl = document.getElementById("writes");
const stepNumEl = document.getElementById("stepNum");
const stepTotalEl = document.getElementById("stepTotal");

let original = []; // the unsorted array we started from
let steps = [];    // every step the algorithm recorded
let cursor = 0;    // how many steps have been applied so far
let timer = null;  // non-null while playing
let bars = [];
let cur = null;    // cached state after `cur.k` steps, so playing forward is O(1) per frame

function randomArray(n) {
  return Array.from({ length: n }, () => 5 + Math.floor(Math.random() * 96));
}

function reset(newArray) {
  pause();
  if (newArray) {
    original = randomArray(SIZE);
    barsEl.innerHTML = "";
    bars = original.map(() => {
      const bar = document.createElement("div");
      bar.className = "bar";
      barsEl.appendChild(bar);
      return bar;
    });
  }
  steps = ALGORITHMS[algoEl.value](original);
  cursor = 0;
  cur = null;
  render();
}

// Return the state after k steps.
// Moving forward applies only the new steps to the cached state.
// Moving backward replays from the start, which is rare and still fast.
function stateAt(k) {
  if (!cur || k < cur.k) {
    cur = { a: original.slice(), sorted: new Set(), comparisons: 0, writes: 0, k: 0 };
  }
  for (; cur.k < k; cur.k++) {
    const st = steps[cur.k];
    if (st.type === "compare") {
      cur.comparisons++;
    } else if (st.type === "swap") {
      [cur.a[st.i], cur.a[st.j]] = [cur.a[st.j], cur.a[st.i]];
      cur.writes += 2; // a swap writes two cells
    } else if (st.type === "write") {
      cur.a[st.i] = st.value;
      cur.writes++;
    } else if (st.type === "sorted") {
      cur.sorted.add(st.i);
    }
  }
  return { ...cur, last: steps[k - 1] };
}

function describe(st, a) {
  if (cursor === 0) return "Press Play to start.";
  if (cursor >= steps.length) return "Done. The array is sorted.";
  switch (st.type) {
    case "compare": return `Compare ${a[st.i]} and ${a[st.j]}`;
    case "swap":    return `Swap ${a[st.j]} and ${a[st.i]}`;
    case "write":   return `Write ${st.value} into position ${st.i}`;
    case "sorted":  return `${a[st.i]} is now in its final position`;
    default:        return "";
  }
}

function render() {
  const { a, sorted, comparisons, writes, last } = stateAt(cursor);

  bars.forEach((bar, idx) => {
    bar.style.height = a[idx] + "%";
    bar.className = "bar";
    if (sorted.has(idx)) bar.classList.add("sorted");
    if (last && (last.type === "compare" || last.type === "swap") &&
        (idx === last.i || idx === last.j)) {
      bar.classList.add(last.type);
    }
    if (last && last.type === "write" && idx === last.i) bar.classList.add("swap");
  });

  captionEl.textContent = describe(last, a);
  comparisonsEl.textContent = comparisons;
  writesEl.textContent = writes;
  stepNumEl.textContent = cursor;
  stepTotalEl.textContent = steps.length;
  playBtn.textContent = timer ? "Pause" : (cursor >= steps.length ? "Replay" : "Play");
}

// Speed slider 1..100 maps to roughly 580ms..10ms per step.
function delay() {
  return Math.round(600 * Math.pow(0.96, Number(speedEl.value)));
}

function tick() {
  cursor++;
  if (cursor >= steps.length) pause();
  render();
  if (timer) timer = setTimeout(tick, delay());
}

function play() {
  if (cursor >= steps.length) cursor = 0;
  timer = setTimeout(tick, delay());
  render();
}

function pause() {
  clearTimeout(timer);
  timer = null;
}

function stepBy(delta) {
  pause();
  cursor = Math.min(steps.length, Math.max(0, cursor + delta));
  render();
}

playBtn.addEventListener("click", () => {
  if (timer) { pause(); render(); } else { play(); }
});
document.getElementById("next").addEventListener("click", () => stepBy(1));
document.getElementById("prev").addEventListener("click", () => stepBy(-1));
document.getElementById("shuffle").addEventListener("click", () => reset(true));
algoEl.addEventListener("change", () => reset(false)); // same array, new algorithm

// Keyboard shortcuts. Ignored inside the slider and dropdown so they keep
// their native arrow-key behaviour. A focused button already handles Space
// itself, so we skip it there to avoid toggling twice.
document.addEventListener("keydown", (e) => {
  const tag = e.target.tagName;
  if (tag === "INPUT" || tag === "SELECT") return;
  if (e.key === " ") {
    if (tag === "BUTTON") return;
    e.preventDefault();
    playBtn.click();
  } else if (e.key === "ArrowRight") {
    stepBy(1);
  } else if (e.key === "ArrowLeft") {
    stepBy(-1);
  }
});

reset(true);
