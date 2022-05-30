const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');
let savedPoints = [];
let currentSize = 10;
let bucketColor = bucketColorBtn.value;
let currentColor = brushColorBtn.value;
let isDrawing = false;
let isEraser = false;

brushIcon.addEventListener('click', function () {
  activeToolEl.textContent = 'Brush';
  isEraser = false;
});

eraser.addEventListener('click', function() {
  activeToolEl.textContent = 'Eraser';
  isEraser = true;
});

saveStorageBtn.addEventListener('click', function() {
  localStorage.setItem('savedPoints', JSON.stringify(savedPoints));
});

loadStorageBtn.addEventListener('click', function () {
  if (localStorage.getItem('savedPoints')) {
    loadFromStorage();
  }
});

clearStorageBtn.addEventListener('click', function() {
  localStorage.removeItem('savedPoints');
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
});

brushColorBtn.addEventListener('change', function() {
  currentColor = brushColorBtn.value;
});

bucketColorBtn.addEventListener('change', function() {
  bucketColor = bucketColorBtn.value;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
});

brushSlider.addEventListener('change', function() {
  currentSize = Number(brushSlider.value);
  brushSize.textContent = brushSlider.value.padStart(2, '0');
});

canvas.addEventListener('mousedown', function (event) {
  isDrawing = true;
  context.beginPath();
  if (isEraser) {
    context.strokeStyle = bucketColor;
  } else {
    context.strokeStyle = currentColor;
  }
  context.lineCap = 'round';
  context.lineWidth = currentSize;
  context.moveTo(event.clientX, event.clientY - 50);
});

canvas.addEventListener('mousemove', function (event) {
  if (isDrawing) {
    context.lineTo(event.clientX, event.clientY - 50);
    context.stroke();
    savedPoints.push({
      x: event.clientX,
      y: event.clientY - 50,
      color: currentColor,
      width: currentSize,
    });
  }
});

canvas.addEventListener('mouseup', function () {
  isDrawing = false;
});

downloadBtn.addEventListener('click', function() {
  const imageData = canvas.toDataURL('image/jpeg', 1.0);
  downloadBtn.download = 'my_canvas.jpeg';
  downloadBtn.href = imageData;
});

function loadFromStorage() {
  savedPoints = JSON.parse(localStorage.getItem('savedPoints'));
  context.beginPath();
  context.moveTo(savedPoints[0].x, savedPoints[0].y);

  for (let i = 0; i < savedPoints.length; i++) {
    context.strokeStyle = savedPoints[i].color;
    context.lineWidth = savedPoints[i].width;
    context.lineTo(savedPoints[i].x, savedPoints[i].y);
  }

  context.stroke();
}

function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

createCanvas();
