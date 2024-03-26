import React from "react";
import Taro from "@tarojs/taro";
import { Image, Text, View, ViewProps } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import styles from "./list-item.module.scss";

interface ListItemPropsType extends ViewProps {
	heightSize?: 'normal' | 'small',
	title?: string,
	titleWidthFix?: boolean,
	titleFontWeight?: string,
	icon?: string,
	note?: string,
	extraText?: string,
	extraTextImage?: string,
	extraTextAlign?: 'left' | 'center' | 'right',
	extraTextHighLight?: boolean,
	noBorder?: boolean,
}

const ListItem: React.ComponentType<ListItemPropsType> = (props) => {

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

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}
			  hoverClass={styles.contentPressed} hoverStartTime={0} hoverStayTime={50}
			  onClick={(e) => props.onClick && props.onClick(e)}>
			<View className={styles.content}
				  style={{
					  paddingTop: getContainerPadding(props.heightSize),
					  paddingBottom: getContainerPadding(props.heightSize),
					  borderBottomColor: props.noBorder ? 'rgba(0,0,0,0)' : '#F4F6FA'
				  }}>
				<View className={styles.mainLine}>
					{props.icon ? <Image className={styles.icon} src={props.icon}></Image> : ''}
					<Text className={styles.title}
						  style={{
							  width: props.titleWidthFix ? Taro.pxTransform(150) : 'auto',
							  fontWeight: props.titleFontWeight
						  }}>
						{props.title}
					</Text>
					<View className={styles.extra}>
						{
							props.extraTextImage ?
								<Image className={styles.extraTextImage} src={props.extraTextImage}></Image> : ''
						}
						<Text className={styles.extraText}
							  style={{
								  flex: props.extraTextAlign ? '1' : undefined,
								  textAlign: props.extraTextAlign ? props.extraTextAlign : 'right',
								  color: props.extraTextHighLight ? '#1A1A1A' : '#9DA3B2',
								  fontWeight: props.extraTextHighLight ? props.titleFontWeight : undefined,
							  }}>
							{props.extraText}
						</Text>
					</View>
					<View className={styles.arrow}>
						<AtIcon size='16' value='chevron-right'></AtIcon>
					</View>
				</View>
				{
					props.note ?
						<Text className={styles.subLine}
							  style={{ marginLeft: props.icon ? Taro.pxTransform(46) : '0' }}>
							{props.note}
						</Text> : ''
				}
			</View>
		</View>
	);

}

export default ListItem;
