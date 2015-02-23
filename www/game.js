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
    preloadAssets();
}

function preloadAssets()
{
    display.queue = new createjs.LoadQueue();
    display.queue.installPlugin(createjs.Sound);
    display.queue.on("complete" , assetsLoaded, this);
    display.queue.loadManifest([
        {id: "ls_credit", src:"assets/loadingScreens/ls_credit.jpg"},
        {id: "ls_gameOver", src:"assets/loadingScreens/ls_gameOver.jpg"},
        {id: "ls_level1", src:"assets/loadingScreens/ls_level1.jpg"},
        {id: "ls_level2", src:"assets/loadingScreens/ls_level2.jpg"},
        {id: "ls_level3", src:"assets/loadingScreens/ls_level3.jpg"},
        {id: "ls_winner", src:"assets/loadingScreens/ls_winner.jpg"},
        {id: "bt_grass", src:"assets/backgroundTiles/bt_grass.png"},
        {id: "bt_hole", src:"assets/backgroundTiles/bt_hole.png"},
        {id: "bt_flowerRock", src:"assets/backgroundTiles/bt_flowerRock.png"},
        {id: "bt_rock", src:"assets/backgroundTiles/bt_rock.png"},
        {id: "bt_flowers", src:"assets/backgroundTiles/bt_flowers.png"}
    ]);
}

function assetsLoaded()
{
    alert("assets Loaded");   
}

function setupCanvas()
{
    display.stage = new createjs.Stage("myCanvas");
    display.stage.width = constant.WIDTH;
    display.stage.height = constant.HEIGHT;
}
