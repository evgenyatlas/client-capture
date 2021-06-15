import pointToLineDistance from '@turf/point-to-line-distance'
import { point, lineString } from '@turf/helpers'

export function pointToPolygonDistance(pointCoords, polygon) {
    //CRUTCHES!!!! 
    polygon = polygon.type === 'MultiPolygon' ? polygon.coordinates[0][0] : polygon.coordinates[0]
    return pointToLineDistance(
        point(pointCoords),
        lineString(polygon),
        { units: 'meters' }
    )
}