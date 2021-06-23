HTMLCanvasElement.prototype.rect = function() { return this.getBoundingClientRect(); };

let focus = 0;

const html = document.querySelector("html");
const body = document.querySelector("body");
const $canvasBox = document.querySelector("#canvas-box");
const $layerBox = document.querySelector("#layer-box");

const canvasArray = [document.querySelector("#canvas")];

const getCanvas = index => canvasArray[index ?? focus];
const getCtx = () => getCanvas().getContext("2d");
const initialize = () => [getCanvas(), getCtx()];
const newCanvas = () => document.createElement("canvas");
const setCanvas = canvas => {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    canvas.style.position = "absolute";
    canvas.style.zIndex = 100;
    canvas.style.border = "1px solid #333";
};

let mouseDownCheck = false;
let isShape = false;
let isEraser = false;
let ctrlCheck = false;
let shiftCheck = false;
let fillMode = "fill"

setCanvas(getCanvas());

const prevActivityArray = [[getCanvas().toDataURL()]];
const nextActivityArray = [[]];

const layerRender = () => {
    $layerBox.innerHTML = "";

    canvasArray.forEach((canvas, index) => {
        $layerBox.insertAdjacentHTML("beforeend", `
            <div class="layer ${index === focus ? "focus-layer" : ""}" ${canvasArray.length !== 1 ? `draggable="true"` : ""}>
                ${`<img src="${prevActivityArray[index].slice(-1)}">`}
                <p>새 레이어</p>
            </div>
        `);
    });
};
layerRender();

const canvasRender =  () => {
    $canvasBox.innerHTML = "";
  
    canvasArray.map(canvas => {
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = localStorage.getItem("lineWidth") ?? 1;
        ctx.fillStyle = localStorage.getItem("fillStyle") ?? "#333";
        ctx.strokeStyle = localStorage.getItem("color");
    });

    canvasArray.forEach(canvas => $canvasBox.append(canvas));
};
canvasRender();

const render = () => {
    layerRender();
    canvasRender();
};

const drawImage = (url, canvas, ctx) => {
    const image = new Image();
    image.src = url;
    image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

const save = () => prevActivityArray[focus].push(getCanvas().toDataURL());
const prevActivity = () => {
    if(prevActivityArray[focus].length === 1) return;

    const [canvas, ctx] = initialize();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nextActivityArray[focus].push(prevActivityArray[focus].pop());

    drawImage(prevActivityArray[focus].slice(-1), canvas, ctx);

    layerRender();
};
const nextActivity = () => {
    if(nextActivityArray[focus].length === 0) return;
    
    const [canvas, ctx] = initialize();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawImage(nextActivityArray[focus].slice(-1), canvas, ctx);
    
    prevActivityArray[focus].push(nextActivityArray[focus].pop());

    layerRender();
};

const getCanvasIndex = target => {
    for(let i = 0, limit = $layerBox.children.length; i < limit; i++) {
        const layer = $layerBox.children[i];

        if(layer === target) return i;
    }
};

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
    if(focus === null) return alert("삭제할 레이어를 선택해주세요");

    canvasArray.splice(focus, 1);
    prevActivityArray.splice(focus, 1);
    nextActivityArray.splice(focus, 1);
    
    canvasRender();
    layerRender();
};

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

window.addEventListener("resize", () => {
    canvasArray.map((canvas, index) => {
        setCanvas(canvas);
        
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const image = new Image();
        image.src = prevActivityArray[index].slice(-1);
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    });
});

window.addEventListener("blur", () => mouseDownCheck === true ? mouseDownCheck = !mouseDownCheck : true);

window.addEventListener("contextmenu", event => event.preventDefault());

let shape = null;
let x1;
let y1;
let x2;
let y2;

html.addEventListener("mousedown", ({ target, clientX, clientY }) => {
    if(target.tagName.toLowerCase() !== "canvas") return;
    if(focus === null) return alert("레이어를 선택해주세요");

    const [canvas, ctx] = initialize();

    mouseDownCheck = true;

    if(nextActivityArray.length !== 0) nextActivityArray[focus].length = 0;

    x1 = clientX;
    y1 = clientY;

    ctx.globalCompositeOperation="source-over";

    if(isEraser) ctx.globalCompositeOperation="destination-out";

    if(isShape === true && document.querySelector("#frame") === null) {
        const frame = document.createElement("div");
        frame.setAttribute("id", "frame");
        frame.style.top = 0;
        frame.style.width = window.innerWidth / 2 + "px";
        frame.style.height = window.innerHeight / 2 + "px";
        frame.style.overflow = "hidden";

        setCanvas(frame);

        shape = document.createElement("div");
        shape.style.position = "absolute";
        shape.style.left = x1 + "px";
        shape.style.top = y1 + "px";
        shape.style.border = "1px dotted #333";

        frame.append(shape);

        body.append(frame);

        return;
    };

    ctx.beginPath();
    ctx.moveTo(clientX, clientY);
});

html.addEventListener("mousemove", ({ clientX, clientY }) => {
    if(mouseDownCheck) {
        const [, ctx] = initialize();
        
        if(isShape) {
            shape.style.width = (x1 > clientX ? x1 - clientX : clientX - x1) + "px";
            shape.style.height = (y1 > clientY ? y1 - clientY : clientY - y1) + "px";

            if(x1 > clientX) shape.style.left = clientX - 2 + "px";
            if(y1 > clientY) shape.style.top = clientY - 2 + "px";

            return;
        };

        ctx.lineTo(clientX, clientY);
        ctx.stroke();    
    };
});

html.addEventListener("mouseup", ({ clientX, clientY }) => {
    if(mouseDownCheck) {
        mouseDownCheck = false;

        if(isShape) {
            const ctx = getCtx();
            
            x2 = clientX;
            y2 = clientY;

            if(fillMode === "border") {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y1);
                ctx.moveTo(x2, y1);
                ctx.lineTo(x2, y2);
                ctx.moveTo(x2, y2);
                ctx.lineTo(x1, y2);
                ctx.moveTo(x1, y2);
                ctx.lineTo(x1, y1);
                ctx.stroke();
            };

            if(fillMode === "fill" ) {
                let startX = x1;
                let startY = y1;
                const width = x1 > x2 ? x1 - x2 : x2 - x1;
                const height = y1 > y2 ? y1 - y2 : y2 - y1;

                if(x1 > x2) startX = x2;
                if(y1 > y2) startY = y2;

                ctx.fillRect(startX, startY, width, height);
            };

            body.removeChild(document.querySelector("#frame"));
        };

        save();
        layerRender();
    };
});

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

    if(!target.classList.contains("layer") && target.parentNode.classList.contains("layer")) {
        focus = getCanvasIndex(target.parentNode);

        target.parentNode.classList.add("focus-layer");
    };
});

$layerBox.addEventListener("dragstart", ({ target }) => {
    if(canvasArray.length === 1) return false;

    if(target.classList.contains("layer")) return target.style.opacity = .5

    if(!target.classList.contains("layer") && target.parentNode.classList.contains("layer")) target.parentNode.style.opacity = .5;
});

$layerBox.addEventListener("dragend", ({ target }) => {
    if(target.classList.contains("layer")) {
        target.style.opacity = 1;

        const index = getCanvasIndex(target);
        const moveCanvas = canvasArray[index];
        const moveCtx = moveCanvas.getContext("2d");
        const rect = moveCanvas.rect();

        for(let i = 0, limit = canvasArray.length; i < limit; i++) {
            if(i === index) continue;

            const targetCanvas = canvasArray[i];
            const targetCtx = targetCanvas.getContext("2d");
            const targetRect = targetCanvas.rect();

            if(rect.top >= targetRect.top && rect.top <= targetRect.bottom) {
                canvasArray[i] = moveCanvas;
                canvasArray[index] = targetCanvas;

                const tempPrevActivity = prevActivityArray[i];

                prevActivityArray[i] = prevActivityArray[index];
                prevActivityArray[index] = tempPrevActivity;

                moveCtx.clearRect(0, 0, moveCanvas.width, moveCanvas.height);
                targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

                drawImage(prevActivityArray[index].slice(-1), targetCanvas, targetCtx);
                drawImage(prevActivityArray[i].slice(-1), moveCanvas, moveCtx);

                focus = i;

                render();

                break;
            };

            console.log(canvasArray);
        }

        return;
    };

    if(!target.classList.contains("layer") && target.parentNode.classList.contains("layer")) target.parentNode.style.opacity = 1;
});

const $colorBox = document.querySelector("#color-box");
$colorBox.value = localStorage.getItem("color") ?? "#333333";

const $toolBox = document.querySelector("#tool-box");
$toolBox.addEventListener("click", ({ target }) => {
    if(!target.classList.contains("tool")) return;
    if(target.tagName.toLowerCase() === "img") target = target.parentNode;

    isEraser = false;

    if(target.id === "shapes") return isShape = true;
    if(target.id === "eraser") return isEraser = true;
    if(target.id === "color") return $colorBox.click();

    if(target.id === "pen") {
        isShape = false;
        canvasRender();

        return isEraser = false;
    };

    if(target.id === "save") {
        const images = prevActivityArray.map(activity => activity.slice(-1)[0]);
        const canvas = newCanvas();
        const ctx = canvas.getContext("2d");
        setCanvas(canvas);
        
        images.map(image => drawImage(image, canvas, ctx));

        setTimeout(() => {
            const a = document.createElement("a");
            a.href = canvas.toDataURL();
            a.download = "canvas";
            a.click();
        });

        return;
    };   
});

const $fillMode = document.querySelector("#fill-mode");
$fillMode.addEventListener("change", ({ target: { value } }) => {
    fillMode = value;
});

$colorBox.addEventListener("change", ({ target: { value } }) => {
    localStorage.setItem("color", value);

    canvasRender();
});