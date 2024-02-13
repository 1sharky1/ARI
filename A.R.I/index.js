import ARI from "./modules/ARI.js"

const ari = new ARI();

const elem = document.querySelector('.content-minimized')
const canvas = document.getElementById('ARI-item');
const buttonResize = document.querySelector('.menu__button-resize');        
const buttonReset = document.querySelector('.menu__button-reset');
const buttonScaleUp = document.querySelector('.buttons-ARI-container__button-scaleup');
const buttonScaleDown = document.querySelector('.buttons-ARI-container__button-scaledown');


buttonResize.textContent = 'Увеличить';
buttonScaleUp.hidden = true
buttonScaleDown.hidden = true
let mousePressed = false;
ari.Draw()

canvas.addEventListener('mousedown', function(e){
    ari.SetDistance(e.clientX, e.clientY)
    mousePressed = true
})

canvas.addEventListener('mousemove', function(e){
    if (mousePressed){
        ari.Move(e.clientX, e.clientY);
    }
})
canvas.addEventListener('mouseup', function(){
    mousePressed = false
})


buttonScaleUp.addEventListener('click', function(){
    ari.ScaleUp()
})
buttonScaleDown.addEventListener('click', function(){
    ari.ScaleDown()
})

canvas.addEventListener('wheel', function(e){
    e.preventDefault()
    if (e.deltaY < 0)
        ari.ScaleUp(e.clientX, e.clientY)
    else
        ari.ScaleDown(e.clientX, e.clientY)
})

buttonResize.addEventListener('click', function(){
    if (buttonResize.textContent == 'Увеличить'){
        buttonResize.textContent = 'Уменьшить'
        buttonScaleUp.hidden = false
        buttonScaleDown.hidden = false
        elem.classList.remove('content-minimized')
        elem.classList.add('content-maximized')
    }
    else{
        buttonResize.textContent = 'Увеличить'
        buttonScaleUp.hidden = true
        buttonScaleDown.hidden = true
        elem.classList.remove('content-maximized')
        elem.classList.add('content-minimized')
    }
    ari.Resize();
})

buttonReset.addEventListener('click', function(){
    ari.Reset();
})


