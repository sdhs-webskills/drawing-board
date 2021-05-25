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


let pos = {
    drawable: false,
    x: -1,
    y: -1
};

const reset = function () {
    [...tools.children].forEach((data) => data.style.background = "#fff");
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    colorBtn.value = "#000000"
    size.value = 1;
    ctx.lineWidth = 1;

    canvas.removeEventListener("mousedown", drawListener);
    canvas.removeEventListener("mousemove", drawListener);
    canvas.removeEventListener("mouseup", drawListener);
    canvas.removeEventListener("mouseout", drawListener);
};

const saveReset = function(){
    photoBox.innerHTML = '';
    title.value ='';
}

const drawListener = function (e) {
    switch (e.type) {
        case "mousedown":
            initDraw(e);
            break;
        case "mousemove":
            if (pos.drawable)
                draw(e);
            break;
        case "mouseup":
            finishDraw();
            break;
        case "mouseout":
            finishDraw();
            break;
    }
};

const initDraw = function (e) {
    ctx.beginPath();
    pos.drawable = true;
    let coors = getPosition(e);
    pos.X = coors.X;
    pos.Y = coors.Y;
    ctx.moveTo(pos.X, pos.Y);
};

const draw = function (e) {
    let coors = getPosition(e);
    ctx.lineTo(coors.X, coors.Y);
    pos.X = coors.X;
    pos.Y = coors.Y;
    ctx.stroke();
};

const finishDraw = function () {
    pos.drawable = false;
    pos.X = -1;
    pos.Y = -1;
};

const getPosition = function (e) {
    return {
        X: e.pageX - canvas.offsetLeft,
        Y: e.pageY - canvas.offsetTop
    };
};

reset();

tools.addEventListener("click", function ({ target }) {
    reset();
    target.parentNode.style.background = "#eee";

    switch (target.parentNode.classList[0]) {
        case "pencil":
            canvas.addEventListener("mousedown", drawListener);
            canvas.addEventListener("mousemove", drawListener);
            canvas.addEventListener("mouseup", drawListener);
            canvas.addEventListener("mouseout", drawListener);
            break;
        case "eraser":

            break;
        case "rectangle":

            break;
        case "circle":

            break;
    };
});


colorBtn.addEventListener("change", function () {
    ctx.fillStyle = colorBtn.value;
    ctx.strokeStyle = colorBtn.value;
});

size.addEventListener("change", () => {
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

downloadBtn.addEventListener("click", function(){
    let dataURL = canvas.toDataURL('image/png');
    
    let aTag = document.createElement('a');
    aTag.download = title.value;
    aTag.href = dataURL;
    aTag.click();

    closeBtn.click();
})

closeBtn.addEventListener("click", function(){
    savePopup.classList.toggle("none");
    saveReset();
})
