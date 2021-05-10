let pos = {
    drawable: false,
    x: -1,
    y: -1
};

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", listener);
canvas.addEventListener("mousemove", listener);
canvas.addEventListener("mouseup", listener);
canvas.addEventListener("mouseout", listener);
 
function listener(event){
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