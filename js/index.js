const html = document.querySelector("html");
const body = document.querySelector("body");
const $canvas = document.querySelector("#canvas");
const ctx = $canvas.getContext("2d");
const prevActivityArray = [$canvas.toDataURL()];
const nextActivityArray = [];

ctx.fillStyle = "#333";

let mouseDownCheck = false;

$canvas.width = window.innerWidth;
$canvas.height = window.innerHeight;

const save = () => prevActivityArray.push($canvas.toDataURL());
const prevActivity = () => {
    if(prevActivityArray.length !== 0) {
        nextActivityArray.push(prevActivityArray.pop());

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);
        ctx.fillStyle = "#333";

        const image = new Image();
        image.src = prevActivityArray.slice(-1);
        image.onload = () => ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height);
    };
};
const nextActivity = () => {
    if(nextActivityArray.length !== 0) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);
        ctx.fillStyle = "#333";

        const image = new Image();
        image.src = nextActivityArray.slice(-1);
        image.onload = () => ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height);

        prevActivityArray.push(nextActivityArray.pop());
    };
};

$canvas.addEventListener("mousedown", event => {
    mouseDownCheck = true;

    if(nextActivityArray.length !== 0) nextActivityArray.length = 0;
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
});

$canvas.addEventListener("mousemove", event => {
    if(mouseDownCheck) {
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    };
});

$canvas.addEventListener("mouseup", event => {
    mouseDownCheck = false;
    save();
});

let ctrlCheck = false;
let shiftCheck = false;

window.addEventListener("keyup", ({ key }) => {
    if(key === "Control") ctrlCheck = false;
    if(key === "Shift") shiftCheck = false;
});

window.addEventListener("keydown", ({ key }) => {
    if(key === "Control") ctrlCheck = true;
    if(key === "Shift") shiftCheck = true;

    if(key === "z" && ctrlCheck) return prevActivity();
    if(key === "Z" && ctrlCheck && shiftCheck) return nextActivity();
});