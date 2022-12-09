const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
width = document.body.clientWidth;
height = document.body.clientHeight;
canvas.width = width;
canvas.height = height - 100;

const $ = e => document.querySelector(e);
const $all = e => [...document.querySelectorAll(e)];

const color = $('.color');
const thickness = $('.thickness');
const fontSize = $('.fontSize');
const fontFamily = $('.fontFamily');
const btns = $all('span');

let data = {
    color: color.value,
    thickness: thickness.value,
    fontSize: fontSize.value,
    fontFamily: 'sans-serif',
    isDraw: false,
    tempData: [],
    tools: [
        {type: 'pen', isActive: true},
        {type: 'eraser', isActive: false},
        {type: 'square', isActive: false, isFill: false, isPerfect: false},
        {type: 'circle', isActive: false, isFill: false, isPerfect: false},
        {type: 'triangle', isActive: false, isPerfect: false},
        {type: 'textBox', isActive: false}
    ],
    layer: [],
}

const handleCanvasMousedown = ({offsetX, offsetY}) => {
    data.isDraw = true;
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.thickness;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
}

const handleCanvasMousemove = ({offsetX, offsetY}) => {
    if(!data.isDraw) return;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
}

const handleCanvasMouseleave = () => {
    ctx.beginPath();
}

const handleCanvasMouseUp = () => {
    data.isDraw = false;
}

const handleColorInput = () => {
    data.color = color.value;
}

const evt = () => {
    canvas.addEventListener('mousedown', handleCanvasMousedown);
    canvas.addEventListener('mousemove', handleCanvasMousemove);
    canvas.addEventListener('mouseleave', handleCanvasMouseleave);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    color.addEventListener('input', handleColorInput);
}

const init = () => {
    evt();
}

init();