import React from "react";
import Taro from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import dayjs from "dayjs";
import { OrderListItemType } from "@/model/type/order-list-item.type";
import ListItem from "@/view/component/list-item/list-item.component";
import LocationFillSvg from "@/assets/svg/location-fill.svg";
import styles from "./order-server-item.module.scss";

type OrderServerItemPropsType = {
	className?: string,
	data: OrderListItemType,
}

const OrderServerItem: React.ComponentType<OrderServerItemPropsType> = (props) => {

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<View className={styles.title}>
				<ListItem title={props.data.addressDetail} heightSize='small' extraText='查看订单'
						  icon={LocationFillSvg} noBorder
						  onClick={() => Taro.navigateTo({ url: '/view/page/single/order-detail-server/order-detail-server-page?id=' + props.data.id })}></ListItem>
			</View>
			<View className={styles.detail}>
				<View className='table'>
					<View className='tr'>
						<Text className={`td ${styles.text} ${styles.title}`}>服务地址：</Text>
						<Text className={`td ${styles.text} ${styles.content}`}>
							{props.data.addressProvince}
							{props.data.addressCity}
							{props.data.addressDistrict}
							{props.data.addressDetail}
							{props.data.addressRoom}
						</Text>
					</View>
					<View className='tr'>
						<Text className={`td ${styles.text} ${styles.title}`}>上门时间：</Text>
						<Text className={`td ${styles.text} ${styles.content}`}>
							{dayjs(props.data.expectArriveTimeStart).format('MM月DD日 HH:mm')}
						</Text>
					</View>
					{
						props.data.productNameList.map((each, index) => {
							return (
								<View className='tr' key={index}>
									<Text className={`td ${styles.text} ${styles.title}`}>
										{index == 0 ? '服务项目：' : ''}
									</Text>
									<Text className={`td ${styles.text} ${styles.content}`}>{each}</Text>
								</View>
							);
						})
					}
				</View>
			</View>
		</View>
	);

}

export default OrderServerItem;
