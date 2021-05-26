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

let drawable = false;

const reset = function () {
    [...tools.children].forEach((data) => data.style.background = "#fff");
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    colorBtn.value = "#000000"
    size.value = 2;
    ctx.lineWidth = 1;

    canvas.removeEventListener("mousedown", drawListener);
    canvas.removeEventListener("mousemove", drawListener);
    window.removeEventListener("mouseup", drawListener);
    canvas.removeEventListener("mouseenter", drawListener);
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
            if (drawable)
                draw(e);
            break;
        case "mouseup":
            drawable = false;
            break;
        case "mouseleave":
            ctx.beginPath();
            break;
    }
};

const initDraw = function (e) {
    ctx.beginPath();
    drawable = true;
    ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
};

const draw = function (e) {
    ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    ctx.stroke();
};

reset();

tools.addEventListener("click", function ({ target }) {
    reset();
    target.parentNode.style.background = "#eee";

    switch (target.parentNode.classList[0]) {
        case "pencil":
            canvas.addEventListener("mousemove", drawListener);
            canvas.addEventListener("mouseleave", drawListener);
            canvas.addEventListener("mousedown", drawListener);
            window.addEventListener("mouseup", drawListener);
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

size.addEventListener("change", function() {
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
