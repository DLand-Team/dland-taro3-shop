import React, { useEffect, useState } from "react";
import Decimal from "decimal.js";
import { observer } from "mobx-react";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { BillingInfoStore } from "@/store/billing-info.store";
import { Text, View } from "@tarojs/components";
import { calculatePrice } from "@/view/page/single/housekeeping-billing/func";
import styles from "./housekeeping-billing-detail.module.scss";

type BillingDetailPropsType = {
	className?: string,
}

const HousekeepingBillingDetail: React.ComponentType<BillingDetailPropsType> = observer((props) => {

	const userInfo: UserInfoStore = useStore().userInfoStore;
	const billingInfo: BillingInfoStore = useStore().billingInfoStore;

	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [needPayPrice, setNeedPayPrice] = useState<number>(0);

	useEffect(() => {
		updatePrice();
	}, []);

	useEffect(() => {
		updatePrice();
	}, [
		userInfo.memberProductCategory,
		billingInfo.housekeeper,
		billingInfo.needPetCleaning,
		billingInfo.coupon,
	]);

	const updatePrice = () => {
		let price = calculatePrice(userInfo, billingInfo);
		setTotalPrice(price.total);
		setNeedPayPrice(price.needPay);
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<View className={styles.part}>
				<View className={styles.title}>
					<Text className={styles.text}>服务总价</Text>
					<Text className={styles.value}>{totalPrice}元</Text>
				</View>
				{
					billingInfo.cartItems.map((each, index) => {
						return (
							<View className={styles.item} key={index}>
								<Text className={styles.text}>{each.productName}</Text>
								<Text className={styles.value}>
									{
										userInfo.inst.membership == 1 &&
										userInfo.memberProductCategory.indexOf(each.productCategoryId) != -1 ?
											each.productCurrentMemberPrice : each.productCurrentPrice
									}元
								</Text>
							</View>
						);
					})
				}
				{
					billingInfo.housekeeper ?
						<View className={styles.item}>
							<Text className={styles.text}>服务人员费用</Text>
							<Text className={styles.value}>{billingInfo.housekeeper.housekeeperLevelPrice}元</Text>
						</View> : ''
				}
				{
					billingInfo.needPetCleaning ?
						<View className={styles.item}>
							<Text className={styles.text}>宠物增加费用</Text>
							<Text className={styles.value}>{billingInfo.petCleaningPrice}元</Text>
						</View> : ''
				}
			</View>
			{
				billingInfo.coupon != null ?
					<View className={styles.part}>
						<View className={styles.title}>
							<Text className={styles.text}>共减</Text>
							<Text className={styles.value}>
								减{new Decimal(totalPrice).sub(new Decimal(needPayPrice)).toNumber()}元
							</Text>
						</View>
						<View className={styles.item}>
							<Text className={styles.text}>优惠券</Text>
							<Text className={styles.value}>{billingInfo.coupon.creditPrice}元</Text>
						</View>
					</View> : ''
			}
			<View className={styles.part}>
				<View className={styles.title}>
					<Text className={styles.text}>合计</Text>
					<Text className={styles.value}>{needPayPrice}元</Text>
				</View>
			</View>
		</View>
	);

});

export default HousekeepingBillingDetail;
