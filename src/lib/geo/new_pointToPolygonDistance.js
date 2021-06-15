import pointToLineDistance from '@turf/point-to-line-distance'
import { point as createPoint, lineString, polygon as createPolygon } from '@turf/helpers'
import { polygonToLine } from '@turf/polygon-to-line'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

export function pointToPolygonDistance(point, polygon) {
    console.log(polygon)

    point = createPoint(point)
    // polygon = createPolygon(polygon)
    if (polygon.type === "Feature") { polygon = polygon.geometry }
    let distance;
    if (polygon.type === "MultiPolygon") {
        distance = polygon.coordinates
            .map(coords => pointToPolygonDistance({ point, polygon: createPolygon(coords).geometry }))
            .reduce((smallest, current) => (current < smallest ? current : smallest));
    } else {
        if (polygon.coordinates.length > 1) {
            // Has holes
            const [exteriorDistance, ...interiorDistances] = polygon.coordinates.map(coords =>
                pointToPolygonDistance({ point, polygon: createPolygon([coords]).geometry })
            );
            if (exteriorDistance < 0) {
                // point is inside the exterior polygon shape
                const smallestInteriorDistance = interiorDistances.reduce(
                    (smallest, current) => (current < smallest ? current : smallest)
                );
                if (smallestInteriorDistance < 0) {
                    // point is inside one of the holes (therefore not actually inside this shape)
                    distance = smallestInteriorDistance * -1;
                } else {
                    // find which is closer, the distance to the hole or the distance to the edge of the exterior, and set that as the inner distance.
                    distance = smallestInteriorDistance < exteriorDistance * -1
                        ? smallestInteriorDistance * -1
                        : exteriorDistance;
                }
            } else {
                distance = exteriorDistance;
            }
        } else {
            // The actual distance operation - on a normal, hole-less polygon (converted to meters)
            distance = pointToLineDistance(point, polygonToLine(polygon)) * 1000;
            if (booleanPointInPolygon(point, polygon)) {
                distance = distance * -1;
            }
        }
    }
    return distance
}


// export function pointToPolygonDistance(pointCoords, polygonCoords) {

//     console.log(pointCoords, polygonCoords)
//     const fromPoint = point(pointCoords)
//     const polygon = lineString(polygonCoords[0])
//     return pointToLineDistance(
//         fromPoint,
//         polygon,
//         { units: 'meters' }
//     )
// }