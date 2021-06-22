const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const tools = document.querySelector(".tools");
const size = document.querySelector(".size input");
const bor = document.querySelector(".bor");
const colorBtn = document.querySelector(".sub-tool .color_btn");

const savePopup = document.querySelector(".save");
const closeBtn = document.querySelector(".save #close");
const photoBox = document.querySelector(".save .photo-box");
const downloadBtn = document.querySelector(".save #download");
const title = document.querySelector(".save .title");

const mouseX = document.querySelector(".x");
const mouseY = document.querySelector(".y");
const resetBtn = document.querySelector(".resetBtn");

const container = document.querySelector(".container");

let drawable = false;
let tool = "";
let shape = "";
let color = "#000";
let fill = true;

let rec = { X: 0, Y: 0 };
let pos = { X: 0, Y: 0 };

const reset = function () {
    [...tools.children].forEach((data) => data.style.background = "#fff");
    [...bor.children].forEach(({ style }) => style.background = "#fff");

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 10;

    colorBtn.value = "#000000";

    size.value = 10;

    color = "#000";
    shape = "";
    tool = "";
    fill = true;

    canvas.removeEventListener("mousedown", Listener);
    canvas.removeEventListener("mousemove", Listener);

    window.removeEventListener("mousemove", Listener);
    window.removeEventListener("mouseup", Listener);

};

const saveReset = function () {
    photoBox.innerHTML = '';

    title.value = '';
};

const downDraw = function (e) {
    drawable = true;

    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
};

const downShapes = () => {
    ctx.beginPath();

    drawable = true;
};

const moveDraw = function (e) {
    e.preventDefault();

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
};

const moveClear = function (e) {
    e.preventDefault();

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
};

// previewShape
const moveShapes = function (e) {
    e.preventDefault();

    [...container.children].filter((data) => {
        if (data.classList.contains("rect") || data.classList.contains("circ")) data.remove();
    });

    pos = {
        X: e.clientX - canvas.offsetLeft,
        Y: e.clientY - canvas.offsetTop
    };

    if (rec.X !== 0 && rec.Y !== 0 && pos.X !== 0 && pos.Y !== 0) {
        if (shape === "rectangle") {
            const div = document.createElement("div");

            div.style.border = `3px dotted ${color}`;
            div.classList.add("rect");

            container.append(div);

            if (pos.X - rec.X < 0) {
                div.style.left = (rec.X + canvas.offsetLeft) - (pos.X - rec.X) * -1 + 1 + "px";
                div.style.width = (pos.X - rec.X) * -1 + "px";
            } else {
                div.style.left = rec.X + canvas.offsetLeft + 1 + "px";
                div.style.width = pos.X - rec.X + "px";
            }

            if (pos.Y - rec.Y < 0) {
                div.style.top = (rec.Y + canvas.offsetTop) - (pos.Y - rec.Y) * -1 + 1 + "px";
                div.style.height = (pos.Y - rec.Y) * -1 + "px";
            } else {
                div.style.top = rec.Y + canvas.offsetTop + 1 + "px";
                div.style.height = pos.Y - rec.Y + "px";
            }
            console.log(pos.X - rec.X);

        } else {
            const div = document.createElement("div");

            div.style.border = `3px dotted ${color}`;
            div.classList.add("circ");

            container.append(div);

            if (pos.X - rec.X < 0) {
                // div.style.top = (rec.Y + canvas.offsetTop) - (pos.X - rec.X) * -1 + 1 + "px";
                div.style.left = (rec.X + canvas.offsetLeft) - (pos.X - rec.X) * -1 + 1 + "px";
                div.style.width = (pos.X - rec.X) * -1 + "px";
                div.style.height = (pos.X - rec.X) * -1 + "px";
            } else {
                // div.style.top = (rec.Y + canvas.offsetTop) - (pos.X - rec.X) + 1 + "px";
                div.style.left = rec.X + canvas.offsetLeft + 1 + "px";
                div.style.width = pos.X - rec.X + "px";
                div.style.height = pos.X - rec.X + "px";
            }

            if (pos.Y - rec.Y < 0) {
                div.style.top = (rec.Y + canvas.offsetTop) - (pos.X - rec.X) + 1 + "px";
            } else {
                div.style.top = rec.Y + canvas.offsetTop + 1 + "px";
            }

        };
    };
};


const upShapes = function (e) {
    [...container.children].filter((data) => {
        if (data.classList.contains("rect") || data.classList.contains("circ")) data.remove();
    });

    if (rec.X !== 0 && rec.Y !== 0 && pos.X !== 0 && pos.Y !== 0) {
        if (shape === "rectangle") {
            if (fill) {
                ctx.fillRect(rec.X, rec.Y, pos.X - rec.X, pos.Y - rec.Y);
            } else {
                ctx.strokeRect(rec.X, rec.Y, pos.X - rec.X, pos.Y - rec.Y);
            }
        } else {
            // ctx.arc(rec.X + (pos.X - rec.X) / 2, rec.Y + (pos.Y - rec.Y) / 2, (pos.X - rec.X) / 2, 0, Math.PI * 2, true);

            // if (fill) {
            //     ctx.fill();
            // } else {
            //     ctx.stroke();
            // }
        }
    }

    ctx.beginPath();
    pos = { X: 0, Y: 0 };
    rec = { X: 0, Y: 0 };
};

const Listener = function (e) {
    switch (e.type) {
        case "mousedown":
            rec.X = e.clientX - canvas.offsetLeft;
            rec.Y = e.clientY - canvas.offsetTop;
            drawable = true;

            if (tool === "pencil") {
                downDraw(e);
                return false;
            }
            if (tool === "eraser") {
                ctx.globalCompositeOperation = "destination-out";
                downDraw(e);
                return false;
            }
            if (tool === "shapes") {
                downShapes(e);
                return false;
            }
            break;

        case "mousemove":

            if (drawable) {
                if (tool === "pencil") {
                    moveDraw(e);
                    return false;
                }
                if (tool === "eraser") {
                    moveClear(e);
                    return false;
                }
                if (tool === "shapes") {
                    moveShapes(e);
                    return false;
                }
            }
            break;

        case "mouseup":
            drawable = false;

            if (tool === "pencil") {
                return false;
            }
            if (tool === "eraser") {
                ctx.globalCompositeOperation = "source-over";
                return false;
            }
            if (tool === "shapes") {
                upShapes(e);
                return false;
            }

    }
};

tools.addEventListener("click", function ({ target }) {
    reset();

    const parent = target.parentNode;

    parent.style.background = "#eee";

    switch (parent.classList[0]) {
        case "pencil": tool = "pencil"; break;
        case "eraser": tool = "eraser"; break;
        case "rectangle":
            tool = "shapes";
            shape = "rectangle";
            bor.children[0].style.background = "#eee";
            break;
        case "circle":
            tool = "shapes";
            shape = "circle";
            bor.children[0].style.background = "#eee";
            break;
    };

    canvas.addEventListener("mousedown", Listener);
    canvas.addEventListener("mousemove", Listener);
    window.addEventListener("mousemove", Listener);
    window.addEventListener("mouseup", Listener);
});

bor.addEventListener("click", function ({ target }) {
    document.querySelector(".tools .rectangle>img").click();

    [...bor.children].forEach(({ style }) => style.background = "#fff");

    const parent = target.parentNode;

    switch (parent.classList[0]) {
        case "fill":
            fill = true;
            parent.style.background = "#eee";
            break;
        case "border":
            fill = false;
            parent.style.background = "#eee";
            break;
    };
});

colorBtn.addEventListener("change", function () {
    color = colorBtn.value;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
});

size.addEventListener("change", function () {
    ctx.lineWidth = size.value;
});

canvas.addEventListener('contextmenu', function (e) {
    e.preventDefault();

    savePopup.classList.toggle("none");

    const dataURL = canvas.toDataURL('image/png');
    const imgTag = document.createElement('img');
    imgTag.setAttribute("src", dataURL);

    photoBox.append(imgTag);
});

downloadBtn.addEventListener("click", function () {
    const dataURL = canvas.toDataURL('image/png');

    const aTag = document.createElement('a');
    aTag.download = title.value;
    aTag.href = dataURL;
    aTag.click();

    closeBtn.click();
});

closeBtn.addEventListener("click", function () {
    savePopup.classList.toggle("none");

    saveReset();
});

canvas.addEventListener("mousemove", function (e) {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    mouseX.value = `x: ${x}`;
    mouseY.value = `y: ${y}`;
});

resetBtn.addEventListener("click", function () {
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
});

window.addEventListener("blur", () => drawable = false);