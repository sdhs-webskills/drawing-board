let focus = 0;

const html = document.querySelector("html");
const body = document.querySelector("body");
const $canvasBox = document.querySelector("#canvas-box");
const $layerBox = document.querySelector("#layer-box");

const canvasArray = [document.querySelector("#canvas")];

const getCanvas = index => canvasArray[index ?? focus];
const getCtx = () => getCanvas().getContext("2d");
const initialize = () => [getCanvas(), getCtx()];

const clearCanvas = (canvas, ctx) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#333";
};

const setCanvas = canvas => {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid #333";
};

window.addEventListener("resize", event => {
    canvasArray.map((canvas, index) => {
        canvas.width = window.innerWidth / 2;
        canvas.height = window.innerHeight / 2;

        prevActivityArray[index].map(url => {
            const image = new Image();
            image.src = url;
            image.onload = () => canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        });
    });
});

const newCanvas = () => document.createElement("canvas");

let mouseDownCheck = false;

setCanvas(getCanvas());

getCtx().fillStyle = "white";
getCtx().fillRect(0, 0, getCanvas().width, getCanvas().height);
getCtx().fillStyle = "#333";

const prevActivityArray = [[getCanvas().toDataURL()]];
const nextActivityArray = [[]];

const layerRender = () => {
    $layerBox.innerHTML = "";

    canvasArray.forEach((canvas, index) => {
        $layerBox.insertAdjacentHTML("beforeend", `
            <div class="layer ${index === focus ? "focus-layer" : ""}">
                ${`<img src="${prevActivityArray[index].slice(-1)}">`}
                <p>새 레이어</p>
            </div>
        `);
    });
};
layerRender();

const canvasRender =  () => {
    $canvasBox.innerHTML = "";
    
    canvasArray.forEach(canvas => $canvasBox.append(canvas));
};
canvasRender();

const save = () => prevActivityArray[focus].push(getCanvas().toDataURL());
const prevActivity = () => {
    if(prevActivityArray[focus].length === 1) return;

    const [$canvas, ctx] = initialize();

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    nextActivityArray[focus].push(prevActivityArray[focus].pop());

    const image = new Image();
    image.src = prevActivityArray[focus].slice(-1);
    image.onload = () => ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height);
    layerRender();
};
const nextActivity = () => {
    if(nextActivityArray[focus].length === 0) return;
    
    const [$canvas, ctx] = initialize();
    
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    const image = new Image();
    image.src = nextActivityArray[focus].slice(-1);
    image.onload = () => ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height);

    prevActivityArray[focus].push(nextActivityArray[focus].pop());
    layerRender();
};

const getCanvasIndex = target => {
    for(let i = 0, limit = $layerBox.children.length; i < limit; i++) {
        const layer = $layerBox.children[i];

        if(layer === target) {
            return i;
        };
    }
};

html.addEventListener("mousedown", ({ target, clientX, clientY }) => {
    if(target.tagName.toLowerCase() !== "canvas") return;
    if(focus === null) return alert("레이어를 선택해주세요");

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
    if(mouseDownCheck) {
        mouseDownCheck = false;
        save();
        layerRender();
    };
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
    const canvas = newCanvas();
    setCanvas(canvas);

    canvasArray.push(canvas);
    prevActivityArray.push([canvas.toDataURL()]);
    nextActivityArray.push([]);
    
    canvasRender();
    layerRender();
};
const deleteLayer = () => {
    if(canvasArray.length === 1) return alert("마지막 레이어는 삭제할 수 없습니다");

    canvasArray.pop();
    prevActivityArray.pop();
    nextActivityArray.pop();
    
    canvasRender();
    layerRender();
};

const $addLayerButton = document.querySelector("#add-layer");
$addLayerButton.addEventListener("click", addLayer);

const $deleteLayerButton = document.querySelector("#delete-laeyr");
$deleteLayerButton.addEventListener("click", deleteLayer);

$layerBox.addEventListener("click", ({ target }) => {
    [...document.querySelectorAll(".layer")].map(layer => layer.classList.remove("focus-layer"));
    focus = null;

    if(target.classList.contains("layer")) {
        focus = getCanvasIndex(target);

        return target.classList.add("focus-layer");
    };

    if(!target.classList.contains("layer")) {
        if(target.parentNode.classList.contains("layer")) {
            focus = getCanvasIndex(target.parentNode);

            target.parentNode.classList.add("focus-layer");
        };
    };
});