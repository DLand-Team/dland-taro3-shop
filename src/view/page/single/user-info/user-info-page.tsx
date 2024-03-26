import React, { useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { Button, Image, Text, View } from "@tarojs/components";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { CommonUtil } from "@/util/common-util";
import { PlatformUtil } from "@/util/platform-util";
import { UserApi } from "@/http/api/user.api";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import InputItem from "@/view/component/input-item/input-item.component";
import UserNoLoginLogoImage from '@/assets/image/user-no-login-logo.png';
import GenderMaleNoSelectedImage from '@/assets/image/gender-male-no-selected.png';
import GenderMaleSelectedImage from '@/assets/image/gender-male-selected.png';
import GenderFemaleNoSelectedImage from '@/assets/image/gender-female-no-selected.png';
import GenderFemaleSelectedImage from '@/assets/image/gender-female-selected.png';
import styles from './user-info-page.module.scss';

// const tempImageUrl = 'https://sports-images.oss-cn-shanghai.aliyuncs.com/user/6LrTDaXyTQAj68d407431e55b27722931c7563487e4c-20230303153058.jpeg';

const UserInfoPage: React.FC = () => {

	const container: PageContainerRef = useRef(null);
	const userInfo: UserInfoStore = useStore().userInfoStore;

	const [avatar, setAvatar] = useState(userInfo.inst.avatar || UserNoLoginLogoImage);
	const [nickname, setNickname] = useState(userInfo.inst.nickname);
	const [gender, setGender] = useState(userInfo.inst.gender || 1);
	const [mobile, setMobile] = useState(userInfo.inst.mobile);

	const chooseImage = async (e) => {
		// 上传头像
		let uploadResult = await PlatformUtil.uploadFile(e.detail.avatarUrl, 'avatar');
		if (uploadResult && uploadResult.success) {
			// 更新头像显示
			setAvatar(uploadResult.data);
		} else {
			// setAvatar(tempImageUrl);
			container.current?.openMessage({
				message: '上传头像失败',
				type: 'error'
			});
		}
	}

	const check = (): boolean => {
		if (CommonUtil.stringIsNull(avatar)) {
			container.current?.openMessage({
				message: '需上传头像',
				type: 'warning'
			});
			return false;
		}
		if (CommonUtil.stringIsNull(nickname)) {
			container.current?.openMessage({
				message: '用户名不能为空',
				type: 'warning'
			});
			return false;
		}
		if (CommonUtil.stringIsNull(mobile)) {
			container.current?.openMessage({
				message: '手机号不能为空',
				type: 'warning'
			});
			return false;
		}
		return true;
	}

	const submit = async () => {
		if (!check()) {
			return;
		}
		let syncResult = await UserApi.syncUserInfo({ nickname: nickname, avatar: avatar, gender: gender });
		if (syncResult && syncResult.success) {
			userInfo.inst.avatar = syncResult.data.avatar;
			userInfo.inst.nickname = syncResult.data.nickname;
			userInfo.inst.gender = syncResult.data.gender;
			userInfo.setUserInfo(userInfo.inst);
			Taro.navigateBack();
		} else {
			container.current?.openMessage({
				message: '更新信息失败',
				type: 'error'
			});
		}
	}

	return (
		<PageContainer ref={container}>
			<View className={styles.container}>
				<Button className={styles.imageButton}
						open-type='chooseAvatar' onChooseAvatar={chooseImage}>
					<Image className={styles.image} src={userInfo.inst.avatar || avatar}></Image>
				</Button>
				<View className={styles.input}>
					<InputItem title='昵称' titleWidthFix titleFontWeight='bold'
							   type='nickname' placeholder='请输入昵称' value={nickname}
							   onInput={(e) => setNickname(e.detail.value)}></InputItem>
					<View className={styles.genderSelector}>
						<Text className={styles.title}>性别</Text>
						<View className={styles.radio}>
							<View className={styles.each} onClick={() => setGender(1)}>
								<Image className={styles.image}
									   src={gender == 1 ? GenderMaleSelectedImage : GenderMaleNoSelectedImage}></Image>
								<Text className={styles.value}
									  style={{ color: gender == 1 ? '#1A1A1A' : '#9DA3B2' }}>男</Text>
							</View>
							<View className={styles.each} onClick={() => setGender(2)}>
								<Image className={styles.image}
									   src={gender == 2 ? GenderFemaleSelectedImage : GenderFemaleNoSelectedImage}></Image>
								<Text className={styles.value}
									  style={{ color: gender == 2 ? '#1A1A1A' : '#9DA3B2' }}>女</Text>
							</View>
						</View>
					</View>
					<InputItem title='手机号' titleWidthFix titleFontWeight='bold' placeholder='请输入手机号'
							   value={mobile} onInput={(e) => setMobile(e.detail.value)}></InputItem>
				</View>
				<Button className={styles.button} type='primary' onClick={submit}>更新信息</Button>
			</View>
		</PageContainer>
	);

}

export default UserInfoPage;
