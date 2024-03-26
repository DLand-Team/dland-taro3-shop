import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { OrderListItemType } from "@/model/type/order-list-item.type";
import { OrderApi } from "@/http/api/order.api";
import OrderUserItem from "@/view/page/component/order-user-list/item/order-user-item.component";
import CartEmptyImage from "@/assets/image/cart-empty.png";
import styles from "./order-user-list.module.scss";

type OrderListPropsType = {
	className?: string,
	status: number | 'cancel',
}

const OrderUserList: React.ComponentType<OrderListPropsType> = (props) => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const client = useRef<InnerMqClient>();

	const userInfo: UserInfoStore = useStore().userInfoStore;
	const [requestFinish, setRequestFinish] = useState(false);
	const [orderList, setOrderList] = useState<Array<OrderListItemType>>([]);

	useEffect(() => {
		client.current = innerMqService.createClient();
		subMqMessage();
		query();
		return () => {
			client.current && innerMqService.destroyClient(client.current);
		};
	}, []);

	const subMqMessage = () => {
		client.current?.sub(Topic.REFRESH_ORDER_LIST, () => {
			query();
		});
	}

	const query = () => {
		if (!userInfo.isLogin) {
			setRequestFinish(true);
			return;
		}
		OrderApi.housekeepingSelectPage(
			{
				page: { pageNo: 1, pageSize: 999 },
				criteria: {
					status: props.status == 'cancel' ? undefined : props.status,
					cancel_status: props.status == 'cancel' ? 1 : 0
				},
			}
		).then((res) => {
			setRequestFinish(true);
			if (res && res.success) {
				setOrderList(res.data.list);
			}
		});
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			{
				requestFinish && orderList.length == 0 ?
					<View className={styles.empty}>
						<Image className={styles.image} src={CartEmptyImage}></Image>
						<Text className={styles.text}>先去选择服务吧</Text>
					</View> :
					orderList.map((each, index) => {
						return (
							<OrderUserItem key={index} data={each}></OrderUserItem>
						);
					})
			}
		</View>
	)

}

export default OrderUserList;
