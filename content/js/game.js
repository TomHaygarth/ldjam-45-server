let screen_tile_width = 9;
let screen_tile_height = 9;
let tile_size = 64;

//Aliases
let Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;
    TilingSprite = PIXI.TilingSprite;

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
  .add("images/tiling_floor.png")
  .add("images/wall_01.json")
  .load(setup);

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
      var tile = new Sprite();
      tile.x = i * tile_size;
      tile.y = j * tile_size;
      tile.visible = false;
      app.stage.addChild(tile);

      visible_tiles[(i * screen_tile_width) + j] = tile
    }
  }
  render_dirty = true;
  // start the game loop
  app.ticker.add(delta => gameLoop(delta));
}

let render_dirty = false;

function gameLoop(delta)
{
  if (render_dirty === true)
  {
    drawGame();
  }
}

let wall_tile_val = 1;

function drawGame()
{
  var half_w = Math.floor(screen_tile_width/2.0);
  var half_h = Math.floor(screen_tile_height/2.0);
  for(i = 0; i < screen_tile_width; ++i) {
    for (j = 0; j < screen_tile_height; ++j) {
      var x = player.pos.x + i -half_w;
      var y = player.pos.y + j - half_h;
      var tile_idx = (i * screen_tile_width) + j;

      var tile = visible_tiles[tile_idx];
      if (x >= 0 && x < map.width && y >= 0 && y < map.height)
      {
        var map_idx = (x * map.width) + y;
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
            if (map.data[((x-1) * map.width) + y] == wall_tile_val)
            {
              wall_tile_type += "l";
            }
          }
          // right
          if (x+1 >= 0 && x+1 < map.width)
          {
            if (map.data[((x+1) * map.width) + y] == wall_tile_val)
            {
              wall_tile_type += "r";
            }
          }
          // up
          if (y-1 >= 0 && y-1 < map.height)
          {
            if (map.data[(x * map.width) + y - 1] == wall_tile_val)
            {
              wall_tile_type += "u";
            }
          }
          // down
          if (y+1 >= 0 && y+1 < map.height)
          {
            if (map.data[(x * map.width) + y + 1] == wall_tile_val)
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