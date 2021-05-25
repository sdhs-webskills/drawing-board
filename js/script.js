const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const tools = document.querySelector(".tools");
const resetBtn = document.querySelector(".resetBtn");
const size = document.querySelector(".size input");
const colorBtn = document.querySelector(".sub-tool .color_btn");
const savePopup = document.querySelector(".save");
const closeBtn = document.querySelector("#close");
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

canvas.addEventListener('contextmenu', function () {
    savePopup.classList.toggle("none")
    
    
    // let dataURL = canvas.toDataURL('image/png');
    
    // console.log(dataURL);
    // let a = document.createElement('a');
    // a.download = prompt("저장할 이름을 입력해주세요.");
    // a.href = dataURL;
    // a.click();
    
    
});

closeBtn.addEventListener("click", function(){
    savePopup.classList.toggle("none")
})

/* <input type="file" id="imagefile" accept="image/*"/> 

let imgFile = document.querySelector("#imagefile");

imgFile.addEventListener("change", function(event){
    let reader = new FileReader(); 
    reader.readAsDataURL(event.target.files[0]); 
    // 데이터 url을 base64로 인코딩함(한마디로 입력받은(target된) 이미지 url 주소 생성)
    
    reader.onload = function(event){ //load가 다 됐을 때 실행 
        let img = document.createElement("img"); 
        //img 돔 객체 생성
        img.setAttribute("src", event.target.result); 
        //만든 img 태그에 scr 값을 위에서 인코딩한 url로 바꿈
        document.querySelector("div#image_container").appendChild(img);
        // 미리만들어 놓은 image_container에다 img 태그 넣기
    }; 
}); */