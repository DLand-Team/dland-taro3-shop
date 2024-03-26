import React from "react";
import { ScrollView, View } from "@tarojs/components";
import styles from "./frame-scroll-container.module.scss";

type FrameScrollContainerPropsType = {
	className?: string,
	innerClassName?: string,
	background?: string,
	showScrollbar?: boolean,
	children?: any,
}

const FrameScrollContainer: React.ComponentType<FrameScrollContainerPropsType> = (props) => {

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<ScrollView className={styles.scroll}
						scrollY enhanced showScrollbar={props.showScrollbar}>
				<View className={styles.content}>
					<View className={`${styles.inner} ${props.innerClassName ? props.innerClassName : ''}`}>
						{props.children}
					</View>
				</View>
			</ScrollView>
		</View>
	);

}

export default FrameScrollContainer;
