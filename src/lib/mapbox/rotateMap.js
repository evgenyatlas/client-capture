export function rotateMap(map, angle, duration = 0) {
    map.__currBearing = (map.__currBearing || 0) + angle
    map.rotateTo(
        map.__currBearing,
        { duration }
    )
    map.fire('rotateZ', { bearing: map.__currBearing, angleRotation: angle })
}