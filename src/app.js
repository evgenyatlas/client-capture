import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { AdaptivityProvider, AppRoot, ModalCard, ModalRoot, Root } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import { PageGameMap } from './features/gameMap/page/PageGameMap';

import { Game } from './features/game/game'

import './globalStyle.css'
import { initGeolocation } from './features/geolocation/init';
import { $gameMap } from './features/gameMap/store';
import { initGameMap } from './features/gameMap/init';
import { useStore } from 'effector-react';
import { $activeModal, hideModal } from './features/modals/store';
import { SelectedBuildingModal } from './features/user/features/building/component/SelectedBuildingModal';
import { isVK } from './lib/isVK';

import { GameSettingModal } from './features/gameSetting/components/GameSettingModal';
import { Modals } from './features/modals/components/Modals';

async function init() {

	let avatarUrl = null
	let id = null
	if (isVK()) {
		const dataProfile = await bridge.send('VKWebAppGetUserInfo')
		if (dataProfile) {
			avatarUrl = dataProfile.photo_200
			id = dataProfile.id
		}
	}
	initGeolocation()
	initGameMap()
	$gameMap.watch(map => {
		if (!map) return
		const game = new Game({ map })
		game.init({ avatarUrl, id })
		window.game = game
	})
}

function createApp() {

	init()

	const App = () => {

		useEffect(() => {
			bridge.subscribe(({ detail: { type, data } }) => {
				if (type === 'VKWebAppUpdateConfig') {
					const schemeAttribute = document.createAttribute('scheme');
					schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
					document.body.attributes.setNamedItem(schemeAttribute);
				}
			});

		}, []);


		return (
			<AdaptivityProvider>
				<AppRoot>
					<Root activeView="pageMap" modal={<Modals />}>
						<PageGameMap id="pageMap" />
					</Root>
				</AppRoot>
				{/*DEBUG*/}

			</AdaptivityProvider>
		);
	}

	return App
}

export default createApp