import React, { useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { BillingInfoStore } from "@/store/billing-info.store";
import { AddressType } from "@/model/type/address.type";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import AddressList, { AddressListRef } from "@/view/page/component/address-list/address-list.component";
import styles from "./housekeeping-address-selector-page.module.scss";

const HousekeepingAddressSelectorPage: React.FC = () => {

	const cache: CacheStore = useStore().cacheStore;
	const billingInfo: BillingInfoStore = useStore().billingInfoStore;
	const container: PageContainerRef = useRef(null);
	const addressList: AddressListRef = useRef(null);
	const address = useRef<AddressType>();

	useEffect(() => {
		address.current = billingInfo.address;
		addressList.current?.setSelectedId(billingInfo.address?.id);
	}, []);

	const selectConfirm = () => {
		if (address.current == null) {
			container.current?.openMessage({
				message: '请选择收货地址',
				type: 'warning',
			});
			return;
		}
		billingInfo.setAddress(address.current);
		Taro.navigateBack();
	}

	const addressInput = () => {
		cache.setEditAddress(undefined);
		Taro.navigateTo({ url: '/view/page/single/address-input/address-input-page' });
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<FrameScrollContainer innerClassName={styles.scrollContent}>
					<AddressList ref={addressList} selectable onSelected={(e) => address.current = e}></AddressList>
				</FrameScrollContainer>
			</View>
			<View className={styles.bottom}>
				<Button className={styles.add} onClick={addressInput}>新增地址</Button>
				<Button className={styles.submit} type='primary' onClick={selectConfirm}>确定</Button>
			</View>
		</PageContainer>
	);

}

export default HousekeepingAddressSelectorPage;
