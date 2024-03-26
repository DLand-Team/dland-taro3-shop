import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { Button, Image, Text, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import { PlatformUtil } from "@/util/platform-util";
import styles from "./image-picker.module.scss";

type ImagePickerPropsType = {
	className?: string,
	maxCount?: number,
	uploadType?: string,
	onUploadSuccess?: (e: Array<string>) => void,
	onUploadError?: () => void,
}

const ImagePicker: React.ComponentType<ImagePickerPropsType> = (props) => {

	const [imageList, setImageList] = useState<Array<string>>([])

	const removeImage = (index: number) => {
		imageList.splice(index, 1);
		setImageList([...imageList]);
	}

	const chooseImage = () => {
		Taro.chooseMedia({ mediaType: ['image'], count: 1 }).then(async (res) => {
			let tempFilePath = res.tempFiles[0].tempFilePath;
			// 上传图片
			let uploadResult = await PlatformUtil.uploadFile(tempFilePath, props.uploadType ? props.uploadType : 'common');
			if (uploadResult && uploadResult.success) {
				let newArr = [...imageList, ...[uploadResult.data]];
				setImageList(newArr);
				props.onUploadSuccess && props.onUploadSuccess(newArr);
			} else {
				// setImageList([...imageList, ...[tempFilePath]]);
				// -----
				// let newArr = [...imageList, ...[tempFilePath]];
				// setImageList(newArr);
				// props.onUploadSuccess && props.onUploadSuccess(newArr);
				// -----
				props.onUploadError && props.onUploadError();
			}
		}).catch((e) => {
			console.warn(e);
		});
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<View className={styles.content}>
				{
					imageList.map((each, index) => {
						return (
							<View className={styles.image} key={index}>
								<Image className={styles.inst} src={each} key={index} mode='aspectFit'></Image>
								<View className={styles.close} onClick={() => removeImage(index)}>
									<View className={styles.circle}>
										<AtIcon value='close' size={9} color='#FFFFFF'></AtIcon>
									</View>
								</View>
							</View>
						)
					})
				}
				{
					props.maxCount == null || imageList.length < props.maxCount ?
						<Button className={styles.picker} type='default' onClick={chooseImage}>
							<AtIcon value='add' size={20} color='#9DA3B2'></AtIcon>
						</Button> : ''
				}
			</View>
			<Text className={styles.tip}>
				已添加{imageList.length}{props.maxCount == null ? '' : `/${props.maxCount}`}张照片
			</Text>
		</View>
	);

}

export default ImagePicker;
