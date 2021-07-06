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

const shapeX = document.querySelector(".shapeX");
const shapeY = document.querySelector(".shapeY");
const diameter = document.querySelector(".diam"); 
const resetBtn = document.querySelector(".resetBtn");

const container = document.querySelector(".container");

let drawable = false;
let tool = "";
let shape = "";
let color = "#000";
let fill = true;

let start = { X: 0, Y: 0 };
let move = { X: 0, Y: 0 };

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
    shapeX.value = "shapeX: ";
    shapeY.value = "shapeY: ";
    diameter.value = "원의 지름: ";

    canvas.removeEventListener("mousedown", Listener);
    canvas.removeEventListener("mousemove", Listener);

    window.removeEventListener("mousemove", Listener);
    window.removeEventListener("mouseup", Listener);

};

const saveReset = function () {
    photoBox.innerHTML = '';
    title.value = '';
};

const downDraw = function () {
    drawable = true;

    ctx.beginPath();
    ctx.moveTo(start.X, start.Y);
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

const outRect = function(){
    if(move.X < 0){
        move.X = 0;
    }
    if(move.X > canvas.width){
        move.X = canvas.width;
    }
    if(move.Y < 0){
        move.Y = 0;
    }
    if(move.Y > canvas.height){
        move.Y = canvas.height;
    }
}


// previewShape
const moveShapes = function (e) {
    e.preventDefault();

    [...container.children].filter((data) => {
        if (data.classList.contains("rect") || data.classList.contains("circ")) data.remove();
    });
    

    if (start.X !== 0 && start.Y !== 0 && move.X !== 0 && move.Y !== 0) {
        if (shape === "rectangle") {
            const div = document.createElement("div");

            div.style.border = `3px dotted #000`;
            div.classList.add("rect");

            container.append(div);
            
            outRect();

            if (move.X - start.X < 0) {
                div.style.left = (start.X + canvas.offsetLeft) - (move.X - start.X) * -1 + 1 + "px";
                div.style.width = (move.X - start.X) * -1 + "px";
            } else {
                div.style.left = start.X + canvas.offsetLeft + 1 + "px";
                div.style.width = move.X - start.X + "px";
            }

            if (move.Y - start.Y < 0) {
                div.style.top = (start.Y + canvas.offsetTop) - (move.Y - start.Y) * -1 + 1 + "px";
                div.style.height = (move.Y - start.Y) * -1 + "px";
            } else {
                div.style.top = start.Y + canvas.offsetTop + 1 + "px";
                div.style.height = move.Y - start.Y + "px";
            }

            const x = move.X - start.X;
            const y = move.Y - start.Y;

            shapeX.value = x < 0 ? `shapeX: ${x*-1}` : `shapeX: ${x}`;
            shapeY.value = y < 0 ? `shapeY: ${y*-1}` : `shapeY: ${y}`;
            

        } else {
            const div = document.createElement("div");

            div.style.border = `3px dotted ${color}`;
            div.classList.add("circ");

            container.append(div);

            
            const width = move.X - start.X;
            const height = width;
            const top = start.Y + canvas.offsetTop;
            const left = start.X + canvas.offsetLeft;
            
            if (move.X - start.X > 0) {
                div.style.top = top - width + 1 + "px";
                div.style.left = left + 1 + "px";
                div.style.width = width + "px";
                div.style.height = height + "px";
            } else {
                div.style.top = top - width * -1 + 1 + "px";
                div.style.left = left - width * -1 + 1 + "px";
                div.style.width = width * -1 + "px";
                div.style.height = height * -1 + "px";
            }

            if (move.Y - start.Y > 0) {
                div.style.top = top + 1 + "px";
            }

            const diam = move.X - start.X;
            diameter.value = diam < 0 ? `원의 지름: ${diam*-1}` : `원의 지름: ${diam}`;
        };
    };
};


const upShapes = function () {
    [...container.children].filter((data) => {
        if (data.classList.contains("rect") || data.classList.contains("circ")) data.remove();
    });

    if (start.X !== 0 && start.Y !== 0) {
        const width = move.X - start.X;
        const height = move.Y - start.Y;
        if (shape === "rectangle") {
            if (fill) {
                ctx.fillRect(start.X, start.Y, width, height);
            } else {
                ctx.strokeRect(start.X, start.Y, width, height);
            }
        } else {
            const top = start.Y;
            const left = start.X;

            let x = 0;
            let y = 0;
            
            if (move.X - start.X > 0) {
                x = left + (width/2);
                y = top - width / 2;
            } else {
                x = left + (width/2);
                y = top + (width / 2);
            }
            
            if (move.Y - start.Y > 0) {
                y = top + width / 2;
            }
            
            if(move.X - start.X < 0 && move.Y - start.Y > 0){
                y = top - (width / 2);
            }

            const radius = width / 2 < 0 ? (width / 2)*-1 : width / 2; 
            
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);

            if (fill) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    }

    ctx.beginPath();
    start = { X: 0, Y: 0 };
};

const Listener = function (e) {
    switch (e.type) {
        case "mousedown":
            start.X = e.clientX - canvas.offsetLeft;
            start.Y = e.clientY - canvas.offsetTop;

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
            move.X = e.clientX - canvas.offsetLeft
            move.Y = e.clientY - canvas.offsetTop

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
    if(tool === "shapes"){
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
    }

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

window.addEventListener("keydown", function({ key }){
    if(key === "Escape"){
        savePopup.classList.add("none");
        saveReset();
    }
});


resetBtn.addEventListener("click", function () {
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
});

window.addEventListener("blur", () => drawable = false);