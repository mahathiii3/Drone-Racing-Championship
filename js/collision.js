class Collision {

    static check(drone, wall) {

        return (

            drone.x + drone.width / 2 > wall.x &&
            drone.x - drone.width / 2 < wall.x + wall.width &&
            drone.y + drone.height / 2 > wall.y &&
            drone.y - drone.height / 2 < wall.y + wall.height

        );

    }

}