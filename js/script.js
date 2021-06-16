const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const tools = document.querySelector(".tools");
const size = document.querySelector(".size input");
const colorBtn = document.querySelector(".sub-tool .color_btn");

const savePopup = document.querySelector(".save");
const closeBtn = document.querySelector(".save #close");
const photoBox = document.querySelector(".save .photo-box");
const downloadBtn = document.querySelector(".save #download");
const title = document.querySelector(".save .title")

const xx = document.querySelector(".x");
const yy = document.querySelector(".y");
const resetBtn = document.querySelector(".resetBtn");

let drawable = false;
let tool = "";
let shape = "";
let color = "";

let rec = { X: 0, Y: 0 }
let pos = { X: 0, Y: 0 }

const reset = function (e) {
    [...tools.children].forEach((data) => data.style.background = "#fff");
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    colorBtn.value = "#000000"
    size.value = 10;
    ctx.lineWidth = 10;
    color = "";
    shape = "";
    tool = "";

    canvas.removeEventListener("mousedown", Listener);
    window.removeEventListener("mousemove", Listener);
    canvas.removeEventListener("mousemove", Listener);
    window.removeEventListener("mouseup", Listener);

};

const saveReset = function () {
    photoBox.innerHTML = '';
    title.value = '';
}

const downDraw = function (e) {
    ctx.beginPath();
    drawable = true;
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
};

const downShapes = function (e) {
    ctx.beginPath();
    drawable = true;
    rec.X = e.clientX - canvas.offsetLeft
    rec.Y = e.clientY - canvas.offsetTop
};



const moveDraw = function (e) {
    e.preventDefault();
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
};

const moveClear = function(e){
    e.preventDefault();
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
}

const moveShapes = function (e) {
    e.preventDefault();
    // if (pos.X !== 0 && pos.Y !== 0) {
    //     if (shape === "rectangle") {
    //         ctx.clearRect(rec.X, rec.Y, pos.X - rec.X, pos.Y - rec.Y);
    //     }
    // }
    pos = {
        X: e.clientX - canvas.offsetLeft,
        Y: e.clientY - canvas.offsetTop
    }
    if (shape === "rectangle") {
        ctx.fillRect(rec.X, rec.Y, pos.X - rec.X, pos.Y - rec.Y);
    } else {
        ctx.lineWidth = 1;
        ctx.arc((pos.X - rec.X), (pos.Y - rec.Y), (pos.X - rec.X) / 2, 0, Math.PI * 2);
        ctx.stroke();
    }
}


const upShapes = function () {
    ctx.beginPath();
    pos = { X: 0, Y: 0 }
    rec = { X: 0, Y: 0 }
}


const Listener = function(e){
    switch (e.type) {
        case "mousedown":

            drawable = true; 
            if(tool == "pencil"){
                downDraw(e);
            } else if(tool == "eraser"){
                ctx.globalCompositeOperation = "destination-out";
                downDraw(e);
            } else if(tool == "shapes"){
                downShapes(e);
            }
            break;

        case "mousemove":

            if(drawable){
                if(tool == "pencil"){
                    moveDraw(e);
                } else if(tool == "eraser"){
                    moveClear(e);
                } else if(tool == "shapes"){
                    // ctx.globalCompositeOperation = "source-out";
                    moveShapes(e);                    

                }
            }
            break;

        case "mouseup":
            drawable = false;
            if(tool == "pencil"){

            } else if(tool == "eraser"){
                ctx.globalCompositeOperation="source-over";
            } else if(tool == "shapes"){
                // ctx.globalCompositeOperation = "source-out";
                // ctx.globalCompositeOperation = "source-out";
                upShapes();
            }

    }
};

tools.addEventListener("click", function ({ target }) {
    reset();
    target.parentNode.style.background = "#eee";

    switch (target.parentNode.classList[0]) {
        case "pencil":
            tool = "pencil";
            break;
        case "eraser":
            tool = "eraser";
            break;
        case "rectangle":
            tool = "shapes";
            shape = "rectangle";
            break;
        case "circle":
            tool = "shapes";
            shape = "circle";
            break;
    };

    canvas.addEventListener("mousedown", Listener);
    window.addEventListener("mousemove", Listener);
    canvas.addEventListener("mousemove", Listener);
    window.addEventListener("mouseup", Listener);
});



colorBtn.addEventListener("change", function () {
    ctx.fillStyle = colorBtn.value;
    color = colorBtn.value;
    ctx.strokeStyle = colorBtn.value;
});

size.addEventListener("change", function () {
    ctx.lineWidth = size.value;
});

canvas.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    savePopup.classList.toggle("none")

    let dataURL = canvas.toDataURL('image/png');
    let imgTag = document.createElement('img');
    imgTag.setAttribute("src", dataURL);

    photoBox.append(imgTag);
});

downloadBtn.addEventListener("click", function () {
    let dataURL = canvas.toDataURL('image/png');

    let aTag = document.createElement('a');
    aTag.download = title.value;
    aTag.href = dataURL;
    aTag.click();

    closeBtn.click();
})

closeBtn.addEventListener("click", function () {
    savePopup.classList.toggle("none");
    saveReset();
})



canvas.addEventListener("mousemove", function (e) {
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    xx.value = `x: ${x}`;
    yy.value = `y: ${y}`;
});

resetBtn.addEventListener("click", function () {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
});

window.addEventListener("blur", () => drawable = false);