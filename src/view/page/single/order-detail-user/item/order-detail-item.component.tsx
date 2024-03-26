import React from "react";
import { Image, View } from "@tarojs/components";
import { OrderProductItemType } from "@/model/type/order-detail.type";
import styles from "./order-detail-item.module.scss";

export type OrderDetailItemPropsType = {
	className?: string,
	data: OrderProductItemType,
}

const OrderDetailItem: React.ComponentType<OrderDetailItemPropsType> = (props) => {

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<Image className={styles.image} src={props.data.productCoverImgUrl}></Image>
			<View className={styles.content}>
				<View className={styles.title}>{props.data.productName}</View>
				<View className={styles.introduction}>{props.data.productBrief}</View>
				<View className={styles.bottom}>
					<View className={styles.price}>
						<View className={styles.value}>{props.data.productPrice}</View>
						<View className={styles.yuan}>元</View>
					</View>
				</View>
			</View>
		</View>
	);

}

export default OrderDetailItem;
