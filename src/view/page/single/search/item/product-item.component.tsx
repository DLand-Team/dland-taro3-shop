import React from "react";
import Taro from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import { ProductListItemType } from "@/model/type/product-list-item.type";
import styles from "./product-item.module.scss";

export type ProductItemPropsType = {
	className?: string,
	data: ProductListItemType,
}

const ProductItem: React.ComponentType<ProductItemPropsType> = (props) => {

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}
			  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-detail/housekeeping-detail-page?id=' + props.data.id })}>
			<Image className={styles.image} src={props.data.coverImgUrl}></Image>
			<View className={styles.content}>
				<View className={styles.title}>{props.data.name}</View>
				<View className={styles.introduction}>{props.data.brief}</View>
				<View className={styles.bottom}>
					<View className={styles.price}>
						<View className={styles.price1}>
							<View className={styles.value}>{props.data.price}</View>
							<View className={styles.yuan}>元</View>
						</View>
						<View className={styles.price2}>
							会员价：{props.data.memberPrice}
						</View>
					</View>
				</View>
			</View>
		</View>
	);

}

export default ProductItem;
