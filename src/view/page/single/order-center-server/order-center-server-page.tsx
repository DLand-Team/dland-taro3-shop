import React, { useEffect, useRef, useState } from "react";
import { getCurrentInstance } from "@tarojs/runtime";
import Taro from "@tarojs/taro";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import Header from "@/view/component/header/header.component";
import TabBar from "@/view/component/tab-bar/tab-bar.component";
import OrderServerList from "@/view/page/component/order-server-list/order-server-list.component";
import styles from './order-center-server-page.module.scss';

const tabs = ['已派单', '服务中', '已完成', '已评价'];
const status = [20, 30, 40, 50];

const OrderCenterServerPage: React.FC = () => {

	const $instance = useRef(getCurrentInstance());
	const userInfo: UserInfoStore = useStore().userInfoStore;
	const [currentTabIndex, setCurrentTabIndex] = useState(0);

	useEffect(() => {
		let tabIndex = Number($instance.current.router?.params.tabIndex);
		setCurrentTabIndex((tabIndex == null || Number.isNaN(tabIndex)) ? 0 : tabIndex);
	}, []);

	return (
		<View className={styles.container}>
			<Header className={styles.header}>
				<Text className={styles.headerText}>接单</Text>
			</Header>
			<View className={styles.tab}>
				<TabBar className={styles.tabBar} tabs={tabs}
						current={currentTabIndex} onChange={setCurrentTabIndex}></TabBar>
				<Image className={styles.avatar} src={userInfo.inst.avatar}
					   onClick={() => Taro.navigateTo({ url: '/view/page/single/server-me/server-me-page' })}></Image>
			</View>
			<View className={styles.content}>
				<ScrollView className={styles.scroll} scrollY>
					{
						status.map((each, index) => {
							return (
								<>
									{
										index == currentTabIndex ?
											<OrderServerList status={each} key={index}></OrderServerList> : ''
									}
								</>
							);
						})
					}
				</ScrollView>
			</View>
		</View>
	);

}

export default OrderCenterServerPage;
