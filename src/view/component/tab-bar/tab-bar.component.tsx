import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import styles from "./tab-bar.module.scss";

type TabBarPropsType = {
	className?: string,
	tabs: Array<string>,
	current?: number,
	onChange?: (e: number) => void,
}

const TabBar: React.ComponentType<TabBarPropsType> = (props) => {

	const [current, setCurrent] = useState(props.current == null ? 0 : props.current);

	useEffect(() => {
		setCurrent(props.current == null ? 0 : props.current);
	}, [props.current]);

	const change = (index: number) => {
		setCurrent(index);
		props.onChange && props.onChange(index);
	}

	return (
		<View className={styles.container + ' ' + (props.className ? props.className : '')}>
			{
				props.tabs.map((each, index) => {
					return (
						<View className={`${styles.item} ${current == index ? styles.active : ''}`}
							  key={index} onClick={() => change(index)}>
							{each}
						</View>
					);
				})
			}
			<View className={styles.line}
				  style={{
					  width: `calc(${100 / props.tabs.length}% - ${Taro.pxTransform(48)})`,
					  left: `calc(${current * (100 / props.tabs.length)}% + ${Taro.pxTransform(24)})`
				  }}></View>
		</View>
	);

}

export default TabBar;
