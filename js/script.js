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

const canvasEvent =  {
    drawable: false,
    tool: "",
};
const shapeEvent = {
    shape: "",
    color: "#000",
    fill: true,
    perfect: false,
};

const start = { X: 0, Y: 0 };
const move = { X: 0, Y: 0 };

const reset = function () {
    [...tools.children].forEach((data) => data.style.background = "#fff");
    [...bor.children].forEach(({ style }) => style.background = "#fff");

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 10;

    colorBtn.value = "#000000";

    size.value = 10;

    shapeEvent.color = "#000";
    shapeEvent.shape = "";
    shapeEvent.fill = true;
    canvasEvent.tool = "";
    shapeX.value = "shapeX: ";
    shapeY.value = "shapeY: ";
    diameter.value = "원의 지름: ";
    start.X = 0;
    start.Y = 0;
    move.X = 0;
    move.Y = 0;
};

const saveReset = function () {
    photoBox.innerHTML = '';
    title.value = '';
};

const downDraw = function () {
    canvasEvent.drawable = true;

    ctx.beginPath();
    ctx.moveTo(start.X, start.Y);
};

const downShapes = () => {
    ctx.beginPath();
    canvasEvent.drawable = true;
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
        if (shapeEvent.shape === "rectangle") {
            const div = document.createElement("div");

            div.style.border = `3px dotted #000`;
            div.classList.add("rect");

            container.append(div);
            
            outRect();

            const cooX = start.X + canvas.offsetLeft + 1;
            const cooY = start.Y + canvas.offsetTop + 1;

            const shaWidth = move.X - start.X;
            const shaHeight = move.Y - start.Y;

            div.style.left = shaWidth < 0 ? cooX + shaWidth  + "px" : cooX + "px";
            div.style.width = shaWidth < 0 ? shaWidth * -1 + "px" : shaWidth + "px";
            div.style.top = shaHeight < 0 ? cooY + shaHeight + "px" : cooY + "px";
            div.style.height = shaHeight < 0 ? shaHeight * -1 + "px" : shaHeight + "px";


            shapeX.value = shaWidth < 0 ? `shapeX: ${shaWidth*-1}` : `shapeX: ${shaWidth}`;
            shapeY.value = shaHeight < 0 ? `shapeY: ${shaHeight*-1}` : `shapeY: ${shaHeight}`;
            

        } else {
            const div = document.createElement("div");

            div.style.border = `3px dotted ${shapeEvent.color}`;
            div.classList.add("circ");

            container.append(div);
            
            const width = move.X - start.X;
            const height = move.Y - start.Y;
            const top = start.Y + canvas.offsetTop + 1;
            const left = start.X + canvas.offsetLeft + 1;

            div.style.top = width < 0 ?  top + width + "px" : top - width + "px";
            div.style.left = width < 0 ?  left + width + "px" : left + "px";
            div.style.width = width < 0 ?  width * -1 + "px" : width + "px";
            div.style.height = width < 0 ?  width * -1 + "px" : width + "px";

            if (height > 0) div.style.top = top + 1 + "px";

            diameter.value = width < 0 ? `원의 지름: ${width*-1}` : `원의 지름: ${width}`;
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
        if (shapeEvent.shape === "rectangle") {

            if (shapeEvent.fill) {
                ctx.fillRect(start.X, start.Y, width, height);
            } else {
                ctx.strokeRect(start.X, start.Y, width, height);
            }

        } else {
            const top = start.Y;
            const left = start.X;

            let x = 0;
            let y = 0;

            x = left + width / 2;

            // +, +
            if(width > 0 && height > 0){
                y = top + width / 2;
            }
            // -, +
            if(width < 0 && height > 0){
                y = top - width / 2;
            }
            // +, -
            if(width > 0 && height < 0){
                y = top - width / 2;
            }
            // -, -
            if(width < 0 && height < 0){
                y = top + width / 2;
            }

            const radius = width / 2 < 0 ? (width / 2)*-1 : width / 2; 
            
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);

            if (shapeEvent.fill) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    }

    ctx.beginPath();
    start.X = 0;
    start.Y = 0;
};

const Listener = function (e) {
    if(e.type === "mousedown"){
        start.X = e.clientX - canvas.offsetLeft;
        start.Y = e.clientY - canvas.offsetTop;
    
        canvasEvent.drawable = true;
    
        if (canvasEvent.tool === "pencil") {
            downDraw(e);
            return false;
        };
        if (canvasEvent.tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            downDraw(e);
            return false;
        };
        if (canvasEvent.tool === "shapes") {
            downShapes(e);
            return false;
        };

        return false;
    };

    if(e.type === "mousemove"){
        move.X = e.clientX - canvas.offsetLeft
        move.Y = e.clientY - canvas.offsetTop

        if (canvasEvent.drawable) {
            if (canvasEvent.tool === "pencil") {
                moveDraw(e);
                return false;
            }
            if (canvasEvent.tool === "eraser") {
                moveClear(e);
                return false;
            }
            if (canvasEvent.tool === "shapes") {
                moveShapes(e);
                return false;
            }
        }

        return false;
    };

    if(e.type === "mouseup"){
        canvasEvent.drawable = false;

        if (canvasEvent.tool === "pencil") {
            return false;
        }
        if (canvasEvent.tool === "eraser") {
            ctx.globalCompositeOperation = "source-over";
            return false;
        }
        if (canvasEvent.tool === "shapes") {
            upShapes(e);
            return false;
        }

        return false;
    };
};

tools.addEventListener("click", function ({ target }) {
    reset();

    const parent = target.parentNode;
    parent.style.background = "#eee";

    if(parent.classList[0] === "pencil") canvasEvent.tool = "pencil"; 
    if(parent.classList[0] === "eraser") canvasEvent.tool = "eraser"; 
    if(parent.classList[0] === "rectangle"){
        canvasEvent.tool = "shapes";
        shapeEvent.shape = "rectangle";
        bor.children[0].style.background = "#eee";
    };

    if(parent.classList[0] === "circle"){
        canvasEvent.tool = "shapes";
        shapeEvent.shape = "circle";
        bor.children[0].style.background = "#eee";
    };


    canvas.addEventListener("mousedown", Listener);
    canvas.addEventListener("mousemove", Listener);
    window.addEventListener("mousemove", Listener);
    window.addEventListener("mouseup", Listener);
});

bor.addEventListener("click", function ({ target }) {
    if(canvasEvent.tool === "shapes"){
        [...bor.children].forEach(({ style }) => style.background = "#fff");
    
        const parent = target.parentNode;
    
        switch (parent.classList[0]) {
            case "fill":
                shapeEvent.fill = true;
                parent.style.background = "#eee";
                break;
            case "border":
                shapeEvent.fill = false;
                parent.style.background = "#eee";
                break;
        };
    };

});


colorBtn.addEventListener("change", function () {
    shapeEvent.color = colorBtn.value;

    ctx.fillStyle = shapeEvent.color;
    ctx.strokeStyle = shapeEvent.color;
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

window.addEventListener("keydown", ({key})=> { if(key ==="Shift") shapeEvent.perfect = true });
window.addEventListener("keyup", ({key})=> { if(key ==="Shift") shapeEvent.perfect = false });

window.addEventListener("blur", () => canvasEvent.drawable = false);