// Create the canvas
var canvas = document.createElement("canvas")
var ctx = canvas.getContext("2d")
canvas.width = 512
canvas.height = 480
document.body.appendChild(canvas)

var image = function(src){
	var r = new Image()
	r.ready = false
	r.onload = function(){r.ready = true}
	r.src = src
	r.draw = function(ctx,x,y){if (r.ready) ctx.drawImage(r,x,y);}
	return r}

var bgImage = image("images/background.png")
var heroImage = image("images/hero.png")
var monsterImage = image("images/monster.png")

// Game objects
var hero = {speed: 256} // movement in pixels per second
var monster = {}
var monstersCaught = 0

// Handle keyboard controls
var keysDown = {}

addEventListener("keydown", function(e){keysDown[e.keyCode] = true}, false)
addEventListener("keyup"  , function(e){delete keysDown[e.keyCode]}, false)

// Reset the game when the player catches a monster
var reset = function(){
	hero.x = canvas.width / 2
	hero.y = canvas.height / 2

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64))
	monster.y = 32 + (Math.random() * (canvas.height - 64))
	}

// Update game objects
var update = function(modifier){
	if (38 in keysDown) hero.y -= hero.speed * modifier // Player holding up
	if (40 in keysDown) hero.y += hero.speed * modifier // Player holding down
	if (37 in keysDown) hero.x -= hero.speed * modifier // Player holding left
	if (39 in keysDown) hero.x += hero.speed * modifier // Player holding right

	// Are they touching?
	if (hero.x    <= monster.x + 32 &&
		monster.x <= hero.x    + 32 &&
		hero.y    <= monster.y + 32 &&
		monster.y <= hero.y    + 32)
		{++monstersCaught; reset()}
	}

// Draw everything
var render = function(){
	bgImage.draw(ctx,0,0)
	heroImage.draw(ctx,hero.x,hero.y)
	monsterImage.draw(ctx,monster.x,monster.y)

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)"
	ctx.font = "24px Helvetica"
	ctx.textAlign = "left"
	ctx.textBaseline = "top"
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32)
	}

// The main game loop
var main = function(){
	var now = Date.now()
	var delta = now - then

	update(delta / 1000)
	render()

	then = now
	}

// Let's play this game!
reset()
var then = Date.now()
setInterval(main, 1) // Execute as fast as possible
