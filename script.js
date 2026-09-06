/* =========================================================
   BUBBLE SORT VISUALIZER
   Vanilla JavaScript
   ========================================================= */


/* =========================================================
   STATE
   ========================================================= */

let originalArray = [
    55,
    23,
    78,
    12,
    90,
    34,
    5
];

let array = [...originalArray];

let i = 0;
let j = 0;

let comparisons = 0;
let swaps = 0;

let swapped = false;

let isRunning = false;
let isComplete = false;

let timer = null;

let speed = 500;


/* =========================================================
   DOM
   ========================================================= */

const arrayContainer =
    document.getElementById("arrayContainer");

const arrayInput =
    document.getElementById("arrayInput");

const applyBtn =
    document.getElementById("applyBtn");

const randomBtn =
    document.getElementById("randomBtn");

const clearBtn =
    document.getElementById("clearBtn");

const startBtn =
    document.getElementById("startBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const nextBtn =
    document.getElementById("nextBtn");

const resetBtn =
    document.getElementById("resetBtn");

const speedSlider =
    document.getElementById("speedSlider");

const speedValue =
    document.getElementById("speedValue");

const errorMessage =
    document.getElementById("errorMessage");

const explanation =
    document.getElementById("explanation");

const statusText =
    document.getElementById("statusText");

const sortStatus =
    document.getElementById("sortStatus");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const comparisonsEl =
    document.getElementById("comparisons");

const swapsEl =
    document.getElementById("swaps");

const currentPassEl =
    document.getElementById("currentPass");

const currentIndexEl =
    document.getElementById("currentIndex");

const arraySizeEl =
    document.getElementById("arraySize");

const executionStatusEl =
    document.getElementById("executionStatus");


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    renderArray();
    updateStats();
    updateButtons();
    highlightCode(1);

});


/* =========================================================
   RENDER ARRAY
   ========================================================= */

function renderArray(
    comparingIndexes = [],
    swappingIndexes = []
) {

    arrayContainer.innerHTML = "";

    const maxValue =
        Math.max(...array.map(value => Math.abs(value)), 1);

    array.forEach((value, index) => {

        const item =
            document.createElement("div");

        item.className = "array-item";

        /*
         * Mark sorted suffix.
         *
         * During Bubble Sort:
         * after each pass, the largest value
         * moves to the end.
         */
        if (
            isComplete ||
            index >= array.length - i
        ) {
            if (i > 0 || isComplete) {
                item.classList.add("sorted");
            }
        }

        if (comparingIndexes.includes(index)) {
            item.classList.add("comparing");
        }

        if (swappingIndexes.includes(index)) {
            item.classList.add("swapping");
        }

        const bar =
            document.createElement("div");

        bar.className = "array-bar";

        /*
         * Scale the bar between 40 and 220 px.
         */
        const height =
            40 +
            (
                Math.abs(value) / maxValue
            ) * 180;

        bar.style.height =
            `${height}px`;

        bar.textContent =
            value;

        const indexLabel =
            document.createElement("div");

        indexLabel.className =
            "array-index";

        indexLabel.textContent =
            `index ${index}`;

        item.appendChild(bar);
        item.appendChild(indexLabel);

        arrayContainer.appendChild(item);

    });

}


/* =========================================================
   ONE BUBBLE SORT STEP
   ========================================================= */

function nextStep() {

    if (isComplete) {
        return;
    }


    /*
     * If we reached the end of this pass
     */
    if (j >= array.length - i - 1) {

        /*
         * If nothing was swapped during this pass,
         * the array is already sorted.
         */
        if (!swapped) {

            finishSorting();
            return;
        }

        /*
         * Move to the next pass
         */
        i++;

        j = 0;

        swapped = false;

        if (i >= array.length - 1) {

            finishSorting();
            return;
        }

        updateExplanation(
            `เริ่ม Pass ${i + 1} — ตัวเลขที่มากที่สุดของส่วนที่เหลือจะถูกส่งไปด้านท้าย`
        );

        highlightCode(4);

        renderArray();

        updateStats();

        return;
    }


    /*
     * Compare arr[j] and arr[j + 1]
     */

    const left =
        array[j];

    const right =
        array[j + 1];

    comparisons++;

    highlightCode(9);

    renderArray(
        [j, j + 1],
        []
    );

    updateExplanation(
        `กำลังเปรียบเทียบ ${left} กับ ${right}`
    );

    updateStats();


    /*
     * Swap
     */

    if (left > right) {

        highlightCode(10);

        updateExplanation(
            `${left} มากกว่า ${right} → สลับตำแหน่งกัน 🔄`
        );

        renderArray(
            [j, j + 1],
            [j, j + 1]
        );

        array[j] =
            right;

        array[j + 1] =
            left;

        swaps++;

        swapped = true;

        highlightCode(13);

        updateStats();

    } else {

        updateExplanation(
            `${left} ≤ ${right} → ไม่ต้องสลับ`
        );

    }


    /*
     * Move to next pair
     */

    j++;

    highlightCode(7);

    renderArray();

    updateStats();

    updateProgress();

}


/* =========================================================
   AUTOMATIC SORTING
   ========================================================= */

function startSorting() {

    if (isComplete) {
        return;
    }

    if (isRunning) {
        return;
    }

    isRunning = true;

    executionStatusEl.textContent =
        "Running";

    statusText.textContent =
        "กำลังทำงาน...";

    sortStatus.textContent =
        "SORTING";

    sortStatus.className =
        "sort-status sorting";

    updateButtons();

    runNextStep();

}


function runNextStep() {

    if (!isRunning) {
        return;
    }

    if (isComplete) {
        return;
    }

    nextStep();

    if (isRunning && !isComplete) {

        timer =
            setTimeout(
                runNextStep,
                speed
            );

    }

}


/* =========================================================
   PAUSE
   ========================================================= */

function pauseSorting() {

    isRunning = false;

    clearTimeout(timer);

    timer = null;

    executionStatusEl.textContent =
        "Paused";

    statusText.textContent =
        "หยุดชั่วคราว";

    sortStatus.textContent =
        "PAUSED";

    sortStatus.className =
        "sort-status";

    updateButtons();

}


/* =========================================================
   FINISH
   ========================================================= */

function finishSorting() {

    isRunning = false;
    isComplete = true;

    clearTimeout(timer);

    timer = null;

    /*
     * Mark all elements sorted
     */
    i = array.length;

    j = 0;

    renderArray();

    updateProgress();

    highlightCode(20);

    updateExplanation(
        "🎉 Sorting Complete! ข้อมูลทั้งหมดถูกเรียงจากน้อยไปมากแล้ว"
    );

    statusText.textContent =
        "เรียงข้อมูลสำเร็จแล้ว!";

    sortStatus.textContent =
        "COMPLETE";

    sortStatus.className =
        "sort-status complete";

    executionStatusEl.textContent =
        "Complete";

    updateStats();

    updateButtons();

}


/* =========================================================
   RESET
   ========================================================= */

function resetSorting() {

    clearTimeout(timer);

    timer = null;

    isRunning = false;
    isComplete = false;

    array = [...originalArray];

    i = 0;
    j = 0;

    comparisons = 0;
    swaps = 0;

    swapped = false;

    statusText.textContent =
        "พร้อมเริ่มการเรียงข้อมูล";

    sortStatus.textContent =
        "READY";

    sortStatus.className =
        "sort-status";

    executionStatusEl.textContent =
        "Ready";

    updateExplanation(
        "💡 กด Start เพื่อเริ่มต้น Bubble Sort"
    );

    highlightCode(1);

    renderArray();

    updateStats();

    updateProgress();

    updateButtons();

}


/* =========================================================
   APPLY ARRAY
   ========================================================= */

function applyArray() {

    const input =
        arrayInput.value.trim();

    if (!input) {

        showError(
            "กรุณาใส่ตัวเลขอย่างน้อย 2 ตัว"
        );

        return;
    }


    const values =
        input
            .split(",")
            .map(value => value.trim())
            .filter(value => value !== "")
            .map(Number);


    const valid =
        values.length >= 2 &&
        values.length <= 30 &&
        values.every(
            value => Number.isFinite(value)
        );


    if (!valid) {

        showError(
            "กรุณาใส่ตัวเลข 2–30 ตัว และคั่นด้วย comma เช่น 55, 23, 78"
        );

        return;
    }


    originalArray =
        values.map(value => value);

    resetSorting();

    clearError();

}


/* =========================================================
   RANDOM ARRAY
   ========================================================= */

function generateRandomArray() {

    clearTimeout(timer);

    timer = null;

    isRunning = false;

    const size =
        Math.floor(
            Math.random() * 11
        ) + 5;

    const values = [];

    for (
        let index = 0;
        index < size;
        index++
    ) {

        values.push(
            Math.floor(
                Math.random() * 95
            ) + 5
        );

    }

    originalArray =
        values;

    arrayInput.value =
        values.join(", ");

    resetSorting();

}


/* =========================================================
   CLEAR
   ========================================================= */

function clearArray() {

    clearTimeout(timer);

    timer = null;

    isRunning = false;

    originalArray = [];

    array = [];

    i = 0;
    j = 0;

    comparisons = 0;
    swaps = 0;

    isComplete = false;

    arrayInput.value = "";

    arrayContainer.innerHTML = "";

    statusText.textContent =
        "ยังไม่มีข้อมูล";

    sortStatus.textContent =
        "EMPTY";

    sortStatus.className =
        "sort-status";

    executionStatusEl.textContent =
        "Empty";

    updateExplanation(
        "🧹 ข้อมูลถูกล้างแล้ว กรุณาใส่ตัวเลขใหม่"
    );

    updateStats();

    progressFill.style.width =
        "0%";

    progressText.textContent =
        "0%";

    updateButtons();

}


/* =========================================================
   SPEED
   ========================================================= */

speedSlider.addEventListener(
    "input",
    () => {

        /*
         * Slider:
         * 100 = fastest
         * 1500 = slowest
         */

        speed =
            Number(
                speedSlider.value
            );

        speedValue.textContent =
            `${speed} ms`;

    }
);


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

applyBtn.addEventListener(
    "click",
    applyArray
);

randomBtn.addEventListener(
    "click",
    generateRandomArray
);

clearBtn.addEventListener(
    "click",
    clearArray
);

startBtn.addEventListener(
    "click",
    startSorting
);

pauseBtn.addEventListener(
    "click",
    pauseSorting
);

nextBtn.addEventListener(
    "click",
    () => {

        if (!isRunning) {
            nextStep();
        }

    }
);

resetBtn.addEventListener(
    "click",
    resetSorting
);


/* =========================================================
   ENTER KEY
   ========================================================= */

arrayInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {
            applyArray();
        }

    }
);


/* =========================================================
   UPDATE STATS
   ========================================================= */

function updateStats() {

    comparisonsEl.textContent =
        comparisons;

    swapsEl.textContent =
        swaps;

    currentPassEl.textContent =
        isComplete
            ? "-"
            : i + 1;

    currentIndexEl.textContent =
        isComplete
            ? "-"
            : j;

    arraySizeEl.textContent =
        array.length;

}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress() {

    if (array.length < 2) {

        progressFill.style.width =
            "0%";

        progressText.textContent =
            "0%";

        return;
    }


    /*
     * Estimate progress based on comparisons.
     *
     * Maximum comparisons for Bubble Sort:
     *
     * n(n-1)/2
     */

    const maxComparisons =
        array.length *
        (array.length - 1) /
        2;

    let percentage =
        (
            comparisons /
            maxComparisons
        ) * 100;


    if (isComplete) {
        percentage = 100;
    }


    percentage =
        Math.min(
            100,
            Math.max(
                0,
                percentage
            )
        );


    progressFill.style.width =
        `${percentage}%`;

    progressText.textContent =
        `${Math.round(percentage)}%`;

}


/* =========================================================
   EXPLANATION
   ========================================================= */

function updateExplanation(
    message
) {

    explanation.innerHTML = `
        <span class="explanation-icon">💡</span>
        <span>${message}</span>
    `;

}


/* =========================================================
   CODE HIGHLIGHT
   ========================================================= */

function highlightCode(lineNumber) {

    const lines =
        document.querySelectorAll(
            "#codeBlock code span"
        );

    lines.forEach(
        line => {

            line.classList.remove(
                "active"
            );

        }
    );


    const activeLine =
        document.querySelector(
            `#codeBlock code span[data-line="${lineNumber}"]`
        );


    if (activeLine) {

        activeLine.classList.add(
            "active"
        );

    }

}


/* =========================================================
   ERROR
   ========================================================= */

function showError(
    message
) {

    errorMessage.textContent =
        message;

}


function clearError() {

    errorMessage.textContent =
        "";

}


/* =========================================================
   BUTTON STATE
   ========================================================= */

function updateButtons() {

    const hasData =
        array.length >= 2;


    startBtn.disabled =
        !hasData ||
        isRunning ||
        isComplete;


    pauseBtn.disabled =
        !isRunning;


    nextBtn.disabled =
        !hasData ||
        isRunning ||
        isComplete;


    resetBtn.disabled =
        !hasData;


    clearBtn.disabled =
        array.length === 0;

}
