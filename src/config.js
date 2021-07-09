const DEFAULT = {
    MAPBOX_TOKEN: "pk.eyJ1IjoiamVja3loaXQiLCJhIjoiY2sxa2NmaWc1MDMwcjNibzd3N3BudmN5bCJ9.dSU6fA4JzUyhm5Ws8IENDA",
    DEFAULT_GEO: [30.326678, 59.935736],
    DEFAULT_ZOOM: 18,
    MIN_DISTANCE_CAMERA_MOVE: 10,
    GEOKEY_STEP: 5,
    TIMEOUT_GEO_BROADCAST: 1000,
    GAME: {
        //Остальные данные приходят с сервера
        FPS: 75
    },
    ATTACK_RADIUS: 0,
    SERVER_URL: 'http://localhost:3003'
}

const PRODUCTION = {
    SERVER_URL: 'https://capture.atlashit.ru'
}

const CONFIG = process.env.NODE_ENV === 'production' ?
    {
        ...DEFAULT,
        ...PRODUCTION
    }
    :
    DEFAULT

export default function () {

    return CONFIG

}