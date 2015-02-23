//Loads when screen is drawn
//
//
window.onload=function()
{
    init();
    //document.addEventListener('deviceready', init, false);
}

function init()
{
    setupCanvas();
    
}


function setupCanvas()
{
    display.stage = new createjs.Stage("myCanvas");
    display.stage.width = constant.WIDTH;
    display.stage.height = constant.HEIGHT;
}
