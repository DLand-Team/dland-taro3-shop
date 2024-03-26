import React, { useContext, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { UserInfoStore } from "@/store/user-info.store";
import { OpenMessageParam } from "@/view/component/message/message.component";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import AddressList from "@/view/page/component/address-list/address-list.component";
import styles from "./address-management-page.module.scss";

const AddressManagementPage: React.FC = () => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const client = useRef<InnerMqClient>();

	const cache: CacheStore = useStore().cacheStore;
	const userInfo: UserInfoStore = useStore().userInfoStore;
	const container: PageContainerRef = useRef(null);

	useEffect(() => {
		client.current = innerMqService.createClient();
		subMqMessage();
		return () => {
			client.current && innerMqService.destroyClient(client.current);
		};
	}, []);

	useEffect(() => {
		if (!userInfo.isLogin) {
			container.current?.openMessage({ message: '请先登录', type: 'warning' });
		}
	}, [userInfo.isLogin]);

	const subMqMessage = () => {
		client.current?.sub<OpenMessageParam>(Topic.ADDRESS_MANAGEMENT_PAGE_MESSAGE, (res) => {
			container.current?.openMessage(res);
		});
	}

	const addressInput = () => {
		if (!userInfo.isLogin) {
			container.current?.openMessage({ message: '请先登录', type: 'warning' });
			return;
		}
		cache.setEditAddress(undefined);
		Taro.navigateTo({ url: '/view/page/single/address-input/address-input-page' });
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<FrameScrollContainer innerClassName={styles.scrollContent}>
					{
						userInfo.isLogin ? <AddressList></AddressList> : ''
					}
				</FrameScrollContainer>
			</View>
			<View className={styles.bottom}>
				<Button className={styles.button} type='primary' onClick={addressInput}>新增地址</Button>
			</View>
		</PageContainer>
	);

}

export default AddressManagementPage;
