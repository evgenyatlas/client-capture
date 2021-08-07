import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import config from "../../../../config";
import { $smothCoords } from "../../../../features/geolocation/store";
import { rotateMap } from "../../../mapbox/rotateMap";
import { addClickHandler } from "../../lib/addClickHandler";
//fix build
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const { MAPBOX_TOKEN } = config()

export function ReactMapbox({
    width = '100vw',
    height = '100vh',
    onLoad,
    zoom = 19,
    interactive = true,
    onMove,
    onClick,
    rotateTouchMove,
    pitch = 0,
    centerFn,
    center,
    // style = 'mapbox://styles/mapbox/light-v9?optimize=true'
    style = "mapbox://styles/jeckyhit/ckpmeh77a1d7217m485sd3h02?v=1"
}) {

    const container = useRef()
    const mapbox = useRef()
    useEffect(() => {
        if (!container.current) return

        const map = new mapboxgl.Map({
            style,
            container: container.current,
            zoom,
            center: (center ? center : centerFn()),
            accessToken: MAPBOX_TOKEN,
            interactive,
            pitch
        })
        window._map = map
        mapbox.current = map


        if (onMove)
            map.on('move', onMove)

        //Обработка клика/кликов
        if (onClick) {
            Array.isArray(onClick) ?
                onClick.forEach(handlerData => addClickHandler(map, handlerData))
                :
                addClickHandler(map, onClick)
        }

        map.on('load', () => {
            // map.setPaintProperty('building', 'fill-color', 'white')
            // setInterval(() => {
            //     center = transformTranslate({
            //         type: 'Feature',
            //         geometry: {
            //             type: 'Point',
            //             coordinates: center
            //         }
            //     },
            //         0.01,
            //         map.getBearing()
            //     ).geometry.coordinates



            //     map.easeTo({
            //         duration: 3000,
            //         center: center,
            //         essential: true // this animation is considered essential with respect to prefers-reduced-motion
            //     });
            // }, 2000)
            onLoad(map)
        })

        /* let startTouchY = 0
         let currenRotateDeg = map.getBearing()
         let direction = ''
         map.on('touchstart', (e) => {
             startTouchY = e.point.y
         })
         map.on('touchmove', (e) => {
             e.preventDefault()
             const diff = startTouchY - e.point.y
             direction = diff < 0 ? 'down' : 'up'
             currenRotateDeg = (diff) * 0.1 % 360
             // map.rotateTo(currenRotateDeg, { duration: 0 })
             map.easeTo({
                 bearing: map.getBearing() + currenRotateDeg,
                 duration: 300
             });;
         })*/

        //Удаление карты при unmount компонента
        return () => {
            map.remove()
        }
    }, [container.current])

    const SwipeWrapper = ({ children }) => {
        if (rotateTouchMove) {
            const rotate = (data) =>
                rotateMap(mapbox.current, data.deltaY * 0.2, 500)

            const handlers = useSwipeable({
                onSwipedUp: rotate,
                onSwipedDown: rotate,
            })
            return (
                <div {...handlers}>
                    {children}
                </div>
            )
        }
        return (
            <div>
                {children}
            </div>
        )
    }

    return (
        <SwipeWrapper>
            <div ref={container} style={{ width, height, touchAction: rotateTouchMove ? 'none' : 'scroll' }} >
            </div>
        </SwipeWrapper>
    )
}