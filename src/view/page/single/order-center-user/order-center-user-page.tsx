import React, { useEffect, useRef, useState } from "react";
import { getCurrentInstance } from "@tarojs/runtime";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { ScrollView, View } from "@tarojs/components";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import TabBar from "@/view/component/tab-bar/tab-bar.component";
import OrderUserList from "@/view/page/component/order-user-list/order-user-list.component";
import styles from './order-center-user-page.module.scss';

const tabs = ['已创建', '派单中', '已派单', '服务中', '已完成', '已评价', '已取消'];
const status: Array<number | 'cancel'> = [0, 10, 20, 30, 40, 50, 'cancel'];

const OrderCenterUserPage: React.FC = () => {

	const $instance = useRef(getCurrentInstance());
	const userInfo: UserInfoStore = useStore().userInfoStore;
	const container: PageContainerRef = useRef(null);
	const [currentTabIndex, setCurrentTabIndex] = useState(0);

	useEffect(() => {
		let tabIndex = Number($instance.current.router?.params.tabIndex);
		setCurrentTabIndex((tabIndex == null || Number.isNaN(tabIndex)) ? 0 : tabIndex);
		if (!userInfo.isLogin) {
			container.current?.openMessage({
				message: '请先登录',
				type: 'warning',
			});
		}
	}, []);

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.tabBar}>
				<TabBar tabs={tabs} current={currentTabIndex} onChange={setCurrentTabIndex}></TabBar>
			</View>
			<View className={styles.content}>
				<ScrollView className={styles.scroll} scrollY>
					{
						status.map((each, index) => {
							return (
								<>
									{
										index == currentTabIndex ?
											<OrderUserList status={each} key={index}></OrderUserList> : ''
									}
								</>
							);
						})
					}
				</ScrollView>
			</View>
		</PageContainer>
	);

}

export default OrderCenterUserPage;
