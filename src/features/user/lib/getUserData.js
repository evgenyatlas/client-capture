import bridge from '@vkontakte/vk-bridge';
import { isVK } from '../../../lib/isVK';
import { bboxRadiusMap } from '../../../lib/mapbox/bboxRadiusMap';

export async function getUserData(map, position) {
    const userData = {
        avatarUrl: null,
        id: null,
        bboxRadiusMap: Math.ceil(bboxRadiusMap(map)),
        position
    }

    if (isVK()) {
        const dataProfile = await bridge.send('VKWebAppGetUserInfo')
        if (dataProfile) {
            userData.avatarUrl = dataProfile.photo_200
            userData.id = dataProfile.id
        }
    } else {
        let id = null
        while (!id) {
            id = prompt('Введи ник')
        }
        userData.id = id
    }

    return userData
}
