const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
width = document.body.clientWidth;
height = document.body.clientHeight;
canvas.width = width;
canvas.height = height - 100;

let isDraw = false;

const data = {
    color: '#000000',
    thickness: 16,
    fontSize: 16,
    fontFamily: 'sans-serif',
}

const handleCanvasMousedown = ({offsetX, offsetY}) => {
    isDraw = true;
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.thickness;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
}

const handleCanvasMousemove = ({offsetX, offsetY}) => {
    if(!isDraw) return;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
}

const handleCanvasMouseleave = () => {
    ctx.beginPath();
}

const handleCanvasMouseUp = () => {
    isDraw = false;
}

canvas.addEventListener('mousedown', handleCanvasMousedown);
canvas.addEventListener('mousemove', handleCanvasMousemove);
canvas.addEventListener('mouseleave', handleCanvasMouseleave);
canvas.addEventListener('mouseup', handleCanvasMouseUp);