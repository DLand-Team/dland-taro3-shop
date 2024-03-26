import React, { useContext, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { getCurrentInstance } from "@tarojs/runtime";
import { Button, Image, RichText, Swiper, SwiperItem, Text, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { ProductApi } from "@/http/api/product.api";
import { UserApi } from "@/http/api/user.api";
import { ProductDetailType } from "@/model/type/product-detail.type";
import { CommonUtil } from "@/util/common-util";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import styles from './housekeeping-detail-page.module.scss';
import { SERVICE_PHONE } from "@/common/static";

const HousekeepingDetailPage: React.FC = () => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const $instance = useRef(getCurrentInstance());
	const container: PageContainerRef = useRef(null);

	const userInfo: UserInfoStore = useStore().userInfoStore;
	const [detail, setDetail] = useState<ProductDetailType>();
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	useEffect(() => {
		let id = Number($instance.current.router?.params.id);
		ProductApi.detail({ id: (id == null ? 1 : id) }).then((res) => {
			if (res != null) {
				res.data.detailHtml = CommonUtil.richHtml(res.data.detailHtml);
				setDetail(res.data);
			}
		});
	}, []);

	const backToHome = () => {
		innerMqService.pub(Topic.HREF_TO_HOME_TAB, { tabId: 0 });
		Taro.navigateBack();
	}

	const addToCart = () => {
		if (detail == null) {
			return;
		}
		if (!userInfo.isLogin) {
			container.current?.openMessage({
				message: '请先登录',
				type: 'warning'
			});
		}
		setIsButtonDisabled(true);
		UserApi.chartAdd({ productId: detail.id }).then((res) => {
			setIsButtonDisabled(false);
			if (res && res.success) {
				innerMqService.pub(Topic.REFRESH_CART_LIST, true);
				container.current?.openMessage({
					message: '添加购物车成功',
					type: 'success'
				});
			} else {
				container.current?.openMessage({
					message: res ? res.msg : '添加购物车失败',
					type: 'error'
				});
			}
		});
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
								<View className={styles.header}>
									<View className={styles.price}>{detail.price}</View>
									<View className={styles.yuan}>元</View>
									<View className={styles.vip}>
										<View className={styles.left}>会员专享</View>
										<View className={styles.right}>{detail.memberPrice}元</View>
									</View>
									<View className={styles.count}>已售{detail.sold}</View>
								</View>
								<View className={styles.title}>{detail.categoryName}</View>
								<View className={styles.description}>{detail.brief}</View>
							</View>
							<RichText className={styles.richText} nodes={detail.detailHtml}></RichText>
						</FrameScrollContainer> : ''
				}
			</View>
			<View className={styles.bottom}>
				<View className={styles.items}>
					<View className={styles.each}
						  onClick={backToHome}>
						<AtIcon value='home' color='#1A1A1A' size={20}></AtIcon>
						<Text className={styles.text}>回到首页</Text>
					</View>
					<View className={styles.each}
						  onClick={() => Taro.makePhoneCall({ phoneNumber: SERVICE_PHONE })}>
						<AtIcon value='phone' color='#1A1A1A' size={20}></AtIcon>
						<Text className={styles.text}>客服电话</Text>
					</View>
				</View>
				<Button className={styles.button} type='primary' disabled={isButtonDisabled} onClick={addToCart}>
					加入购物车
				</Button>
			</View>
		</PageContainer>
	)

}

export default HousekeepingDetailPage;
