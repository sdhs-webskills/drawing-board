const tools = document.querySelector(".tools");

const high = function(target){
    target.style.background = "#eee";
}
const removeHigh = function(){
    // [...tools.children].forEach((data) => {
    //     console.log(data)
    //     data.style.background = "none"
    // });
}
tools.addEventListener("click", function({target}){
    removeHigh();
    if(target.parentNode.classList.contains("pencil")){
        high(target);

        return false;
    }
    if(target.parentNode.classList.contains("rectangle")){
        high(target);

        return false;
    }
    if(target.parentNode.classList.contains("circle")){
        high(target);

        return false;
    }
})

let pos = {
    drawable: false,
    x: -1,
    y: -1
};
let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");


const listener = function(event){
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
    var coors = getPosition(event);
    pos.X = coors.X;
    pos.Y = coors.Y;
    ctx.moveTo(pos.X, pos.Y);
}
 
const draw =function(event){
    var coors = getPosition(event);
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
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    return {X: x, Y: y};
}

canvas.addEventListener("mousedown", listener);
canvas.addEventListener("mousemove", listener);
canvas.addEventListener("mouseup", listener);
canvas.addEventListener("mouseout", listener);