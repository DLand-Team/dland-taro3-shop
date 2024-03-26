import React, { useContext, useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { observer } from "mobx-react";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { GoodsListItemType } from "@/model/type/goods-list-item.type";
import { PointsApi } from "@/http/api/points.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import GoodsItem from "@/view/page/single/points-mall/item/goods-item.component";
import styles from './points-mall-page.module.scss';

const PointsMallPage: React.FC = observer(() => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const userInfo: UserInfoStore = useStore().userInfoStore;

	const [goodsList, setGoodsList] = useState<Array<GoodsListItemType>>([]);

	useEffect(() => {
		innerMqService.pub(Topic.UPDATE_USERINFO, true);
		PointsApi.productSelectPage({ page: { pageNo: 1, pageSize: 999 } }).then((res) => {
			if (res) {
				setGoodsList(res.data.list);
			}
		});
	}, []);

	return (
		<FrameScrollContainer innerClassName={styles.container}>
			<View className={styles.points}>
				<Text className={styles.value}>{userInfo.inst.totalPoints}</Text>
				<View className={styles.buttons}>
					<Text className={styles.each}
						  onClick={() => Taro.navigateTo({ url: '/view/page/single/point-history/point-history-page' })}>积分记录</Text>
					<View className={styles.divider}></View>
					<Text className={styles.each}
						  onClick={() => Taro.navigateTo({ url: '/view/page/single/exchange-history/exchange-history-page' })}>兑换记录</Text>
				</View>
			</View>
			<View className={styles.goods}>
				{
					goodsList.map((each, index) => {
						return (
							<GoodsItem data={each} key={index}
									   onButtonClick={() => Taro.navigateTo({ url: '/view/page/single/goods-detail/goods-detail-page?id=' + each.id })}></GoodsItem>
						)
					})
				}
			</View>
		</FrameScrollContainer>
	)

});

export default PointsMallPage;
