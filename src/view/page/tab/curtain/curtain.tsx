import useStore from "@/hook/store";
import { BannerApi } from "@/http/api/banner.api";
import { BannerType } from "@/model/type/banner.type";
import { CacheStore } from "@/store/cache.store";
import { Image, Swiper, SwiperItem, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { AtCurtain } from "taro-ui";
import styles from "./curtain.module.scss";

export default () => {
	const [isOpened, setIsOpened] = useState(false);
	const [imgList, setImgList] = useState<any>([]);
	const cache: CacheStore = useStore().cacheStore;
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
	useEffect(() => {
		BannerApi.list({ criteria: { type: "BOOT" } }).then((res) => {
			if (res && res.success) {
				setImgList(res.data.list);
				res.data.list.length && setIsOpened(true);
			}
		});
	}, []);
	return (
		<View className={styles.container}>
			<AtCurtain
				closeBtnPosition={"top-right"}
				isOpened={isOpened}
				onClose={() => {
					setIsOpened(false);
				}}
			>
				<Swiper
					className={styles.swiper}
					indicatorColor="#999"
					indicatorActiveColor="#333"
					circular
					indicatorDots
					autoplay
				>
					{imgList.map((each, index) => {
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
			</AtCurtain>
		</View>
	);
};
