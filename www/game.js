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
        {id: "ls_title", src:"assets/loadingScreens/ls_title.jpg"},
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
        {id: "bt_flowers", src:"assets/backgroundTiles/bt_flowers.png"},
        {id: "snd_welcome", src:"assets/sounds/welcome.mp3"},
        {id: "snd_level1Background", src:"assets/sounds/circus1.mp3"},
        {id: "snd_level2Background", src:"assets/sounds/circus2.mp3"},
        {id: "snd_level3Background", src:"assets/sounds/circus3.mp3"},
        {id: "ss_hit", src:"assets/spriteAnimations/spritesheet_hit.png"},
        {id: "ss_idle", src:"assets/spriteAnimations/spritesheet_idle.png"},
        {id: "ss_laughing", src:"assets/spriteAnimations/spritesheet_laughing.png"},
        {id: "ss_pop", src:"assets/spriteAnimations/spritesheet_pop.png"},
        {id: "ss_tease", src:"assets/spriteAnimations/spritesheet_tease.png"}

    ]);
}

function assetsLoaded()
{
    //Display the Level1 Screen
    var background = display.queue.getResult("ls_title");
    display.stage.addChild(new createjs.Bitmap(background));
    display.stage.update();
    
    //click to start the game
    display.stage.addEventListener("click", function(event) { loadLevel(1); })
    
    //Play welcome music
    createjs.Sound.play("snd_welcome");
}

function loadLevel(level)
{
    //Stop Sounds
    createjs.Sound.stop();
    
    //Remove Current Click Listener
    display.stage.removeAllEventListeners();
    
    //Display Level Screen
    display.stage.removeAllChildren();
    display.stage.update();
    var levelLabel = "ls_level" + level;
    var level_screen = display.queue.getResult(levelLabel);
    display.stage.addChild(new createjs.Bitmap(level_screen));
    display.stage.update();
    
    //Play Level Music
    var music = "snd_level" + level + "Background";
    createjs.Sound.play(music);
    
    //Wait for click to start play
    display.stage.addEventListener("click", function(event) { startLevel(level); })

}

function startLevel(level)
{
    //Remove Level Screen
    display.stage.removeAllChildren();
    display.stage.removeAllEventListeners();
    var levelGrid = createLevelGrid(constant.COLUMNS, constant.ROWS);
    //console.log(levelGrid);
    displayLevelGrid(levelGrid, constant.COLUMNS, constant.ROWS);
}

function displayLevelGrid(levelGrid, colsNumber, rowsNumber)
{
    //Where will the tile be positioned?
    var xPos=0;
    var yPos=0;
    
    for(var x = 0; x < rowsNumber; x++)
    {
        xPos = 0;
        for(var y =0; y < colsNumber; y++)
        {
            var tile = display.queue.getResult(levelGrid[x][y]);
            
            //Display the tile in the correct position
            var bitmap = new createjs.Bitmap(tile);
            bitmap.x = xPos;
            bitmap.y = yPos;
            display.stage.addChild(bitmap);
            
            //Position for next tile on the X-axis
            xPos += constant.TILEWIDTH;
        }
        
        //Position for the next tile on the Y-axis
        yPos += constant.TILEHEIGHT; 
    }
    display.stage.update();   
}

function createLevelGrid(colsNumber, rowsNumber)
{
    var levelGrid= new Array();
    
    //Each Row   
    for(var x=0; x < rowsNumber; x++)
       {
           var row = new Array();
           //Each column in that row 
           for(var y = 0; y < colsNumber; y++)
            {
                var tileType = Math.floor((Math.random() * 4) + 0);
                
                //Associate Graphic with numerical tileType
                if(tileType ==0)
                {
                    tileType = "bt_grass";    
                } else if (tileType ==1)
                {
                    tileType = "bt_hole";   
                } else if (tileType ==2)
                {
                    tileType = "bt_flowerRock";
                } else if (tileType ==3)
                {
                    tileType = "bt_rock";  
                } else
                {
                    tileType = "bt_flowers";   
                }
                row[y] = tileType;
            }
            levelGrid[x] = row;
       }
    return levelGrid;
}


function setupCanvas()
{
    display.stage = new createjs.Stage("myCanvas");
    display.stage.canvas.width = constant.WIDTH;
    display.stage.canvas.height = constant.HEIGHT;
}
