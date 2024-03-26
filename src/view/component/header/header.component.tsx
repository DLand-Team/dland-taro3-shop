import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon } from 'taro-ui';
import styles from "./header.module.scss";

type HeaderPropsType = {
	className?: string,
	children?: any,
	showBackButton?: boolean,
	onBackClick?: () => {},
}

const Header: React.ComponentType<HeaderPropsType> = (props) => {

	const [headerTop, setHeaderTop] = useState(0);

	useEffect(() => {
		let windowInfo = Taro.getWindowInfo();
		let statusBarHeight = windowInfo.statusBarHeight || 0;
		let menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
		let navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2;
		setHeaderTop(statusBarHeight + navBarHeight);
	}, []);

	const leftClick = () => {
		if (props.showBackButton) {
			if (props.onBackClick) {
				props.onBackClick();
			} else {
				Taro.navigateBack();
			}
		}
	}

	return (
		<View className={styles.container + ' ' + (props.className ? props.className : '')}
			  style={{ paddingTop: Taro.pxTransform(headerTop) }}>
			<View className={styles.left} onClick={leftClick}>
				{
					props.showBackButton ? <AtIcon value='chevron-left' size='26' color='#000000'></AtIcon> : ''
				}
			</View>
			<View className={styles.center}>
				{props.children}
			</View>
			<View className={styles.right}></View>
		</View>
	);

}

export default Header;
