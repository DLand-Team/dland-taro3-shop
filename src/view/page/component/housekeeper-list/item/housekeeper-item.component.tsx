import React from "react";
import Taro from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { HousekeeperType } from "@/model/type/housekeeper.type";
import CheckSVG from "@/assets/svg/check-fill.svg";
import styles from "./housekeeper-list.module.scss";

type HousekeeperItemPropsType = {
	className?: string,
	data: HousekeeperType,
	onClick?: (id: number) => void,
	selected: 0 | 1 | 2, // 不显示，未选中，已选中
}

const HousekeeperItem: React.ComponentType<HousekeeperItemPropsType> = (props) => {

	const cache: CacheStore = useStore().cacheStore;

	const click = () => {
		props.onClick && props.onClick(props.data.id);
	}

	const href = (e) => {
		e.stopPropagation();
		cache.setCommentHousekeeper(props.data);
		Taro.navigateTo({ url: '/view/page/single/housekeeper-comment/housekeeper-comment-page' });
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`} onClick={click}>
			<Image className={styles.image} src={props.data.housekeeperAvatar} onClick={href}></Image>
			<View className={styles.detail} onClick={href}>
				<View className={styles.name}>
					<Text className={styles.text}>{props.data.housekeeperName}</Text>
					<Text className={styles.ext}>{props.data.housekeeperLevelName}</Text>
				</View>
				<View className={styles.info}>
					<Text className={styles.text}>工号 {props.data.housekeeperNo}</Text>
					<Text className={styles.text}>服务 {props.data.totalOrder}单</Text>
					<Text className={styles.text}>评分 {props.data.avgRate}</Text>
				</View>
			</View>
			{
				props.selected == 1 || props.selected == 2 ?
					<View className={styles.check}>
						{
							props.selected == 2 ?
								<Image className={styles.image} src={CheckSVG}></Image> :
								<View className={styles.circle}></View>
						}
					</View> : ''
			}
		</View>
	)

}

export default HousekeeperItem;
