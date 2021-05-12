const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const tools = document.querySelector(".tools");
const resetBtn = document.querySelector(".resetBtn");
const size = document.querySelector(".size input");

const xx = document.querySelector(".x");
const yy = document.querySelector(".y");

let pos = {
    drawable: false,
    x: -1,
    y: -1
};

// 하이라이트
const highlight = function(target){
    target.parentNode.style.background = "#eee";
}

const reset = function(){
    // 하이라이트 해제
    [...tools.children].forEach((data) => {
        data.style.background = "#fff";
    });

    // 실행중인 canvas이벤트 중지
    canvas.removeEventListener("mousedown", drawListener);
    canvas.removeEventListener("mousemove", drawListener);
    canvas.removeEventListener("mouseup", drawListener);
    canvas.removeEventListener("mouseout", drawListener);
}

const drawListener = function(event){
    switch(event.type){
        case "mousedown":
            initDraw(event);
            break;
 
        case "mousemove":
            if(pos.drawable)
                draw(event);
            break;
 
        case "mouseout":
        case "mouseup":
            finishDraw();
            break;
    }
}

const initDraw = function(event){
    ctx.beginPath();
    pos.drawable = true;
    let coors = getPosition(event);
    pos.X = coors.X;
    pos.Y = coors.Y;
    ctx.moveTo(pos.X, pos.Y);
}
 
const draw =function(event){
    let coors = getPosition(event);
    ctx.lineTo(coors.X, coors.Y);
    pos.X = coors.X;
    pos.Y = coors.Y;
    ctx.stroke();
}
 
const finishDraw =function(){
    pos.drawable = false;
    pos.X = -1;
    pos.Y = -1;
}
 
const getPosition = function(event){
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    return {X: x, Y: y};
}

tools.addEventListener("click", function({target}){
    if(target.parentNode.classList.contains("pencil")){
        reset();
        highlight(target);

        canvas.addEventListener("mousedown", drawListener);
        canvas.addEventListener("mousemove", drawListener);
        canvas.addEventListener("mouseup", drawListener);
        canvas.addEventListener("mouseout", drawListener);
        
        return false;
    }
    if(target.parentNode.classList.contains("eraser")){
        reset();
        highlight(target);

        return false;
    }
    if(target.parentNode.classList.contains("rectangle")){
        reset();
        highlight(target);

        return false;
    }
    if(target.parentNode.classList.contains("circle")){
        reset();
        highlight(target);

        return false;
    }
});

canvas.addEventListener("mousemove", function(event){
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    // pageX 마우스의 x축
    // pageY 마우스의 y축
    // offsetLeft 캔버스가 왼쪽벽에서 떨어져있는 길이?
    // offsetTop 캔버스가 윗벽에서 떨어져있는 길이?
    xx.value = `x: ${x}`;
    yy.value = `y: ${y}`;
})

resetBtn.addEventListener("click", function(){
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log(1)
})

size.addEventListener("keydown", function({keyCode}){
    // size.value = size.value.replace(/[^0-9]/g, "");
    if(keyCode === 13){
        console.log(size.value)
    }
    // console.log(keyCode)
})