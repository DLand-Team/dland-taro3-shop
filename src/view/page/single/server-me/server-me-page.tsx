import React, { useRef } from "react";
import Taro from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, {
	PageContainerRef,
} from "@/view/component/page-container/page-container.component";
import ListItem from "@/view/component/list-item/list-item.component";
import Alert, { AlertRef } from "@/view/component/alert/alert.component";
import UserNoLoginLogoImage from "@/assets/image/user-no-login-logo.png";
import styles from "./server-me-page.module.scss";
import { UserApi } from "@/http/api/user.api";

const ServerMePage: React.FC = () => {
	const userInfo: UserInfoStore = useStore().userInfoStore;
	const container: PageContainerRef = useRef(null);
	const alert = useRef<AlertRef>(null);

	const switchBack = () => {
		alert.current?.openWithText("确认", "是否切换到客户端？", {
			ok: async () => {
				await UserApi.switchLoginType({ loginType: "USER" });
				Taro.redirectTo({ url: "/view/page/tab/tab-page" });
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
							{userInfo.inst.nickname}
						</Text>
					</View>
					<View className={styles.control}>
						<View
							className={styles.button}
							onClick={() =>
								Taro.navigateTo({
									url: "/view/page/single/user-info/user-info-page",
								})
							}
						>
							<Text>编辑</Text>
							<AtIcon size="16" value="chevron-right"></AtIcon>
						</View>
					</View>
				</View>
				<View className={styles.list}>
					<ListItem
						title="切换到客户端"
						noBorder
						onClick={switchBack}
					></ListItem>
				</View>
			</FrameScrollContainer>
			<Alert ref={alert}></Alert>
		</PageContainer>
	);
};

export default ServerMePage;
