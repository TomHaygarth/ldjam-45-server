let player = {
    pos : {
        x : 4,
        y : 4
    },
    direction : 0,
    move : false
};

let fow_alpha = [
    0.15, 0.15, 0.15, 0.35, 0.40, 0.35, 0.15, 0.15, 0.15,
    0.15, 0.15, 0.35, 0.40, 0.60, 0.40, 0.35, 0.15, 0.15,
    0.15, 0.15, 0.50, 0.70, 0.80, 0.70, 0.50, 0.15, 0.15,
    0.15, 0.15, 0.15, 0.80, 1.00, 0.80, 0.15, 0.15, 0.15,
    0.15, 0.15, 0.15, 0.60, 1.00, 0.60, 0.15, 0.15, 0.15,
    0.15, 0.15, 0.15, 0.35, 0.40, 0.35, 0.15, 0.15, 0.15,
    0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
    0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
    0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15,
]

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
