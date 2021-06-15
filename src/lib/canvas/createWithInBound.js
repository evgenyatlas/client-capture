export function createWithInBound(x, y) {
    return (pos) => !(pos.x < x[0] || pos.x > x[1] || pos.y < y[0] || pos.y > y[1])
}