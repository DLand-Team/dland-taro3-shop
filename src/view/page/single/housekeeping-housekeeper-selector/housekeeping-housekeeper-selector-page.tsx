import React, { useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { BillingInfoStore } from "@/store/billing-info.store";
import { HousekeeperType } from "@/model/type/housekeeper.type";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import HousekeeperList, { HousekeeperListRef } from "@/view/page/component/housekeeper-list/housekeeper-list.component";
import styles from "./housekeeping-housekeeper-selector-page.module.scss";

const HousekeepingHousekeeperSelectorPage: React.FC = () => {

	const billingInfo: BillingInfoStore = useStore().billingInfoStore;
	const container: PageContainerRef = useRef(null);
	const housekeeperList: HousekeeperListRef = useRef(null);
	const housekeeper = useRef<HousekeeperType>();

	useEffect(() => {
		housekeeper.current = billingInfo.housekeeper;
		housekeeperList.current?.setSelectedId(billingInfo.housekeeper?.id);
	}, []);

	const selectConfirm = () => {
		billingInfo.setHousekeeper(housekeeper.current);
		Taro.navigateBack();
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<FrameScrollContainer innerClassName={styles.scrollContent} showScrollbar>
					<View className={styles.tip}>
						<Text>test</Text>
					</View>
					<HousekeeperList ref={housekeeperList}
									 selectable onSelected={(e) => housekeeper.current = e}></HousekeeperList>
				</FrameScrollContainer>
			</View>
			<View className={styles.bottom}>
				<Button className={styles.button} type='primary' onClick={selectConfirm}>确定</Button>
			</View>
		</PageContainer>
	);

}

export default HousekeepingHousekeeperSelectorPage;
