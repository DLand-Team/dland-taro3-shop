import React, { useContext, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { getCurrentInstance } from "@tarojs/runtime";
import { Button, Text, Textarea, View } from "@tarojs/components";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import { OrderApi } from "@/http/api/order.api";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import ImagePicker from "@/view/component/image-picker/image-picker.component";
import StarScore from "@/view/component/star-score/star-score.component";
import styles from './comment-input-page.module.scss';

const CommentInputPage: React.FC = () => {

	const $instance = useRef(getCurrentInstance());
	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const container: PageContainerRef = useRef(null);

	const [id, setId] = useState<number>();
	const [content, setContent] = useState<string>();
	const [rate, setRate] = useState<number>(5);
	const imageList = useRef<Array<string>>([]);

	useEffect(() => {
		let params: any = $instance.current.router?.params;
		if (params != null) {
			params.id != null && setId(Number(params.id));
		}
	}, []);

	const uploadError = () => {
		container.current?.openMessage({
			message: '上传图片失败',
			type: 'error'
		});
	}

	const submit = () => {
		if (id == null) {
			return;
		}
		container.current?.openToast({ message: '正在提交', type: 'loading' });
		OrderApi.housekeepingComment({
			id: id, content: content, rate: rate, imgList: imageList.current,
		}).then((res) => {
			container.current?.closeToast();
			if (res && res.success) {
				container.current?.openToast({
					message: '评价成功', type: 'success', during: {
						time: 1000,
						onClose: () => {
							innerMqService.pub(Topic.REFRESH_ORDER_LIST, true);
							innerMqService.pub(Topic.REFRESH_ORDER_DETAIL, true);
							Taro.navigateBack();
						}
					}
				});
			} else {
				container.current?.openMessage({
					message: res ? res.msg : 'fail',
					type: 'error'
				});
			}
		});
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<Textarea className={styles.input} placeholder='请您填写对本次服务的评价吧'
						  onInput={(e) => setContent(e.detail.value)}></Textarea>
				<ImagePicker maxCount={3} uploadType='comment'
							 onUploadSuccess={(e) => imageList.current = e} onUploadError={uploadError}></ImagePicker>
			</View>
			<View className={styles.bottom}>
				<Text className={styles.title}>请您给本次服务打个分吧</Text>
				<StarScore count={5} onChange={(e) => setRate(e)}></StarScore>
				<Button className={styles.button} type='primary' onClick={submit}>提交</Button>
			</View>
		</PageContainer>
	);

}

export default CommentInputPage;
