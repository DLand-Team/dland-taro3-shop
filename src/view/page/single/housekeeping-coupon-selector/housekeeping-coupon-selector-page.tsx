import React, { useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { BillingInfoStore } from "@/store/billing-info.store";
import { CouponType } from "@/model/type/coupon.type";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import CouponList, { CouponListRef } from "@/view/page/component/coupon-list/coupon-list.component";
import styles from "./housekeeping-coupon-selector-page.module.scss";

const HousekeepingCouponSelectorPage: React.FC = () => {

	const billingInfo: BillingInfoStore = useStore().billingInfoStore;
	const container: PageContainerRef = useRef(null);
	const couponList: CouponListRef = useRef(null);
	const coupon = useRef<CouponType>();

	useEffect(() => {
		coupon.current = billingInfo.coupon;
		couponList.current?.setSelectedId(billingInfo.coupon?.id);
	}, []);

	const selectConfirm = () => {
		billingInfo.setCoupon(coupon.current);
		Taro.navigateBack();
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<FrameScrollContainer innerClassName={styles.scrollContent}>
					<CouponList ref={couponList} status={0} selectable
								onSelected={(e) => coupon.current = e}></CouponList>
				</FrameScrollContainer>
			</View>
			<View className={styles.bottom}>
				<Button className={styles.button} type='primary' onClick={selectConfirm}>确定</Button>
			</View>
		</PageContainer>
	)

}

export default HousekeepingCouponSelectorPage;
