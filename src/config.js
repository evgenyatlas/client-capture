const DEFAULT = {
    MAPBOX_TOKEN: "pk.eyJ1IjoiamVja3loaXQiLCJhIjoiY2sxa2NmaWc1MDMwcjNibzd3N3BudmN5bCJ9.dSU6fA4JzUyhm5Ws8IENDA",
    DEFAULT_GEO: [30.326678, 59.935736],
    DEFAULT_ZOOM: 18,
    MIN_DISTANCE_CAMERA_MOVE: 10,
    GEOKEY_STEP: 1,
    TIMEOUT_GEO_BROADCAST: 1000,
    GAME: {
        CSS_VARIABLES: ["ATTACK_TIMEOUT"],
        //Остальные данные приходят с сервера
        FPS: 75
    },
    ATTACK_RADIUS: 0,
    SERVER_URL: 'http://localhost:3003',
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

function setCSSVar() {
    const root = window.document.documentElement
    CONFIG.GAME.CSS_VARIABLES.forEach((name) => {
        root.style.setProperty(`--${name}`, typeof CONFIG.GAME[name] === 'number' ? `${CONFIG.GAME[name]}ms` : CONFIG.GAME[name])
    })
    delete CONFIG.GAME.CSS_VARIABLES
}

export function setGameConfig(game) {
    CONFIG.GAME = { ...CONFIG.GAME, ...game }
    setCSSVar()
}

export function get(name) {
    return name ? CONFIG[name] : CONFIG
}

export default function () {
    return CONFIG
}