import React, { useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Image, Text, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import { observer } from "mobx-react";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { PlatformUtil } from "@/util/platform-util";
import { AuthUtil } from "@/util/auth-util";
import { UserApi } from "@/http/api/user.api";
import PageContainer, {
	PageContainerRef,
} from "@/view/component/page-container/page-container.component";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import ListItem from "@/view/component/list-item/list-item.component";
import Alert, { AlertRef } from "@/view/component/alert/alert.component";
import UserNoLoginLogoImage from "@/assets/image/user-no-login-logo.png";
import MemberImage from "@/assets/image/member.png";
import IconPaidanzhongImage from "@/assets/image/icon-paidanzhong.png";
import IconYipaidanImage from "@/assets/image/icon-yipaidan.png";
import IconFuwuzhongImage from "@/assets/image/icon-fuwuzhong.png";
import IconYiwanchengImage from "@/assets/image/icon-yiwancheng.png";
import styles from "./me-tab.module.scss";
import { SERVICE_PHONE } from "@/common/static";

const MeTab: React.FC = observer(() => {
	const userInfo: UserInfoStore = useStore().userInfoStore;
	const container: PageContainerRef = useRef(null);
	const alert = useRef<AlertRef>(null);

	const login = async (e) => {
		// 手机号
		let phoneCode = e.detail.code;
		// 微信登录
		let wxCode = await PlatformUtil.login();
		// 后端登录
		let loginResult = await UserApi.login({ code: wxCode });
		if (!loginResult) {
			container.current?.openMessage({
				message: "登录失败",
				type: "error",
			});
			return;
		}
		// 存储基础信息
		userInfo.setIsLogin(true);
		userInfo.setToken(loginResult.data.token);
		// 判断是否注册
		if (loginResult.success) {
			userInfo.setUserInfo(loginResult.data);
		} else {
			let registerResult = await UserApi.register({
				code: phoneCode,
				wechatOpenId: userInfo.shareWechatOpenId,
			});
			if (registerResult && registerResult.success) {
				userInfo.setUserInfo(registerResult.data);
				userInfo.setToken(registerResult.data.token);
				if (AuthUtil.isNotRegisterByEntity(registerResult.data)) {
					Taro.navigateTo({
						url: "/view/page/single/user-info/user-info-page",
					});
				}
			} else {
				container.current?.openMessage({
					message: "注册失败",
					type: "error",
				});
			}
		}
	};

	const switchToServer = () => {
		if (!userInfo.isLogin) {
			container.current?.openMessage({
				message: "请先登录",
				type: "warning",
			});
			return;
		}
		if (userInfo.inst.housekeeper == 0) {
			container.current?.openMessage({
				message: "您不是服务人员",
				type: "warning",
			});
			return;
		}
		alert.current?.openWithText("确认", "是否切换到服务端？", {
			ok: async () => {
				await UserApi.switchLoginType({ loginType: "HOUSEKEEPER" });
				Taro.redirectTo({
					url: "/view/page/single/order-center-server/order-center-server-page?tabIndex=0",
				});
			},
		});
	};

	return (
		<PageContainer ref={container}>
			<FrameScrollContainer
				innerClassName={styles.container}
				showScrollbar={false}
			>
				<View className={styles.user}>
					<Image
						className={styles.logo}
						src={userInfo.inst.avatar || UserNoLoginLogoImage}
					></Image>
					<View className={styles.info}>
						<Text className={styles.name}>
							{userInfo.isLogin
								? userInfo.inst.nickname
								: "未登录"}
						</Text>
						{userInfo.isLogin ? (
							<Image
								className={styles.member}
								src={MemberImage}
								onClick={() =>
									Taro.navigateTo({
										url: "/view/page/single/member-center/member-center-page",
									})
								}
							></Image>
						) : (
							""
						)}
					</View>
					<View className={styles.control}>
						{userInfo.isLogin ? (
							<View
								className={styles.button}
								onClick={() =>
									Taro.navigateTo({
										url: "/view/page/single/user-info/user-info-page",
									})
								}
							>
								<Text>编辑</Text>
								<AtIcon
									size="16"
									value="chevron-right"
								></AtIcon>
							</View>
						) : (
							<Button
								className={styles.button}
								openType="getPhoneNumber"
								onGetPhoneNumber={login}
							>
								<Text>点击登录</Text>
								<AtIcon
									size="16"
									value="chevron-right"
								></AtIcon>
							</Button>
						)}
					</View>
				</View>
				<View className={styles.order}>
					<View className={styles.item}>
						<ListItem
							title="我的订单"
							heightSize="small"
							noBorder
							onClick={() =>
								Taro.navigateTo({
									url: "/view/page/single/order-center-user/order-center-user-page?tabIndex=0",
								})
							}
						></ListItem>
					</View>
					<View className={styles.panel}>
						<View
							className={styles.each}
							onClick={() =>
								Taro.navigateTo({
									url: "/view/page/single/order-center-user/order-center-user-page?tabIndex=1",
								})
							}
						>
							<Image
								className={styles.icon}
								src={IconPaidanzhongImage}
							></Image>
							<Text className={styles.text}>派单中</Text>
						</View>
						<View
							className={styles.each}
							onClick={() =>
								Taro.navigateTo({
									url: "/view/page/single/order-center-user/order-center-user-page?tabIndex=2",
								})
							}
						>
							<Image
								className={styles.icon}
								src={IconYipaidanImage}
							></Image>
							<Text className={styles.text}>已派单</Text>
						</View>
						<View
							className={styles.each}
							onClick={() =>
								Taro.navigateTo({
									url: "/view/page/single/order-center-user/order-center-user-page?tabIndex=3",
								})
							}
						>
							<Image
								className={styles.icon}
								src={IconFuwuzhongImage}
							></Image>
							<Text className={styles.text}>服务中</Text>
						</View>
						<View
							className={styles.each}
							onClick={() =>
								Taro.navigateTo({
									url: "/view/page/single/order-center-user/order-center-user-page?tabIndex=4",
								})
							}
						>
							<Image
								className={styles.icon}
								src={IconYiwanchengImage}
							></Image>
							<Text className={styles.text}>已完成</Text>
						</View>
					</View>
				</View>
				<View className={styles.list}>
					<ListItem
						title="积分商城"
						onClick={() =>
							Taro.navigateTo({
								url: "/view/page/single/points-mall/points-mall-page",
							})
						}
					></ListItem>
					<ListItem
						title="优惠券"
						onClick={() =>
							Taro.navigateTo({
								url: "/view/page/single/coupon-list/coupon-list-page",
							})
						}
					></ListItem>
					<ListItem
						title="地址管理"
						onClick={() =>
							Taro.navigateTo({
								url: "/view/page/single/address-management/address-management-page",
							})
						}
					></ListItem>
					<ListItem
						title="客服电话"
						extraText="400 966 1110"
						onClick={() =>
							Taro.makePhoneCall({ phoneNumber: SERVICE_PHONE })
						}
					></ListItem>
					{userInfo.inst.housekeeper == 1 ? (
						<ListItem
							title="切换服务人员端"
							noBorder
							onClick={switchToServer}
						></ListItem>
					) : (
						""
					)}
				</View>
				{userInfo.isLogin ? (
					<Button className={styles.shareButton} openType="share">
						邀请有奖
					</Button>
				) : (
					""
				)}
				{/*<View className={styles.list}>*/}
				{/*	memberProductCategory: {userInfo.memberProductCategory}*/}
				{/*</View>*/}
				{/*<View className={styles.list} style={{ wordBreak: 'break-all' }}>*/}
				{/*	userInfo: {JSON.stringify(userInfo.inst)}*/}
				{/*</View>*/}
			</FrameScrollContainer>
			<Alert ref={alert}></Alert>
		</PageContainer>
	);
});

export default MeTab;
