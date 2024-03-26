import React, { useContext, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { getCurrentInstance } from "@tarojs/runtime";
import { Button, Image, Text, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import dayjs from "dayjs";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import { OrderDetailType } from "@/model/type/order-detail.type";
import { CommentType } from "@/model/type/comment.type";
import { OrderApi } from "@/http/api/order.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import Alert, { AlertRef } from "@/view/component/alert/alert.component";
import ImagePicker from "@/view/component/image-picker/image-picker.component";
import YezhuxinxiImage from '@/assets/image/header-yezhuxinxi.png';
import MapBackgroundImage from '@/assets/image/map-background.png';
import LocationIcon from '@/assets/svg/location-fill.svg';
import NavigationIcon from '@/assets/svg/navigation.svg';
import styles from "./order-detail-server-page.module.scss";

const OrderDetailServerPage: React.FC = () => {

	const $instance = useRef(getCurrentInstance());
	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const container: PageContainerRef = useRef(null);
	const alert = useRef<AlertRef>(null);

	const [detail, setDetail] = useState<OrderDetailType>();
	const [commentList, setCommentList] = useState<Array<CommentType>>([]);
	const startImageList = useRef<Array<string>>([]);
	const finishImageList = useRef<Array<string>>([]);

	useEffect(() => {
		query().then();
	}, []);

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

	const uploadError = () => {
		container.current?.openMessage({
			message: '上传图片失败',
			type: 'error'
		});
	}

	const startOrder = () => {
		alert.current?.openWithText('确认开始', '是否开始服务？', {
			ok: async () => {
				if (detail == null) {
					return;
				}
				if (startImageList.current.length == 0) {
					container.current?.openMessage({
						message: '请添加图片',
						type: 'warning'
					});
					return;
				}
				container.current?.openToast({ message: '提交中', type: 'loading' });
				let res = await OrderApi.housekeepingStartService({ orderId: detail.id, imgList: startImageList.current });
				container.current?.closeToast();
				console.log(res);
				if (res && res.success) {
					container.current?.openToast({
						message: '服务开始成功', type: 'success', during: {
							time: 1500,
							onClose: () => {
								innerMqService.pub(Topic.REFRESH_ORDER_LIST, true);
								Taro.navigateBack();
							}
						}
					});
				} else {
					container.current?.openMessage({
						message: res?.msg == null ? '服务开始失败' : res.msg,
						type: 'error'
					});
				}
			},
		});
	}

	const completeOrder = () => {
		alert.current?.openWithText('确认完成', '是否完成服务？', {
			ok: async () => {
				if (detail == null) {
					return;
				}
				if (finishImageList.current.length == 0) {
					container.current?.openMessage({
						message: '请添加图片',
						type: 'warning'
					});
					return;
				}
				container.current?.openToast({ message: '提交中', type: 'loading' });
				let res = await OrderApi.housekeepingFinishService({ orderId: detail.id, imgList: finishImageList.current });
				container.current?.closeToast();
				console.log(res);
				if (res && res.success) {
					container.current?.openToast({
						message: '服务完成成功', type: 'success', during: {
							time: 1500,
							onClose: () => {
								innerMqService.pub(Topic.REFRESH_ORDER_LIST, true);
								Taro.navigateBack();
							}
						}
					});
				} else {
					container.current?.openMessage({
						message: res?.msg == null ? '服务完成失败' : res.msg,
						type: 'error'
					});
				}
			},
		});
	}

	const openNavigation = () => {
		if (detail == null) {
			return;
		}
		Taro.openLocation({
			longitude: detail.addressLongitude,
			latitude: detail.addressLatitude,
			name: detail.addressDetail,
			address: detail.addressDistrict,
		});
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			{
				detail ?
					<>
						<View className={styles.top}>
							<FrameScrollContainer innerClassName={styles.scrollContent}>
								<View className={styles.customer}>
									<View className={styles.header}>
										<Image className={styles.image} src={YezhuxinxiImage}></Image>
									</View>
									<View className={styles.content}>
										<Image className={styles.image} src=''></Image>
										<View className={styles.info}>
											<Text className={styles.name}>{detail.contactName}</Text>
											<Text className={styles.phone}>{detail.contactPhone}</Text>
										</View>
										<View className={styles.tel}
											  onClick={() => Taro.makePhoneCall({ phoneNumber: detail.contactPhone })}>
											<AtIcon value='phone' size='18' color='#1A1A1A'></AtIcon>
											<Text className={styles.text}>电话</Text>
										</View>
									</View>
								</View>
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
												{dayjs(detail.expectArriveTimeStart).format('MM月DD日 HH:mm')}
											</Text>
										</View>
										<View className='tr'>
											<Text className={`td ${styles.text} ${styles.title}`}>服务项目：</Text>
											<View className={`td ${styles.text}`}>
												{
													detail.detailList.map((each, index) => {
														return (
															<Text key={index}>{each.productName}&nbsp;&nbsp;</Text>
														)
													})
												}
											</View>
										</View>
										<View className='tr'>
											<Text
												className={`td ${styles.text} ${styles.title}`}>备&ensp;&ensp;&ensp;&ensp;注：</Text>
											<Text className={`td ${styles.text}`}>
												{(detail.remark == null || detail.remark == '') ? '未填写' : detail.remark}
											</Text>
										</View>
									</View>
									<View className={styles.location}>
										<Image className={styles.background} src={MapBackgroundImage}
											   mode='scaleToFill'></Image>
										<Image className={styles.icon} src={LocationIcon}></Image>
										<View className={styles.info}>
											<Text className={styles.address}>
												{detail.addressProvince}
												{detail.addressCity}
												{detail.addressDistrict}
												{detail.addressDetail}
												{detail.addressRoom}
											</Text>
											{/*<Text className={styles.distance}>距离您2.24km</Text>*/}
										</View>
										<View className={styles.nav} onClick={openNavigation}>
											<Image className={styles.icon} src={NavigationIcon}></Image>
											<Text className={styles.text1}>导航</Text>
										</View>
									</View>
								</View>
								{
									detail.status == 20 ?
										<View className={styles.situation}>
											<Text className={`${styles.title} ${styles.highlight}`}>
												在开始服务之前需要拍照确认
											</Text>
											<ImagePicker maxCount={9} uploadType='service'
														 onUploadSuccess={(e) => startImageList.current = e}
														 onUploadError={uploadError}></ImagePicker>
										</View> : ''
								}
								{
									detail.status == 30 || detail.status == 40 || detail.status == 50 ?
										<View className={styles.situation}>
											<Text className={styles.title}>开始服务前业主家照片</Text>
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
									detail.status == 30 ?
										<View className={styles.situation}>
											<Text className={`${styles.title} ${styles.highlight}`}>
												在服务后需要拍照确认
											</Text>
											<ImagePicker maxCount={9} uploadType='service'
														 onUploadSuccess={(e) => finishImageList.current = e}
														 onUploadError={uploadError}></ImagePicker>
										</View> : ''
								}
								{
									detail.status == 40 || detail.status == 50 ?
										<View className={styles.situation}>
											<Text className={styles.title}>服务完成后业主家照片</Text>
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
							</FrameScrollContainer>
						</View>
						<View className={styles.bottom}>
							{
								detail.status == 20 ?
									<Button className={styles.button} type='primary' onClick={startOrder}>
										开始服务
									</Button> : ''
							}
							{
								detail.status == 30 ?
									<Button className={styles.button} type='primary' onClick={completeOrder}>
										完成服务
									</Button> : ''
							}
						</View>
					</> : ''
			}
			<Alert ref={alert}></Alert>
		</PageContainer>
	);

}

export default OrderDetailServerPage;
