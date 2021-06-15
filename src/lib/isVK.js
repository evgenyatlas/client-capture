export function isVK() {
    if (document.location.search.indexOf('vk_user_id') > -1)
        return true
    return false
}