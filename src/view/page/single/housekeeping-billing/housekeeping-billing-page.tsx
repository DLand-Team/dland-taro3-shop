import React, { useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, Textarea, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import { observer } from "mobx-react";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { BillingInfoStore } from "@/store/billing-info.store";
import { OrderApi } from "@/http/api/order.api";
import { WechatApi } from "@/http/api/wechat.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import ShadowModal from "@/view/component/shadow-modal/shadow-modal.component";
import RadioGroup from "@/view/component/radio-group/radio-group.component";
import HousekeepingBillingControlList from "@/view/page/single/housekeeping-billing/list/housekeeping-billing-control-list.component";
import HousekeepingBillingItem from "@/view/page/single/housekeeping-billing/item/housekeeping-billing-item.component";
import HousekeepingBillingDetail from "@/view/page/single/housekeeping-billing/detail/housekeeping-billing-detail.component";
import { calculatePrice } from "@/view/page/single/housekeeping-billing/func";
import { PlatformUtil } from "@/util/platform-util";
import styles from './housekeeping-billing-page.module.scss';

const HousekeepingBillingPage: React.FC = observer(() => {

	const container: PageContainerRef = useRef(null);
	const userInfo: UserInfoStore = useStore().userInfoStore;
	const billingInfo: BillingInfoStore = useStore().billingInfoStore;

	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [needPayPrice, setNeedPayPrice] = useState<number>(0);
	const [hasNeedPayPrice, setHasNeedPayPrice] = useState(false);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	useEffect(() => {
		billingInfo.setNeedPetCleaning(0);
		for (let i = 0; i < billingInfo.cartItems.length; i++) {
			if (billingInfo.cartItems[i].needPetCleaning == 1) {
				setHasNeedPayPrice(true);
				break;
			}
		}
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

	const check = () => {
		if (billingInfo.address == null) {
			container.current?.openMessage({
				message: '请选择地址',
				type: 'warning'
			});
			return false;
		}
		if (billingInfo.timeStart == null) {
			container.current?.openMessage({
				message: '请选择上门时间',
				type: 'warning'
			});
			return false;
		}
		return true;
	}

	const submit = async () => {
		if (!check()) {
			return;
		}
		setIsButtonDisabled(true);
		container.current?.openToast({ message: '正在提交订单', type: 'loading' });
		// // 跳转测试
		// setTimeout(() => {
		// 	container.current?.closeToast();
		// 	container.current?.openToast({
		// 		message: '支付成功', type: 'success', during: {
		// 			time: 1500,
		// 			onClose: () => {
		// 				Taro.redirectTo({ url: '/view/page/single/order-center-user/order-center-user-page' });
		// 				setIsButtonDisabled(false);
		// 			}
		// 		}
		// 	});
		// }, 2500);
		// 创建服务订单
		let productList: Array<{ productId: number, payPrice: number }> = [];
		for (let i = 0; i < billingInfo.cartItems.length; i++) {
			productList.push({
				productId: billingInfo.cartItems[i].productId,
				payPrice:
					userInfo.inst.membership == 1 &&
					userInfo.memberProductCategory.indexOf(billingInfo.cartItems[i].productCategoryId) != -1 ?
						billingInfo.cartItems[i].productCurrentMemberPrice :
						billingInfo.cartItems[i].productCurrentPrice,
			});
		}
		let createResult = await OrderApi.housekeepingCreate({
			addressId: billingInfo.address?.id,
			expectArriveTimeStart: billingInfo.timeStart?.value,
			expectArriveTimeEnd: billingInfo.timeEnd?.value,
			housekeeperUserId: billingInfo.housekeeper?.id,
			needPetCleaning: billingInfo.needPetCleaning,
			couponId: billingInfo.coupon?.id,
			remark: billingInfo.remark,
			totalPrice: totalPrice,
			needPayPrice: needPayPrice,
			productList: productList,
		});
		console.log(createResult);
		if (createResult == null || !createResult.success) {
			setIsButtonDisabled(false);
			container.current?.closeToast();
			container.current?.openMessage({
				message: createResult == null ? 'fail' : createResult.msg,
				type: 'error'
			});
			return;
		}
		// 创建预支付订单
		let prepayResult = await WechatApi.payPrepay({
			orderSerialId: createResult.data.orderSerialId, orderType: 'H',
		});
		console.log(prepayResult)
		if (prepayResult == null || !prepayResult.success) {
			setIsButtonDisabled(false);
			container.current?.closeToast();
			container.current?.openMessage({
				message: prepayResult == null ? 'fail' : prepayResult.msg,
				type: 'error'
			});
			return;
		}
		// 微信支付
		let paymentRes = await PlatformUtil.requestPayment(prepayResult.data);
		console.log(paymentRes);
		if (paymentRes) {
			billingInfo.clear();
			container.current?.closeToast();
			container.current?.openToast({
				message: '支付成功', type: 'success', during: {
					time: 1500,
					onClose: () => {
						Taro.redirectTo({ url: '/view/page/single/order-center-user/order-center-user-page' });
						setIsButtonDisabled(false);
					}
				}
			});
		} else {
			setIsButtonDisabled(false);
			container.current?.closeToast();
			container.current?.openMessage({
				message: '支付失败或用户取消支付',
				type: 'warning'
			});
		}
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<FrameScrollContainer innerClassName={styles.scrollContent}>
					<View className={styles.list}>
						<HousekeepingBillingControlList></HousekeepingBillingControlList>
					</View>
					<View className={styles.service}>
						{
							billingInfo.cartItems.map((each, index) => {
								return (
									<HousekeepingBillingItem className={styles.each}
															 data={each} key={index}></HousekeepingBillingItem>
								)
							})
						}
					</View>
					{
						hasNeedPayPrice ?
							<View className={styles.pet}>
								<View className={styles.text}>
									<Text className={styles.title}>家中是否有宠物</Text>
									<Text
										className={styles.tip}>有宠物需增加{billingInfo.petCleaningPrice}元清理费</Text>
								</View>
								<View className={styles.check}>
									<RadioGroup
										list={[{ label: '有', value: true }, { label: '无', value: false },]}
										checkedIndex={1}
										onChange={(e) => billingInfo.setNeedPetCleaning(e ? 1 : 0)}></RadioGroup>
								</View>
							</View> : ''
					}
					<View className={styles.remark}>
						<Textarea className={styles.input} placeholder='如有特殊要求，请给商家捎句话'
								  onInput={(e) => billingInfo.setRemark(e.detail.value)}></Textarea>
					</View>
				</FrameScrollContainer>
				<ShadowModal title='金额明细' isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
					<HousekeepingBillingDetail></HousekeepingBillingDetail>
				</ShadowModal>
			</View>
			<View className={styles.bottom}>
				<View className={styles.count}>
					<Text className={styles.text}>合计：</Text>
					<Text className={styles.value}>{needPayPrice}</Text>
					<Text className={styles.yuan}>元</Text>
					<View className={styles.detail} onClick={() => setIsDetailModalOpen(!isDetailModalOpen)}>
						<Text>查看明细</Text>
						{
							isDetailModalOpen ?
								<AtIcon size='12' value='chevron-down'></AtIcon> :
								<AtIcon size='12' value='chevron-up'></AtIcon>
						}

					</View>
				</View>
				<Button className={styles.button} type='primary' onClick={submit}
						disabled={isButtonDisabled}>预约并支付</Button>
			</View>
		</PageContainer>
	)

});

export default HousekeepingBillingPage;
