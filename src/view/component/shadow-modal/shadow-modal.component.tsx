import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import styles from './shadow-modal.module.scss';

type ShadowModalPropsType = {
	title?: string,
	children?: any,
	isOpen: boolean,
	onClose?: () => void,
}

const ShadowModal: React.ComponentType<ShadowModalPropsType> = (props) => {

	const [isOpen, setIsOpen] = useState(props.isOpen);
	const [display, setDisplay] = useState(props.isOpen ? 'block' : 'none');

	useEffect(() => {
		if (props.isOpen) {
			setDisplay('block');
			setTimeout(() => {
				setIsOpen(props.isOpen);
			}, 10);
		} else {
			setIsOpen(props.isOpen);
			setTimeout(() => {
				setDisplay('none');
			}, 510);
		}
	}, [props.isOpen]);

	const close = (): void => {
		setIsOpen(false);
		props.onClose && props.onClose();
	}

	return (
		<View className={`${styles.container} ${isOpen ? styles.open : styles.close}`}
			  style={{ display: display }}>
			<View className={styles.shadow} onClick={() => close()}></View>
			<View className={styles.modal}>
				<View className={styles.header}>
					<Text className={styles.title}>{props.title}</Text>
					<View className={styles.close} onClick={() => close()}>
						<AtIcon value='close' size={16} color='#1A1A1A'></AtIcon>
					</View>
				</View>
				<View className={styles.content}>
					<ScrollView className={styles.scroll} scrollY>{props.children}</ScrollView>
				</View>
			</View>
		</View>
	);

}

export default ShadowModal;
