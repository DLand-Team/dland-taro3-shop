import React, { useContext, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { getCurrentInstance } from "@tarojs/runtime";
import { Button, Image, Text, View } from "@tarojs/components";
import dayjs from "dayjs";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { OrderDetailType } from "@/model/type/order-detail.type";
import { CommentType } from "@/model/type/comment.type";
import { OrderApi } from "@/http/api/order.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import Alert, { AlertRef } from "@/view/component/alert/alert.component";
import OrderDetailItem from "./item/order-detail-item.component";
import styles from "./order-detail-user-page.module.scss";

const OrderDetailUserPage: React.FC = () => {

	const $instance = useRef(getCurrentInstance());
	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const client = useRef<InnerMqClient>();

	const cache: CacheStore = useStore().cacheStore;
	const container: PageContainerRef = useRef(null);
	const alert = useRef<AlertRef>(null);

	const [detail, setDetail] = useState<OrderDetailType>();
	const [commentList, setCommentList] = useState<Array<CommentType>>([]);

	useEffect(() => {
		client.current = innerMqService.createClient();
		subMqMessage();
		query().then();
		return () => {
			client.current && innerMqService.destroyClient(client.current);
		};
	}, []);

	const subMqMessage = () => {
		client.current?.sub(Topic.REFRESH_ORDER_DETAIL, async () => {
			await query();
		});
	}

	const query = async () => {
		let id = Number($instance.current.router?.params.id);
		let detailRes = await OrderApi.housekeepingDetail({ id: id });
		console.log(detailRes)
		if (detailRes && detailRes.success) {
			setDetail(detailRes.data);
			let commentRes = await OrderApi.commentSelectPage({
				page: { pageNo: 1, pageSize: 999 },
				criteria: {
					userId: detailRes.data.userId,
					housekeeperUserId: detailRes.data.housekeeperId,
					orderId: detailRes.data.id,
					orderSerialId: detailRes.data.serialId,
				},
			});
			if (commentRes && commentRes.success) {
				setCommentList(commentRes.data.list);
			}
		}
	}

	const cancelOrder = () => {
		alert.current?.openWithText('取消订单', '取消后订单费用24小时内将原路退回', {
			ok: async () => {
				if (detail == null) {
					return;
				}
				container.current?.openToast({ message: '取消中', type: 'loading' });
				let res = await OrderApi.housekeepingCancel({ id: detail.id });
				container.current?.closeToast();
				if (res && res.success) {
					container.current?.openToast({
						message: '取消成功', type: 'success', during: {
							time: 1000,
							onClose: () => {
								innerMqService.pub(Topic.REFRESH_ORDER_LIST, true);
								Taro.navigateBack();
							}
						}
					});
				} else {
					container.current?.openMessage({
						message: res?.msg == null ? '取消失败' : res.msg,
						type: 'error'
					});
				}
			},
		});
	}

	const deleteOrder = () => {
		alert.current?.openWithText('确认', '是否删除该订单', {
			ok: async () => {
				if (detail == null) {
					return;
				}
				container.current?.openToast({ message: '删除中', type: 'loading' });
				let res = await OrderApi.housekeepingDelete({ id: detail.id });
				container.current?.closeToast();
				if (res && res.success) {
					container.current?.openToast({
						message: '删除成功', type: 'success', during: {
							time: 1000,
							onClose: () => {
								innerMqService.pub(Topic.REFRESH_ORDER_LIST, true);
								Taro.navigateBack();
							}
						}
					});
				} else {
					container.current?.openMessage({
						message: res?.msg == null ? '删除失败' : res.msg,
						type: 'error'
					});
				}
			},
		});
	}

	const hrefToHousekeeperComment = () => {
		let data = detail!.housekeeper;
		cache.setCommentHousekeeper({
			id: data.id,
			housekeeperAvatar: data.housekeeperAvatar,
			housekeeperName: data.housekeeperName,
			housekeeperLevelName: detail!.housekeeperLevelName,
			housekeeperNo: data.housekeeperNo,
		} as any);
		Taro.navigateTo({ url: '/view/page/single/housekeeper-comment/housekeeper-comment-page' });
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			{detail ?
				<>
					<View className={styles.top}>
						<FrameScrollContainer innerClassName={styles.scrollContent}>
							<View className={styles.detail}>
								<Text className={styles.header}>订单信息</Text>
								<View className='table'>
									<View className='tr'>
										<Text className={`td ${styles.text} ${styles.title}`}>服务地址：</Text>
										<Text className={`td ${styles.text}`}>
											{detail.addressProvince}
											{detail.addressCity}
											{detail.addressDistrict}
											{detail.addressDetail}
											{detail.addressRoom}
										</Text>
									</View>
									<View className='tr'>
										<Text className={`td ${styles.text} ${styles.title}`}>上门时间：</Text>
										<Text className={`td ${styles.text}`}>
											{dayjs(detail.expectArriveTimeStart).format('MM月DD日 HH:mm')}-
											{dayjs(detail.expectArriveTimeEnd).format('HH:mm')}
										</Text>
									</View>
									<View className='tr'>
										<Text className={`td ${styles.text} ${styles.title}`}>联系人员：</Text>
										<Text className={`td ${styles.text}`}>{detail.contactName}</Text>
									</View>
									<View className='tr'>
										<Text className={`td ${styles.text} ${styles.title}`}>联系电话：</Text>
										<Text className={`td ${styles.text}`}>{detail.contactPhone}</Text>
									</View>
									<View className='tr'>
										<Text
											className={`td ${styles.text} ${styles.title}`}>备&ensp;&ensp;&ensp;&ensp;注：</Text>
										<Text className={`td ${styles.text}`}>
											{(detail.remark == null || detail.remark == '') ? '未填写' : detail.remark}
										</Text>
									</View>
								</View>
							</View>
							<View className={styles.list}>
								{
									detail.detailList.map((each, index) => {
										return (
											<View className={styles.each} key={index}>
												<OrderDetailItem data={each}></OrderDetailItem>
											</View>
										);
									})
								}
							</View>
							{
								detail.housekeeper ?
									<View className={styles.housekeeper} onClick={hrefToHousekeeperComment}>
										<Image className={styles.image}
											   src={detail.housekeeper.housekeeperAvatar}></Image>
										<View className={styles.detail}>
											<View className={styles.name}>
												<Text
													className={styles.text}>{detail.housekeeper.housekeeperName}</Text>
												<Text className={styles.ext}>{detail.housekeeperLevelName}</Text>
											</View>
											<View className={styles.info}>
												<Text className={styles.text}>工号 {detail.housekeeperNo}</Text>
											</View>
										</View>
									</View> : ''
							}
							{
								detail.status == 30 || detail.status == 40 || detail.status == 50 ?
									<View className={styles.situation}>
										<Text className={styles.title}>服务前您家的情况</Text>
										<View className={styles.images}>
											{
												detail.imageList.map((each, index) => {
													return (
														<>
															{
																each.type == 'BEFORE' ?
																	<Image className={styles.each}
																		   src={each.imgUrl} key={index}
																		   mode='aspectFit'
																		   onClick={() => Taro.previewImage({ urls: [each.imgUrl] })}></Image> : ''
															}
														</>
													);
												})
											}
										</View>
									</View> : ''
							}
							{
								detail.status == 40 || detail.status == 50 ?
									<View className={styles.situation}>
										<Text className={`${styles.title} ${styles.highlight}`}>服务后您家的情况</Text>
										<View className={styles.images}>
											{
												detail.imageList.map((each, index) => {
													return (
														<>
															{
																each.type == 'AFTER' ?
																	<Image className={styles.each}
																		   src={each.imgUrl} key={index}
																		   mode='aspectFit'
																		   onClick={() => Taro.previewImage({ urls: [each.imgUrl] })}></Image> : ''
															}
														</>
													);
												})
											}
										</View>
									</View> : ''
							}
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
															<Image className={styles.each} src={image} key={j}
																   mode='aspectFit'
																   onClick={() => Taro.previewImage({ urls: [image] })}></Image>
														);
													})
												}
											</View>
										</View>
									);
								})
							}
							{
								(detail.status == 0 || detail.status == 10) && detail.cancelStatus == 0 ?
									<View className={styles.cancel}>
										<Text className={styles.text} onClick={cancelOrder}>取消订单</Text>
									</View> : ''
							}
							{
								detail.cancelStatus == 1 ?
									<View className={styles.cancel}>
										<Text className={styles.text} onClick={deleteOrder}>删除订单</Text>
									</View> : ''
							}
						</FrameScrollContainer>
					</View>
					<View className={styles.bottom}>
						{
							detail.status == 40 && detail.cancelStatus == 0 ?
								<Button className={styles.button} type='default'
										onClick={() => Taro.navigateTo({ url: '/view/page/single/comment-input/comment-input-page?id=' + detail.id })}>
									填写评价
								</Button> : ''
						}
					</View>
				</> : ''}
			<Alert ref={alert}></Alert>
		</PageContainer>
	);

}

export default OrderDetailUserPage;
