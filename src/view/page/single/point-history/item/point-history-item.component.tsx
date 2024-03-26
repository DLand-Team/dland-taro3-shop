import React from "react";
import dayjs from "dayjs";
import { Text, View } from "@tarojs/components";
import { PointHistoryType } from "@/model/type/point-history.type";
import styles from "./point-history-item.module.scss";

type PointHistoryPropsType = {
	className?: string,
	data: PointHistoryType,
}

const PointHistoryItem: React.ComponentType<PointHistoryPropsType> = (props) => {

	return (
		<View className={styles.container + ' ' + (props.className ? props.className : '')}>
			<View className={styles.left}>
				<Text className={styles.title}>{props.data.name}</Text>
				<Text className={styles.note}>
					{dayjs(props.data.createTime).format("YYYY-MM-DD HH:mm:ss")}
				</Text>
			</View>
			<View className={styles.right}>
				<Text className={styles.text}>+{props.data.points}</Text>
			</View>
		</View>
	);

}

export default PointHistoryItem;
