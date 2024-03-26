import React from "react";
import { Button, Image, Text, View } from "@tarojs/components";
import { GoodsListItemType } from "@/model/type/goods-list-item.type";
import styles from "./goods-item.module.scss";

export type GoodsItemPropsType = {
	className?: string,
	data: GoodsListItemType,
	onButtonClick: () => void,
}

const GoodsItem: React.ComponentType<GoodsItemPropsType> = (props) => {

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<View className={styles.imageBox}>
				<Image className={styles.image} src={props.data.coverImgUrl} mode='aspectFit'></Image>
			</View>
			<View className={styles.info}>
				<Text className={styles.title}>{props.data.name}</Text>
				<View className={styles.bottom}>
					<Text className={styles.points}>{props.data.points}积分</Text>
					<Button className={styles.button} type='primary' onClick={props.onButtonClick}>兑换</Button>
				</View>
			</View>
		</View>
	);

}

export default GoodsItem;
