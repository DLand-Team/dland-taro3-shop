import React, { useContext, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { Image, Swiper, SwiperItem, Text, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import { AppProvider } from "@/app-provider";
import {
	InnerMqService,
	PersistentType,
} from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { UserInfoStore } from "@/store/user-info.store";
import { BannerType } from "@/model/type/banner.type";
import { BannerApi } from "@/http/api/banner.api";
import { NoticeType } from "@/model/type/notice.type";
import { NoticeApi } from "@/http/api/notice.api";
import { CategoryType } from "@/model/type/category.type";
import { ProductListItemType } from "@/model/type/product-list-item.type";
import { ProductApi } from "@/http/api/product.api";
import { UserApi } from "@/http/api/user.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, {
	PageContainerRef,
} from "@/view/component/page-container/page-container.component";
import HousekeepingItem from "@/view/page/tab/home/housekeeping-item/housekeeping-item.component";
import HomeTopBackgroundImage from "@/assets/image/home-top-background.png";
import styles from "./home-tab.module.scss";

const HomeTab: React.FC = () => {
	const innerMqService: InnerMqService =
		useContext(AppProvider).innerMqService;
	const container: PageContainerRef = useRef(null);
	const cache: CacheStore = useStore().cacheStore;
	const userInfo: UserInfoStore = useStore().userInfoStore;

	const [bannerList, setBannerList] = useState<Array<BannerType>>([]);
	const [noticeList, setNoticeList] = useState<Array<NoticeType>>([]);
	const [categoryList, setCategoryList] = useState<
		Array<Array<CategoryType>>
	>([]);
	const [recommendList, setRecommendList] = useState<
		Array<ProductListItemType>
	>([]);

	const [isCartButtonDisabled, setIsCartButtonDisabled] = useState(false);

	useEffect(() => {
		BannerApi.list({ criteria: { valid: 1, type: "BANNER" } }).then(
			(res) => {
				if (res && res.success) {
					setBannerList(res.data.list);
				}
			}
		);
		NoticeApi.list({ criteria: { valid: 1 } }).then((res) => {
			if (res && res.success) {
				setNoticeList(res.data.list);
			}
		});
		ProductApi.categoryList({ criteria: { top: 1, valid: 1 } }).then(
			(res) => {
				if (res && res.success) {
					let arr = res.data.list;
					let dataList: Array<Array<CategoryType>> = [];
					let index = -1;
					for (let i = 0; i < arr.length; i++) {
						if (i % 8 == 0) {
							index += 1;
							dataList[index] = [];
						}
						dataList[index].push(arr[i]);
					}
					setCategoryList(dataList);
				}
			}
		);
		ProductApi.selectPage({
			criteria: { recommend: 1, valid: 1 },
			page: { pageNo: 1, pageSize: 999 },
		}).then((res) => {
			if (res && res.success) {
				setRecommendList(res.data.list);
			}
		});
	}, []);

	const bannerRedirect = (data: BannerType) => {
		switch (data.redirectType) {
			case "PAGE":
				Taro.navigateTo({
					url: data.linkUrl,
				});
				break;
			case "IMAGE":
				Taro.previewImage({ urls: [data.redirectImgUrl] });
				break;
			case "PRODUCT":
				Taro.navigateTo({
					url:
						"/view/page/single/housekeeping-detail/housekeeping-detail-page?id=" +
						data.productId,
				});
				break;
			case "RICHTEXT":
				cache.setRichTextContent(data.contentHtml);
				Taro.navigateTo({
					url: "/view/page/single/rich-text/rich-text-page",
				});
				break;
			default:
				break;
		}
	};

	const hrefToCatalogTab = (id: number) => {
		innerMqService.pub(
			Topic.HREF_TO_HOME_TAB,
			{ tabId: 1, param: { id: id } },
			{ persistent: true, type: PersistentType.ON_ONCE_SUB }
		);
	};

	const addCart = (e: ProductListItemType) => {
		if (!userInfo.isLogin) {
			container.current?.openMessage({
				message: "登录后才能添加购物车",
				type: "warning",
			});
			return;
		}
		if (isCartButtonDisabled) {
			return;
		}
		setIsCartButtonDisabled(true);
		UserApi.chartAdd({ productId: e.id }).then((res) => {
			setIsCartButtonDisabled(false);
			if (res && res.success) {
				innerMqService.pub(Topic.REFRESH_CART_LIST, true);
				container.current?.openMessage({
					message: "添加购物车成功",
					type: "success",
				});
			} else {
				container.current?.openMessage({
					message: res ? res.msg : "添加购物车失败",
					type: "error",
				});
			}
		});
	};

	return (
		<>
			<Image
				className={styles.background}
				src={HomeTopBackgroundImage}
				mode="widthFix"
			></Image>
			<PageContainer ref={container}>
				<FrameScrollContainer
					innerClassName={styles.container}
					showScrollbar={false}
				>
					<View
						className={styles.search}
						onClick={() =>
							Taro.navigateTo({
								url: "/view/page/single/search/search-page",
							})
						}
					>
						<AtIcon
							className={styles.icon}
							value="search"
							size="18"
							color="#797E8E"
						></AtIcon>
						<Text className={styles.text}>搜索你想要的服务</Text>
					</View>
					<View className={styles.banner}>
						<Swiper
							className={styles.swiper}
							indicatorColor="#999"
							indicatorActiveColor="#333"
							circular
							indicatorDots
							autoplay
						>
							{bannerList.map((each, index) => {
								return (
									<SwiperItem
										key={index}
										onClick={() => bannerRedirect(each)}
									>
										<Image
											className={styles.swiperImage}
											src={each.coverUrl}
										></Image>
									</SwiperItem>
								);
							})}
						</Swiper>
					</View>
					<View className={styles.tip}>
						<Swiper
							className={styles.swiper}
							vertical
							circular
							autoplay
						>
							{noticeList.map((each, index) => {
								return (
									<SwiperItem key={index}>
										<Text className={styles.text}>
											{each.content}
										</Text>
									</SwiperItem>
								);
							})}
						</Swiper>
					</View>
					<View className={styles.category}>
						<Swiper className={styles.swiper}>
							{categoryList.map((param, i) => {
								return (
									<SwiperItem key={i}>
										<View className={styles.eachParam}>
											{param.map((each, j) => {
												return (
													<View
														className={styles.each}
														key={j}
														onClick={() =>
															hrefToCatalogTab(
																each.id
															)
														}
													>
														<Image
															className={
																styles.image
															}
															src={each.imgUrl}
														></Image>
														<Text
															className={
																styles.title
															}
														>
															{each.name}
														</Text>
													</View>
												);
											})}
										</View>
									</SwiperItem>
								);
							})}
						</Swiper>
					</View>
					<View className={styles.recommend}>
						<Text className={styles.title}>为你推荐</Text>
						<View className={styles.list}>
							{recommendList.map((each, index) => {
								return (
									<HousekeepingItem
										data={each}
										key={index}
										addCartClick={() => addCart(each)}
									></HousekeepingItem>
								);
							})}
						</View>
					</View>
				</FrameScrollContainer>
			</PageContainer>
		</>
	);
};

export default HomeTab;
