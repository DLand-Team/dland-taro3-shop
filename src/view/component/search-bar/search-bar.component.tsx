import React, { useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { Button, Input, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import styles from "./search-bar.module.scss";

type SearchBarPropsType = {
	className?: string,
	placeholder?: string,
	onFocus?: () => void,
	onBlur?: () => void,
	onInput?: (e: string) => void,
	onSubmit?: (e: string) => void,
}

const SearchBar: React.ComponentType<SearchBarPropsType> = (props) => {

	const [isFocus, setIsFocus] = useState(false);
	const value = useRef<string>('');

	const onFocus = () => {
		setIsFocus(true);
		props.onFocus && props.onFocus();
	}

	const onBlur = () => {
		setIsFocus(false);
		props.onBlur && props.onBlur();
	}

	const onInput = (e) => {
		value.current = e.detail.value;
		props.onInput && props.onInput(e.detail.value);
	}

	return (
		<View className={styles.container + ' ' + (props.className ? props.className : '')}>
			<View className={styles.bar}
				  style={{ width: isFocus ? `calc(100% - ${Taro.pxTransform(120)} - ${Taro.pxTransform(16)})` : '100%' }}>
				<AtIcon className={styles.icon} value='search' size='18' color='#797E8E'></AtIcon>
				<Input className={styles.input} placeholder={props.placeholder}
					   onFocus={onFocus} onBlur={onBlur}
					   onInput={onInput}></Input>
			</View>
			<Button className={styles.button} type='primary'
					style={{
						left: isFocus ? `calc(100% - ${Taro.pxTransform(120)})` : `calc(100% + ${Taro.pxTransform(16)})`,
						opacity: isFocus ? '1' : '0',
					}}
					onClick={() => {
						props.onSubmit && props.onSubmit(value.current)
					}}>
				搜索
			</Button>
		</View>
	);

}

export default SearchBar;
