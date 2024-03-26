import React, { useEffect, useRef, useState } from "react";
import { getCurrentInstance } from "@tarojs/runtime";
import Taro from "@tarojs/taro";
import { Button, Image, RichText, Swiper, SwiperItem, Text, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { GoodsDetailType } from "@/model/type/goods-detail.type";
import { PointsApi } from "@/http/api/points.api";
import { CommonUtil } from "@/util/common-util";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import styles from "./goods-detail-page.module.scss";

const GoodsDetailPage: React.FC = () => {

	const $instance = useRef(getCurrentInstance());
	const userInfo: UserInfoStore = useStore().userInfoStore;
	const container: PageContainerRef = useRef(null);

	const [detail, setDetail] = useState<GoodsDetailType>();

	useEffect(() => {
		let id = Number($instance.current.router?.params.id);
		PointsApi.productDetail({ id: (id == null ? 1 : id) }).then((res) => {
			if (res != null) {
				res.data.detailHtml = CommonUtil.richHtml(res.data.detailHtml);
				setDetail(res.data);
			}
		});
	}, []);

	const submit = () => {
		if (detail == null) {
			return;
		}
		if (!userInfo.isLogin) {
			container.current?.openMessage({
				message: '请先登录',
				type: 'warning'
			});
			return;
		}
		Taro.navigateTo({ url: `/view/page/single/goods-billing-address/goods-billing-address-page?id=${detail.id}` });
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				{
					detail ?
						<FrameScrollContainer innerClassName={styles.scrollContent}>
							<View className={styles.detailImages}>
								<Swiper className={styles.swiper} indicatorColor='#999' indicatorActiveColor='#333'
										circular indicatorDots>
									{
										detail.imgList.map((each, index) => {
											return (
												<SwiperItem key={index}>
													<Image className={styles.swiperImage} src={each}></Image>
												</SwiperItem>
											);
										})
									}
								</Swiper>
							</View>
							<View className={styles.info}>
								<View className={styles.title}>
									<Text className={styles.name}>{detail.name}</Text>
									<Text className={styles.points}>{detail.points}积分</Text>
								</View>
								<Text className={styles.content}>{detail.brief}</Text>
							</View>
							<RichText className={styles.richText} nodes={detail.detailHtml}></RichText>
						</FrameScrollContainer> : ''
				}
			</View>
			<View className={styles.bottom}>
				<Button className={styles.button} type='primary' onClick={submit}>兑换</Button>
			</View>
		</PageContainer>
	)

}

export default GoodsDetailPage;
