const DEV = process.env.NODE_ENV === 'development'

export function isDev() {
    return DEV
}