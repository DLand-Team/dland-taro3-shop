import React, { useContext, useEffect, useRef, useState } from "react";
import { getCurrentInstance } from "@tarojs/runtime";
import Taro from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import { OrderApi } from "@/http/api/order.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import Alert, { AlertRef } from "@/view/component/alert/alert.component";
import AddressList from "@/view/page/component/address-list/address-list.component";
import styles from "./goods-billing-address-page.module.scss";

const GoodsBillingAddressPage: React.FC = () => {

	const $instance = useRef(getCurrentInstance());
	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;

	const container: PageContainerRef = useRef(null);
	const alert = useRef<AlertRef>(null);

	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const id = useRef<number>();
	const addressId = useRef<number>();

	useEffect(() => {
		id.current = Number($instance.current.router?.params.id);
	}, []);

	const submit = () => {
		if (id.current == null) {
			container.current?.openMessage({
				message: '商品信息为空',
				type: 'error',
			});
			return;
		}
		if (addressId.current == null) {
			container.current?.openMessage({
				message: '请选择收货地址',
				type: 'warning',
			});
			return;
		}
		setIsButtonDisabled(true);
		container.current?.openToast({ message: '兑换中', type: 'loading' });
		OrderApi.exchangeCreate({
			pointsProductId: id.current,
			addressId: addressId.current
		}).then((res) => {
			setIsButtonDisabled(false);
			container.current?.closeToast();
			if (res?.success) {
				alert.current?.openWithText('消息', '兑换成功', {
					ok: () => {
						innerMqService.pub(Topic.UPDATE_USERINFO, true);
						Taro.navigateBack();
					},
					cancel: () => Taro.navigateBack(),
				});
			} else {
				alert.current?.openWithText('兑换失败', res?.msg, {});
			}
		});
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<FrameScrollContainer innerClassName={styles.scrollContent}>
					<AddressList selectable onSelected={(e) => addressId.current = e?.id}></AddressList>
				</FrameScrollContainer>
			</View>
			<View className={styles.bottom}>
				<Button className={styles.button} type='primary' disabled={isButtonDisabled} onClick={submit}>
					确认兑换
				</Button>
			</View>
			<Alert ref={alert}></Alert>
		</PageContainer>
	);

}

export default GoodsBillingAddressPage;
