let player = {
    pos : {
        x : 4,
        y : 4
    },
    direction : 0,
    move : false
};

function handle_direction_input(direction)
{
    if (direction !== player.direction)
    {
        player.direction = direction;
    }
    else
    {
        player.move = true;
    }
}
let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

    up.press = () => {
        handle_direction_input(0);
    };
    right.press = () => {
        handle_direction_input(1);
    };
    down.press = () => {
        handle_direction_input(2);
    };
    left.press = () => {
        handle_direction_input(3);
    };
