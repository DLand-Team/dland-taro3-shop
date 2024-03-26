import React, { useContext, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { MembershipApi } from "@/http/api/membership.api";
import { MembershipType } from "@/model/type/membership.type";
import { OrderApi } from "@/http/api/order.api";
import { WechatApi } from "@/http/api/wechat.api";
import { UserApi } from "@/http/api/user.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import Alert, { AlertRef } from "@/view/component/alert/alert.component";
import MemberItem from "@/view/page/single/member-center/item/member-item.component";
import { PlatformUtil } from "@/util/platform-util";
import styles from "./member-center-page.module.scss";

const MemberCenterPage: React.FC = () => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const container: PageContainerRef = useRef(null);
	const userInfo: UserInfoStore = useStore().userInfoStore;
	const alert = useRef<AlertRef>(null);
	const [membershipList, setMembershipList] = useState<Array<MembershipType>>([]);

	useEffect(() => {
		innerMqService.pub(Topic.UPDATE_USERINFO, true);
		MembershipApi.list({ criteria: { valid: 1 } }).then((res) => {
			if (res && res.success) {
				setMembershipList(res.data.list);
			}
		});
	}, []);

	const purchase = (e: number) => {
		alert.current?.open({
			ok: async () => {
				await submit(membershipList[e]);
			},
		});
	}

	const submit = async (detail: MembershipType) => {
		// 创建购买会员订单
		container.current?.openToast({ message: '正在提交订单', type: 'loading' });
		let createResult = await OrderApi.membershipCreate({ membershipId: detail.id });
		console.log(createResult);
		if (createResult == null || !createResult.success) {
			container.current?.closeToast();
			container.current?.openMessage({
				message: createResult == null ? 'fail' : createResult.msg,
				type: 'error'
			});
			return;
		}
		// 创建预支付订单
		let prepayResult = await WechatApi.payPrepay({
			orderSerialId: createResult.data.serialId, orderType: 'M',
		});
		console.log(prepayResult)
		if (prepayResult == null || !prepayResult.success) {
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
			updateMemberProductCategory(detail.productCategory);
			await reLogin();
			container.current?.closeToast();
			container.current?.openToast({
				message: '支付成功', type: 'success', during: {
					time: 1500,
					onClose: () => {
						Taro.navigateBack();
					}
				}
			});
		} else {
			container.current?.closeToast();
			container.current?.openMessage({
				message: '支付失败或用户取消支付',
				type: 'warning'
			});
		}
	}

	const updateMemberProductCategory = (productCategory: string) => {
		let arr = productCategory.split(',');
		let newArr: Array<number> = [];
		for (let i = 0; i < arr.length; i++) {
			newArr.push(Number(arr[i]));
		}
		userInfo.setMemberProductCategory(newArr);
	}

	const reLogin = async () => {
		// 微信登录
		let wxCode = await PlatformUtil.login();
		// 后端登录
		let loginResult = await UserApi.login({ code: wxCode });
		if (loginResult?.code == '0000') {
			userInfo.setIsLogin(true);
			userInfo.setToken(loginResult.data.token);
			userInfo.setUserInfo(loginResult.data);
		}
	}

	return (
		<PageContainer ref={container}>
			<FrameScrollContainer innerClassName={styles.container}>
				{
					membershipList.map((each, index) => {
						return (
							<MemberItem data={each} key={index} onButtonClick={() => purchase(index)}></MemberItem>
						);
					})
				}
				<Alert ref={alert} title='确认' content='是否购买该会员'></Alert>
			</FrameScrollContainer>
		</PageContainer>
	)

}

export default MemberCenterPage;
