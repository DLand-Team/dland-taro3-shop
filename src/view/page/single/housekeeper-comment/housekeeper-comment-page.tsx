import React, { useEffect, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { HousekeeperType } from "@/model/type/housekeeper.type";
import { CommentType } from "@/model/type/comment.type";
import { OrderApi } from "@/http/api/order.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import styles from './housekeeper-comment-page.module.scss';
import Taro from "@tarojs/taro";
import dayjs from "dayjs";

const HousekeeperCommentPage: React.FC = () => {

	const cache: CacheStore = useStore().cacheStore;
	const [housekeeper, setHousekeeper] = useState<HousekeeperType>();
	const [commentList, setCommentList] = useState<Array<CommentType>>([]);

	useEffect(() => {
		if (cache.commentHousekeeper == null) {
			return;
		}
		setHousekeeper(cache.commentHousekeeper);
		OrderApi.commentSelectPage({
			criteria: { housekeeperUserId: cache.commentHousekeeper.id },
			page: { pageNo: 1, pageSize: 999 },
		}).then((res) => {
			if (res && res.success) {
				setCommentList(res.data.list);
			}
		});
	}, []);

	return (
		<FrameScrollContainer innerClassName={styles.container}>
			{
				housekeeper ?
					<View className={styles.housekeeper}>
						<Image className={styles.image} src={housekeeper.housekeeperAvatar}></Image>
						<View className={styles.detail}>
							<View className={styles.name}>
								<Text className={styles.text}>{housekeeper.housekeeperName}</Text>
								<Text className={styles.ext}>{housekeeper.housekeeperLevelName}</Text>
							</View>
							<View className={styles.info}>
								<Text className={styles.text}>工号 {housekeeper.housekeeperNo}</Text>
								{
									housekeeper.totalOrder == null ? '' :
										<Text className={styles.text}>服务 {housekeeper.totalOrder}单</Text>
								}
								{
									housekeeper.avgRate == null ? '' :
										<Text className={styles.text}>评分 {housekeeper.avgRate}</Text>
								}
							</View>
						</View>
					</View> : ''
			}
			<View className={styles.commentList}>
				{
					commentList.map((each, index) => {
						return (
							<View className={styles.comment} key={index}>
								<View className={styles.header}>
									<Image className={styles.logo} src={each.avatar}></Image>
									<View className={styles.center}>
										<Text className={styles.name}>{each.nickname}</Text>
										<Text className={styles.rate}>评分：{each.rate}分</Text>
									</View>
									<Text className={styles.date}>
										{dayjs(each.createTime).format('YYYY-MM-DD HH:mm')}
									</Text>
								</View>
								<Text className={styles.content}>{each.content}</Text>
								<View className={styles.images}>
									{
										each.imgList?.map((image, j) => {
											return (
												<Image className={styles.each} src={image} key={j} mode='aspectFit'
													   onClick={() => Taro.previewImage({ urls: [image] })}></Image>
											);
										})
									}
								</View>
							</View>
						);
					})
				}
			</View>
		</FrameScrollContainer>
	);

}

export default HousekeeperCommentPage;
