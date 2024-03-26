import React from "react";
import { Image, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { CartType } from "@/model/type/cart.type";
import styles from "./housekeeping-billing-item.module.scss";

export type HousekeepingBillingItemPropsType = {
	className?: string,
	data: CartType,
}

const HousekeepingBillingItem: React.ComponentType<HousekeepingBillingItemPropsType> = (props) => {

	const userInfo: UserInfoStore = useStore().userInfoStore;

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<Image className={styles.image} src={props.data.productCoverImgUrl}></Image>
			<View className={styles.content}>
				<View className={styles.title}>{props.data.productName}</View>
				<View className={styles.introduction}>{props.data.productBrief}</View>
				<View className={styles.bottom}>
					<View className={styles.price}>
						<View className={styles.price1}>
							<View className={styles.value}>{props.data.productCurrentPrice}</View>
							<View className={styles.yuan}>元</View>
						</View>
						{
							userInfo.inst.membership == 1 &&
							userInfo.memberProductCategory.indexOf(props.data.productCategoryId) != -1 ?
								<View className={styles.price2}>
									会员价：{props.data.productCurrentMemberPrice}
								</View> : ''
						}
					</View>
				</View>
			</View>
		</View>
	);

}

export default HousekeepingBillingItem;
