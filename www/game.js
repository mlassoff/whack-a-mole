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
        {id: "snd_laugh", src:"assets/sounds/laugh.mp3"},
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
    
    //Reister Sprite Sheets
    registerSpriteSheets();
    
    //click to start the game
    display.stage.addEventListener("click", function(event) { loadLevel(); })
    
    //Play welcome music
    createjs.Sound.play("snd_welcome");
}

function registerSpriteSheets()
{
    //Hit Spritesheet
    var data = {
        images: [display.queue.getResult("ss_hit")],
        frames: {width:170, height: 168},
        animations: { hit: [0,6] } , framerate: 10
    };
    
    var hitSpriteSheet = new createjs.SpriteSheet(data);
    display.hitAnimation = new createjs.Sprite(hitSpriteSheet, "hit");
    
    //Idle Spritesheet
    var data = {
        images: [display.queue.getResult("ss_idle")],
        frames: {width:170, height: 168},
        animations: { idle: [0,6] } , framerate: 10
    };
    
    var idleSpriteSheet = new createjs.SpriteSheet(data);
    display.idleAnimation = new createjs.Sprite(idleSpriteSheet, "idle");
    
    //Laughing Spritesheet
    var data = {
        images: [display.queue.getResult("ss_laughing")],
        frames: {width:170, height: 168},
        animations: { laugh: [0,12] } , framerate: 10
    };
    
    var laughingSpriteSheet = new createjs.SpriteSheet(data);
    display.laughingAnimation = new createjs.Sprite(laughingSpriteSheet, "laugh");
    
    //Pop Animation
    var data = {
        images: [display.queue.getResult("ss_pop")],
        frames: {width:170, height: 168},
        animations: { pop: [0,5] } , framerate: 10
    };
    
    var popSpriteSheet = new createjs.SpriteSheet(data);
    display.popAnimation = new createjs.Sprite(popSpriteSheet, "pop");
    
    //Tease Animation
    var data = {
        images: [display.queue.getResult("ss_tease")],
        frames: {width:170, height: 168},
        animations: { tease: [0,13] } , framerate: 10
    };
    
    var teaseSpriteSheet = new createjs.SpriteSheet(data);
    display.teaseAnimation = new createjs.Sprite(teaseSpriteSheet, "tease");
        
}

function loadLevel()
{
    //Stop Sounds
    createjs.Sound.stop();
    
    //Remove Current Click Listener
    display.stage.removeAllEventListeners();
    
    //Display Level Screen
    display.stage.removeAllChildren();
    display.stage.update();
    var levelLabel = "ls_level" + globals.level;
    var level_screen = display.queue.getResult(levelLabel);
    display.stage.addChild(new createjs.Bitmap(level_screen));
    display.stage.update();
    
    //Play Level Music
    var music = "snd_level" + globals.level + "Background";
    createjs.Sound.play(music,{loop:8});
    
    //Wait for click to start play
    display.stage.addEventListener("click", function(event) { startLevel(); })

}

function startLevel()
{
    //Remove Level Screen
    display.stage.removeAllChildren();
    display.stage.removeAllEventListeners();
    
    //Display the Level Grid
    var levelGrid = createLevelGrid(constant.COLUMNS, constant.ROWS);
    displayLevelGrid(levelGrid, constant.COLUMNS, constant.ROWS);
    
    //Make a simple array of hole positions
    globals.holePositions = new Array();
    for(x=0; x < levelGrid.length; x++)
    {
        for(y=0; y < levelGrid[x].length; y++)
        {
            if(levelGrid[x][y] == "bt_hole")
            {
                globals.holePositions.push(x);
                globals.holePositions.push(y);
            }
        }
    }
       
    //start ticker
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', display.stage);
    createjs.Ticker.addEventListener('tick', playLoop);
    globals.playing = true;
    playGame(globals.holePositions);
}


function playLoop()
{
    
    if(globals.playing)
    {   
        globals.gameTime = globals.gameTime + (1/15);
        
        console.log(globals.gameTime);
        
        if(globals.gameTime < constant.LEVELTIME)
        {
            //How Hard will the level be?
            if(globals.level == 1)
            {
                var frequency = constant.LEVEL1FREQUENCY;   
            } else if (globals.level == 2)
            {
                var frequency =  constant.LEVEL2FREQUENCY;
            } else
            {
                var frequency = constant.LEVEL3FREQUENCY;
            }
            //If the numbers match-- create a mole
            var match = Math.floor((Math.random() * frequency) + 0);
            if(match == 1)
            {
                createRandomMole();   
            }
            
        } else
            
        {
            globals.playing = false;
            endLevel();
        }
    }
}

function createRandomMole()
{
    console.log(globals.holePositions);
    var numHoles = globals.holePositions.length/2;
    var where = Math.floor((Math.random() * globals.holePositions.length) + 0);     //Where will the mole appear?
            if(where % 2 != 0)
            {
                where--;   
            }
    
            var y = globals.holePositions[where];
            var x = globals.holePositions[where+1];
            
            //Mole pops up
            display.popAnimation.x = x * constant.TILEWIDTH;
            display.popAnimation.y = y * constant.TILEHEIGHT;
            display.popAnimation.play();
            display.stage.addChild(display.popAnimation);
            display.stage.update();
            var playSound = Math.floor((Math.random() * 4) + 0);
            console.log("playSound: " + playSound);
            if (playSound ==3) { createjs.Sound.play("snd_laugh"); }
            display.popAnimation.on("animationend", function(){
                //which mole
                var which = Math.floor((Math.random() * 2) + 0);
                if(which == 0) { var mole = display.laughingAnimation }
                else if (which ==1 ) {var mole = display.idleAnimation }
                else {var mole = display.teaseAnimation };
                
                display.stage.removeChild(display.popAnimation);
                mole.y = y * constant.TILEWIDTH;
                mole.x = x * constant.TILEWIDTH;
                mole.play();
                display.stage.addChild(mole);
                display.stage.update();
            });
}

function playGame()
{
    globals.playing = true;
    globals.gameTime = 0;
    
}

function endLevel()
{
    clearInterval(globals.gameIntv);
    if(globals.level < 3)
    {
        globals.level++;
        loadLevel();
    }
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
