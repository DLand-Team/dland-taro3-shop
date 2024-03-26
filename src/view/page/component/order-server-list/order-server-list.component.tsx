import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { Topic } from "@/service/inner-mq/topic";
import { OrderListItemType } from "@/model/type/order-list-item.type";
import { OrderApi } from "@/http/api/order.api";
import OrderServerItem from "@/view/page/component/order-server-list/item/order-server-item.component";
import CartEmptyImage from "@/assets/image/cart-empty.png";
import styles from "./order-server-list.module.scss";

type OrderServerListPropsType = {
	className?: string,
	status: number,
}

const OrderServerList: React.ComponentType<OrderServerListPropsType> = (props) => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const client = useRef<InnerMqClient>();
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
		OrderApi.housekeepingSelectPage(
			{
				page: { pageNo: 1, pageSize: 999 },
				criteria: { status: props.status, cancel_status: 0 },
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
						<Text className={styles.text}>暂无服务</Text>
					</View> :
					orderList.map((each, index) => {
						return (
							<OrderServerItem key={index} data={each}></OrderServerItem>
						);
					})
			}
		</View>
	)

}

export default OrderServerList;
