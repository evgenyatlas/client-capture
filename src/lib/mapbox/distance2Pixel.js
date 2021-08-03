import destination from "@turf/destination"
import { centerMap } from "./centerMap"

//Метод для преобразования расстояния на карте в пиксели
//angleDirection = направление в котором будет происходить рассчет
//нужно только в том случае, если у карты есть наклон (bearing) и соответственно искажение
//для этих же целей используется where (что бы указать откуда считать)
export function distance2Pixel({ map, distance, where, angleDirection = 0, units = 'meters', factorPixel = 1 }) {
    return Math.round(Math.abs(
        map.project(!where ? centerMap(map) : where).y
        -
        map.project(destination(centerMap(map), distance, angleDirection, { units }).geometry.coordinates).y
    ) * factorPixel)
}