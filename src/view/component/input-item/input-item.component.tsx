import React from "react";
import Taro from "@tarojs/taro";
import { Input, InputProps, Text, View } from "@tarojs/components";
import styles from "./input-item.module.scss";

interface InputItemPropsType extends InputProps {
	heightSize?: 'normal' | 'small',
	title?: string,
	titleWidthFix?: boolean,
	titleFontWeight?: string,
	value?: string,
	noBorder?: boolean,
}

const InputItem: React.ComponentType<InputItemPropsType> = (props) => {

	const getContainerPadding = (heightSize?: 'normal' | 'small'): string => {
		switch (heightSize) {
			case 'normal':
				return Taro.pxTransform(36);
			case 'small':
				return Taro.pxTransform(24);
			default:
				return Taro.pxTransform(36);
		}
	}

	const onInput = (e) => {
		props.onInput && props.onInput(e);
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<View className={styles.content}
				  style={{
					  paddingTop: getContainerPadding(props.heightSize),
					  paddingBottom: getContainerPadding(props.heightSize),
					  borderBottomColor: props.noBorder ? 'rgba(0,0,0,0)' : '#F4F6FA'
				  }}>
				<Text className={styles.title}
					  style={{
						  width: props.titleWidthFix ? Taro.pxTransform(150) : 'auto',
						  fontWeight: props.titleFontWeight
					  }}>
					{props.title}
				</Text>
				<Input className={styles.input} placeholder={props.placeholder} value={props.value}
					   type={props.type} onInput={onInput}></Input>
			</View>
		</View>
	);

}

export default InputItem;
