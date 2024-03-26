import React, { useEffect, useState } from "react";
import { Picker, Text, View, ViewProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtIcon } from "taro-ui";
import styles from "./region-picker-item.module.scss";

interface PickerItemPropsType extends ViewProps {
	heightSize?: 'normal' | 'small',
	title?: string,
	titleWidthFix?: boolean,
	titleFontWeight?: string,
	showValue?: string,
	placeholder?: string,
	noBorder?: boolean,
	onChange?: (e: Array<string>) => void,
}

const PickerItem: React.ComponentType<PickerItemPropsType> = (props) => {

	const [selectedValue, setSelectedValue] = useState<string>();

	useEffect(() => {
		if (props.showValue != null && props.showValue != '') {
			setSelectedValue(props.showValue);
		}
	}, [props.showValue]);

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

	const pickerChange = (e) => {
		let value = '';
		let list = e.detail.value;
		for (let i = 0; i < list.length; i++) {
			value += list[i];
		}
		setSelectedValue(value);
		props.onChange && props.onChange(e.detail.value);
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}
			  hoverClass={styles.contentPressed} hoverStartTime={0} hoverStayTime={50}>
			<View className={styles.content}
				  style={{
					  borderBottomColor: props.noBorder ? 'rgba(0,0,0,0)' : '#F4F6FA'
				  }}>
				<View className={styles.mainLine}>
					<Text className={styles.title}
						  style={{
							  width: props.titleWidthFix ? Taro.pxTransform(150) : 'auto',
							  fontWeight: props.titleFontWeight
						  }}>
						{props.title}
					</Text>
					<Picker className={styles.picker} mode='region' onChange={pickerChange}>
						<View className={styles.pickerContent}
							  style={{
								  paddingTop: getContainerPadding(props.heightSize),
								  paddingBottom: getContainerPadding(props.heightSize),
							  }}>
							{
								selectedValue ?
									<Text className={styles.valueText}>{selectedValue}</Text> :
									<Text className={styles.placeholderText}>{props.placeholder}</Text>
							}
						</View>
					</Picker>
					<View className={styles.arrow}>
						<AtIcon size='16' value='chevron-right'></AtIcon>
					</View>
				</View>
			</View>
		</View>
	);

}

export default PickerItem;
