let focus = 0;

const html = document.querySelector("html");
const body = document.querySelector("body");
const layerBox = document.querySelector("#layer-box");

const canvasArray = [document.querySelector("#canvas")];

const getCanvas = index => canvasArray[index ?? focus];
const getCtx = () => getCanvas().getContext("2d");
const initialize = () => [getCanvas(), getCtx()];

const setCanvasSize = (canvas, width, height) => {
    canvas.width = width;
    canvas.height = height;
};

const newCanvas = () => document.createElement("canvas");

getCtx().fillStyle = "#333";

let mouseDownCheck = false;

getCanvas().width = window.innerWidth / 2;
getCanvas().height = window.innerHeight / 2;
getCanvas().style.border = "1px solid #333";

const prevActivityArray = [[getCanvas().toDataURL()]];
const nextActivityArray = [[]];

const layerRender = () => {
    layerBox.innerHTML = "";

    canvasArray.forEach((canvas, index) => {
        layerBox.insertAdjacentHTML("beforeend", `
            <div class="layer">
                ${prevActivityArray[index] !== undefined ? `<img src="${prevActivityArray[index].slice(-1)}">` : ""}
            </div>
        `);
    });
};
layerRender();

const clearCanvas = (canvas, ctx) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#333";
};

const save = () => prevActivityArray[focus].push(getCanvas().toDataURL());
const prevActivity = () => {
    if(prevActivityArray[focus].length === 1) return;

    const [$canvas, ctx] = initialize();

    clearCanvas($canvas, ctx);

    nextActivityArray[focus].push(prevActivityArray[focus].pop());

    const image = new Image();
    image.src = prevActivityArray[focus].slice(-1);
    image.onload = () => ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height);
    layerRender();
};
const nextActivity = () => {
    if(nextActivityArray[focus].length === 0) return;
    
    const [$canvas, ctx] = initialize();
    
    clearCanvas($canvas, ctx);

    const image = new Image();
    image.src = nextActivityArray[focus].slice(-1);
    image.onload = () => ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height);

    prevActivityArray[focus].push(nextActivityArray[focus].pop());
    layerRender();
};

html.addEventListener("mousedown", ({ target, clientX, clientY }) => {
    if(target.tagName.toLowerCase() !== "canvas") return;

    const [, ctx] = initialize();

    mouseDownCheck = true;

    if(nextActivityArray.length !== 0) nextActivityArray[focus].length = 0;
    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
});

html.addEventListener("mousemove", ({ target, clientX, clientY }) => {
    if(mouseDownCheck) {
        const [, ctx] = initialize();

        ctx.lineTo(clientX, clientY);
        ctx.stroke();
    };
});

html.addEventListener("mouseup", () => {
    mouseDownCheck = false;
    save();
    layerRender();
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

const addLayer = () => {
    canvasArray.push(newCanvas());
    
    layerRender();
};
const deleteLayer = () => {
    canvasArray.length !== 1 ? canvasArray.pop() : alert("마지막 레이어는 삭제할 수 없습니다");
    
    layerRender();
};

const $addLayerButton = document.querySelector("#add-layer");
$addLayerButton.addEventListener("click", addLayer);

const $deleteLayerButton = document.querySelector("#delete-laeyr");
$deleteLayerButton.addEventListener("click", deleteLayer);