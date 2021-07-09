import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { AdaptivityProvider, AppRoot, ModalCard, ModalRoot, Root } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import { PageGameMap } from './features/gameMap/page/PageGameMap';

import { Game } from './features/game/game'

import './globalStyle.css'
import { initGeolocation } from './features/geolocation/init';
import { initGameMap } from './features/gameMap/init';

import { Modals } from './features/modals/components/Modals';


async function createApp() {

	await initGeolocation()

	initGameMap().then(async map => {
		const game = new Game({ map })
		game.init()
	})

	const App = () => {

		// useEffect(() => {
		// 	bridge.subscribe(({ detail: { type, data } }) => {
		// 		if (type === 'VKWebAppUpdateConfig') {
		// 			const schemeAttribute = document.createAttribute('scheme');
		// 			schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
		// 			document.body.attributes.setNamedItem(schemeAttribute);
		// 		}
		// 	});

		// }, []);


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