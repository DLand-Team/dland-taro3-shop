import React from "react";
import { Image, Text, View } from "@tarojs/components";
import dayjs from "dayjs";
import { ExchangeType } from "@/model/type/exchange.type";
import styles from "./exchange-history.module.scss";

type ExchangeHistoryItemPropsType = {
	className?: string,
	data: ExchangeType,
}

const ExchangeHistoryItem: React.ComponentType<ExchangeHistoryItemPropsType> = (props) => {

	return (
		<View className={styles.container + ' ' + (props.className ? props.className : '')}>
			<Image className={styles.image} src={props.data.productCoverImgUrl} mode='widthFix'></Image>
			<View className={styles.left}>
				<Text className={styles.title}>{props.data.productName}</Text>
				<Text className={styles.note}>
					{dayjs(props.data.createTime).format('YYYY-MM-DD HH:mm:ss')}
				</Text>
			</View>
			<View className={styles.right}>
				<Text className={styles.text}>{props.data.points}积分</Text>
			</View>
		</View>
	);

}

export default ExchangeHistoryItem;
