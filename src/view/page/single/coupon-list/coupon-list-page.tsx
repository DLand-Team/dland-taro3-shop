import React, { useEffect, useRef } from "react";
import useStore from "@/hook/store";
import { View } from "@tarojs/components";
import { UserInfoStore } from "@/store/user-info.store";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import CouponList from "@/view/page/component/coupon-list/coupon-list.component";
import styles from "./coupon-list-page.module.scss";

const CouponListPage: React.FC = () => {

	const userInfo: UserInfoStore = useStore().userInfoStore;
	const container: PageContainerRef = useRef(null);

	useEffect(() => {
		if (!userInfo.isLogin) {
			container.current?.openMessage({ message: '请先登录', type: 'warning' });
		}
	}, [userInfo.isLogin]);

	return (
		<PageContainer className={styles.container} ref={container}>
			<FrameScrollContainer>
				{userInfo.isLogin ? <CouponList></CouponList> : ''}
				<View className={styles.bottom}></View>
			</FrameScrollContainer>
		</PageContainer>
	)

}

export default CouponListPage;
