import React from "react";
import Taro from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import { ProductListItemType } from "@/model/type/product-list-item.type";
import styles from "./catalog-content-list.module.scss";

export type CatalogContentListPropsType = {
	className?: string,
	data: Array<ProductListItemType>,
}

const CatalogContentList: React.ComponentType<CatalogContentListPropsType> = (props) => {

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			{
				props.data.map((each, index) => {
					return (
						<View className={styles.each} key={index}
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-detail/housekeeping-detail-page?id=' + each.id })}>
							<Image className={styles.image} src={each.coverImgUrl}></Image>
							<View className={styles.content}>
								<View className={styles.title}>{each.name}</View>
								<View className={styles.introduction}>{each.brief}</View>
								<View className={styles.bottom}>
									<View className={styles.price}>
										<View className={styles.price1}>
											<View className={styles.value}>{each.price}</View>
											<View className={styles.yuan}>元</View>
										</View>
										<View className={styles.price2}>
											会员价：{each.memberPrice}
										</View>
									</View>
								</View>
							</View>
						</View>
					);
				})
			}
		</View>
	);

}

export default CatalogContentList;
