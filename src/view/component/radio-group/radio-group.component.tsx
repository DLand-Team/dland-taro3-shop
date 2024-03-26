import React, { useState } from "react";
import { Text, View } from "@tarojs/components";
import styles from "./radio-group.module.scss";

type RadioGroupPropsType = {
	className?: string,
	list: Array<{ label: string, value: any }>,
	checkedIndex?: number,
	onChange?: (e: any) => void,
}

const RadioGroup: React.ComponentType<RadioGroupPropsType> = (props) => {

	const [checked, setChecked] = useState(props.checkedIndex || 0);

	const check = (e: number) => {
		setChecked(e);
		props.onChange && props.onChange(props.list[e].value);
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			{
				props.list.map((each, index) => {
					return (
						<View className={styles.each} key={index}
							  onClick={() => check(index)}>
							<View className={`${styles.check} ${checked == index ? styles.active : ''}`}>
								<View className={styles.inner} style={{ opacity: checked == index ? '1' : '0' }}></View>
							</View>
							<Text className={styles.label}>{each.label}</Text>
						</View>
					);
				})
			}
		</View>
	);

}

export default RadioGroup;
