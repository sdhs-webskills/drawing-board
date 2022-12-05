const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
width = document.body.clientWidth;
height = document.body.clientHeight;
canvas.width = width;
canvas.height = height;

const handleCanvasMousedown = ({offsetX, offsetY}) => {
    console.log(offsetX, offsetY);
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
}

const handleCanvasMousemove = ({offsetX, offsetY}) => {
    ctx.lineTo(offsetX, offsetY);
}

const handleCanvasMouseUp = () => {
    ctx.stroke();
}

canvas.addEventListener('mousedown', handleCanvasMousedown);
canvas.addEventListener('mousemove', handleCanvasMousemove);
canvas.addEventListener('mouseup', handleCanvasMouseUp);