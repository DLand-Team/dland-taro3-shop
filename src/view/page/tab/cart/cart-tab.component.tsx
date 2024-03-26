import React, { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import Decimal from "decimal.js";
import Taro from "@tarojs/taro";
import { Button, Image, Text, View } from "@tarojs/components";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { BillingInfoStore } from "@/store/billing-info.store";
import { UserApi } from "@/http/api/user.api";
import { CartType } from "@/model/type/cart.type";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import CartList from "@/view/page/tab/cart/cart-list/cart-list.component";
import CartEmptyImage from "@/assets/image/cart-empty.png";
import styles from "./cart-tab.module.scss";

const CartTab: React.FC = observer(() => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const client = useRef<InnerMqClient>();
	const container: PageContainerRef = useRef(null);

	const userInfo: UserInfoStore = useStore().userInfoStore;
	const billingInfo: BillingInfoStore = useStore().billingInfoStore;

	const [cartList, setCartList] = useState<Array<CartType>>([]);
	const [totalPrice, setTotalPrice] = useState<number>(0);

	useEffect(() => {
		client.current = innerMqService.createClient();
		subMqMessage();
		userInfo.isLogin && query();
		return () => {
			client.current && innerMqService.destroyClient(client.current);
		};
	}, [userInfo.isLogin]);

	useEffect(() => {
		cartSelected(billingInfo.cartItems);
	}, [userInfo.memberProductCategory]);

	const subMqMessage = () => {
		client.current?.sub(Topic.REFRESH_CART_LIST, () => {
			userInfo.isLogin && query();
		});
	};

	const query = () => {
		UserApi.chartSelectPage({ page: { pageNo: 1, pageSize: 999 } }).then(
			(res) => {
				if (res && res.success) {
					setCartList(res.data.list);
				}
			}
		);
	};

	const cartSelected = (e: Array<CartType>) => {
		billingInfo.setCartItems(e);
		let price = new Decimal(0);
		for (let i = 0; i < e.length; i++) {
			if (
				userInfo.inst.membership == 1 &&
				userInfo.memberProductCategory.indexOf(
					billingInfo.cartItems[i].productCategoryId
				) != -1
			) {
				price = price.add(new Decimal(e[i].productCurrentMemberPrice));
			} else {
				price = price.add(new Decimal(e[i].productCurrentPrice));
			}
		}

		let value = price.toNumber();
		setTotalPrice(value);
	};

	const cartDeleteSuccess = (id: number, msg: string) => {
		let list = billingInfo.cartItems.filter((item) => {
			return item.id != id;
		});
		cartSelected(list);
		query();
		container.current?.openMessage({
			message: msg,
			type: "success",
		});
	};

	const cartDeleteFail = (msg: string) => {
		container.current?.openMessage({
			message: msg,
			type: "error",
		});
	};

	const toBilling = () => {
		if (
			billingInfo.cartItems == null ||
			billingInfo.cartItems.length == 0
		) {
			container.current?.openMessage({
				message: "请选择需要结算的商品",
				type: "warning",
			});
			return;
		}
		Taro.navigateTo({
			url: "/view/page/single/housekeeping-billing/housekeeping-billing-page",
		});
	};

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<FrameScrollContainer innerClassName={styles.scrollContent}>
					{cartList.length == 0 ? (
						<View className={styles.empty}>
							<Image
								className={styles.image}
								src={CartEmptyImage}
							></Image>
							<Text className={styles.text}>
								购物车内暂无商品
							</Text>
							<Text className={styles.text}>先去选择服务吧</Text>
							<View style={{ height: "20px" }}></View>
							{/*<Text className={styles.text} style={{ textDecoration: 'underline' }} onClick={query}>*/}
							{/*	刷新*/}
							{/*</Text>*/}
						</View>
					) : (
						<View className={styles.list}>
							<CartList
								dataList={cartList}
								onSelected={cartSelected}
								onDeleteSuccess={cartDeleteSuccess}
								onDeleteFail={cartDeleteFail}
							></CartList>
							{/*<Text className={styles.text} onClick={query}>刷新购物车</Text>*/}
						</View>
					)}
				</FrameScrollContainer>
			</View>
			<View className={styles.bottom}>
				<View className={styles.count}>
					<View className={styles.text}>合计：</View>
					<View className={styles.value}>{totalPrice}</View>
					<View className={styles.yuan}>元</View>
				</View>
				<Button
					className={styles.button}
					type="primary"
					onClick={toBilling}
				>
					去结算
				</Button>
			</View>
		</PageContainer>
	);
});

export default CartTab;
