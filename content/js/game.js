let screen_tile_width = 9;
let screen_tile_height = 9;
let tile_size = 64;

//Aliases
let Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;
    TilingSprite = PIXI.TilingSprite;
    Container = PIXI.Container;

//Create a Pixi Application
let app = new Application({ 
    width: screen_tile_width * tile_size, 
    height: screen_tile_height * tile_size,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
loader
  .add("images/black.png")
  .add("images/tiling_floor.png")
  .add("images/wall_01.json")
  .load(setup);

  let wall_layer = new Container(),
      player_layer = new Container(),
      fow_layer = new Container(),
      ui_layer = new Container()
  
  let visible_tiles = Array(screen_tile_width * screen_tile_height);

  let wall_sheet;

//This `setup` function will run when the image has loaded
function setup() {

  // add a tiling floor sprite
  let floor_sprite = new TilingSprite(resources["images/tiling_floor.png"].texture,
                                      screen_tile_width * tile_size,
                                      screen_tile_height * tile_size);
  app.stage.addChild(floor_sprite);

  //cache the wall spritesheet
  wall_sheet = resources["images/wall_01.json"].spritesheet;

  //initialise all the tiles
  for(i = 0; i < screen_tile_width; ++i){
    for(j = 0; j < screen_tile_height; ++j){
      // create sprites for the wall layer
      var tile = new Sprite();
      tile.x = i * tile_size;
      tile.y = j * tile_size;
      tile.visible = false;
      wall_layer.addChild(tile);

      var idx = (j * screen_tile_width) + i;
      visible_tiles[idx] = tile

      // create fow tiles
      let fow_sprite = new TilingSprite(resources["images/black.png"].texture,
                                        tile_size,
                                        tile_size);
      fow_sprite.alpha = 1.0 - fow_alpha[idx];
      fow_sprite.x = i * tile_size;
      fow_sprite.y = j * tile_size;
      fow_layer.addChild(fow_sprite);
    }

    fow_layer.x = (screen_tile_width * tile_size * 0.5);
    fow_layer.y = (screen_tile_height * tile_size * 0.5);
    fow_layer.pivot.x = (screen_tile_width * tile_size * 0.5);
    fow_layer.pivot.y = (screen_tile_width * tile_size * 0.5);
  }

  // add placeholder player
  let player_sprite = new TilingSprite(resources["images/black.png"].texture,
                                      0.5 * tile_size,
                                      0.5 * tile_size);
    // player_sprite.anchor.x = 0.5;
    // player_sprite.anchor.y = 0.5;
  player_layer.x = (screen_tile_width * tile_size * 0.5);
  player_layer.y = (screen_tile_height * tile_size * 0.5);
  player_layer.pivot.x = (tile_size * 0.25);
  player_layer.pivot.y = (tile_size * 0.25);

  player_layer.addChild(player_sprite);

  app.stage.addChild(wall_layer);
  app.stage.addChild(player_layer);
  app.stage.addChild(fow_layer);
  app.stage.addChild(ui_layer);

  // set the game render to dirty so we can redraw it
  render_dirty = true;
  // start the game loop
  app.ticker.add(delta => gameLoop(delta));
}

let render_dirty = false;
let empty_tile_val = 0;
let wall_tile_val = 1;

function gameLoop(delta)
{
  if (player.move === true)
  {
    var x = player.pos.x;
    var y = player.pos.y;

    // up
    if (player.direction === 0)
    {
      if (y-1 >= 0 && map.data[((y-1) * map.width) + x] === empty_tile_val)
      {
        y -= 1;
      }
    }
    //right
    else if (player.direction === 1)
    {
      if (x+1 < map.width && map.data[(y * map.width) + x + 1] === empty_tile_val)
      {
        x += 1;
      }
    }
    // down
    else if (player.direction === 2)
    {
      if (y+1 < map.height && map.data[((y+1) * map.width) + x] === empty_tile_val)
      {
        y += 1;
      }
    }
    // left
    else
    {
      if (x-1 >= 0 &&map.data[(y * map.width) + x - 1] === empty_tile_val)
      {
        x -= 1;
      }
    }

    player.pos.x = x;
    player.pos.y = y;

    player.move = false;
    render_dirty = true;
  }
  if (render_dirty === true)
  {
    drawGame();
  }
}

function drawGame()
{
  var half_w = Math.floor(screen_tile_width/2.0);
  var half_h = Math.floor(screen_tile_height/2.0);
  for(i = 0; i < screen_tile_width; i++) {
    for (j = 0; j < screen_tile_height; j++) {
      var x = player.pos.x + i -half_w;
      var y = player.pos.y + j - half_h;
      var tile_idx = (j * screen_tile_width) + i;

      var tile = visible_tiles[tile_idx];
      if (x >= 0 && x < map.width && y >= 0 && y < map.height)
      {
        var map_idx = (y * map.width) + x;
        var is_empty = map.data[map_idx] == 0;

        if (is_empty === true)
        {
            tile.visible = false;
        }
        else if (map.data[map_idx] == wall_tile_val)
        {
          var wall_tile_type = "";

          // left
          if (x-1 >= 0 && x-1 < map.width)
          {
            if (map.data[(y * map.width) + x-1] == wall_tile_val)
            {
              wall_tile_type += "l";
            }
          }
          // right
          if (x+1 >= 0 && x+1 < map.width)
          {
            if (map.data[(y * map.width) + x+1] == wall_tile_val)
            {
              wall_tile_type += "r";
            }
          }
          // up
          if (y-1 >= 0 && y-1 < map.height)
          {
            if (map.data[((y-1) * map.width) + x] == wall_tile_val)
            {
              wall_tile_type += "u";
            }
          }
          // down
          if (y+1 >= 0 && y+1 < map.height)
          {
            if (map.data[((y+1) * map.width) + x] == wall_tile_val)
            {
              wall_tile_type += "d";
            }
          }

          visible_tiles[tile_idx].texture = resources["images/wall_01.json"].textures[wall_tile_type];
          visible_tiles[tile_idx].visible = true;
        }
      }
      else{
        tile.visible = false;
      }
    }
  }
  render_dirty = false;
}