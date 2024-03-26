import { AppProvider } from "@/app-provider";
import TabCartOffImage from "@/assets/image/tab-cart-off.png";
import TabCartOnImage from "@/assets/image/tab-cart-on.png";
import TabCatalogOffImage from "@/assets/image/tab-catalog-off.png";
import TabCatalogOnImage from "@/assets/image/tab-catalog-on.png";
import TabHomeOffImage from "@/assets/image/tab-home-off.png";
import TabHomeOnImage from "@/assets/image/tab-home-on.png";
import TabMeOffImage from "@/assets/image/tab-me-off.png";
import TabMeOnImage from "@/assets/image/tab-me-on.png";
import useStore from "@/hook/store";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import { UserInfoStore } from "@/store/user-info.store";
import Header from "@/view/component/header/header.component";
import CartTab from "@/view/page/tab/cart/cart-tab.component";
import CatalogTab from "@/view/page/tab/catalog/catalog-tab.component";
import HomeTab from "@/view/page/tab/home/home-tab.component";
import MeTab from "@/view/page/tab/me/me-tab.component";
import { Text, View } from "@tarojs/components";
import { getCurrentInstance } from "@tarojs/runtime";
import { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import { observer } from "mobx-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AtTabBar } from "taro-ui";
import Curtain from "./curtain/curtain";
import styles from "./tab-page.module.scss";
const TabPage: React.FC = observer(() => {
	const $instance = useRef(getCurrentInstance());

	const innerMqService: InnerMqService =
		useContext(AppProvider).innerMqService;
	const client = useRef<InnerMqClient>();
	const userInfo: UserInfoStore = useStore().userInfoStore;

	const [pageNames] = useState(["服务", "分类", "购物车", "我的"]);
	const [current, setCurrent] = useState(0);

	useShareAppMessage(() => {
		return {
			title: "闲D岛",
			imageUrl: "",
			path: `view/page/tab/tab-page?shareWechatOpenId=${userInfo.inst.wechatOpenId}`,
		};
	});

	useShareTimeline(() => {
		return {
			title: "闲D岛",
			imageUrl: "",
			path: `view/page/tab/tab-page?shareWechatOpenId=${userInfo.inst.wechatOpenId}`,
		};
	});

	useEffect(() => {
		let shareWechatOpenId: any =
			$instance.current.router?.params.shareWechatOpenId;
		if (shareWechatOpenId != null) {
			userInfo.setShareWechatOpenId(shareWechatOpenId);
		}
		client.current = innerMqService.createClient();
		subMqMessage();
		return () => {
			client.current && innerMqService.destroyClient(client.current);
		};
	}, []);

	const subMqMessage = () => {
		client.current?.sub<{ tabId: number }>(
			Topic.HREF_TO_HOME_TAB,
			(res) => {
				setCurrent(res.tabId);
			}
		);
	};

	const switchTab = (e: number) => {
		setCurrent(e);
		if (e == 2) {
			innerMqService.pub(Topic.UPDATE_USERINFO, true);
		}
	};

	return (
		<View className={styles.container}>
			<Curtain />
			<Header>
				<Text className={styles.headerText}>{pageNames[current]}</Text>
			</Header>
			<View
				className={styles.each}
				style={{ display: current == 0 ? "block" : "none" }}
			>
				<HomeTab></HomeTab>
			</View>
			<View
				className={styles.each}
				style={{ display: current == 1 ? "block" : "none" }}
			>
				<CatalogTab></CatalogTab>
			</View>
			<View
				className={styles.each}
				style={{ display: current == 2 ? "block" : "none" }}
			>
				<CartTab></CartTab>
			</View>
			<View
				className={styles.each}
				style={{ display: current == 3 ? "block" : "none" }}
			>
				<MeTab></MeTab>
			</View>
			<AtTabBar
				className={styles.tabBar}
				tabList={[
					{
						title: "首页",
						image: TabHomeOffImage,
						selectedImage: TabHomeOnImage,
					},
					{
						title: "分类",
						image: TabCatalogOffImage,
						selectedImage: TabCatalogOnImage,
					},
					{
						title: "购物车",
						image: TabCartOffImage,
						selectedImage: TabCartOnImage,
					},
					{
						title: "我的",
						image: TabMeOffImage,
						selectedImage: TabMeOnImage,
					},
				]}
				selectedColor="#FD7419"
				current={current}
				onClick={(e) => switchTab(e)}
			/>
		</View>
	);
});

export default TabPage;
