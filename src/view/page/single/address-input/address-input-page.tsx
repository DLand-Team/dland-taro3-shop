import React, { useContext, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { Button } from "@tarojs/components";
import { AppProvider } from "@/app-provider";
import { InnerMqService, PersistentType } from "@/service/inner-mq/service/inner-mq.service";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { CommonUtil } from "@/util/common-util";
import { UserApi } from "@/http/api/user.api";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import ListItem from "@/view/component/list-item/list-item.component";
import InputItem from "@/view/component/input-item/input-item.component";
import styles from "./address-input-page.module.scss";

const AddressInputPage: React.FC = () => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const cache: CacheStore = useStore().cacheStore;
	const container: PageContainerRef = useRef(null);

	const [id, setId] = useState<number | null>();
	const [district, setDistrict] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [longitude, setLongitude] = useState<number>();
	const [latitude, setLatitude] = useState<number>();
	const [room, setRoom] = useState<string>('');
	const [contactName, setContactName] = useState<string>('');
	const [contactPhone, setContactPhone] = useState<string>('');

	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	useEffect(() => {
		if (cache.editAddress) {
			setId(Number(cache.editAddress.id));
			setDistrict(cache.editAddress.district);
			setAddress(cache.editAddress.address);
			setRoom(cache.editAddress.room);
			setLatitude(cache.editAddress.latitude);
			setLongitude(cache.editAddress.longitude);
			setContactName(cache.editAddress.contactName);
			setContactPhone(cache.editAddress.contactPhone);
		}
	}, []);

	const check = (): boolean => {
		if (CommonUtil.stringIsNull(district)) {
			container.current?.openMessage({ message: '地址不能为空', type: 'warning' });
			return false;
		}
		if (CommonUtil.stringIsNull(room)) {
			container.current?.openMessage({ message: '门牌号不能为空', type: 'warning' });
			return false;
		}
		if (CommonUtil.stringIsNull(contactName)) {
			container.current?.openMessage({ message: '联系人不能为空', type: 'warning' });
			return false;
		}
		if (CommonUtil.stringIsNull(contactPhone)) {
			container.current?.openMessage({ message: '手机号不能为空', type: 'warning' });
			return false;
		}
		return true;
	}

	const submit = () => {
		if (!check()) {
			return;
		}
		id == null ? insert() : update();
	}

	const insert = () => {
		if (longitude == null || latitude == null) {
			return;
		}
		setIsButtonDisabled(true);
		container.current?.openToast({ message: '保存中', type: 'loading' });
		UserApi.addressInsert({
			province: '', city: '', district: district,
			address: address, room: room, longitude: longitude, latitude: latitude,
			contactName: contactName, contactPhone: contactPhone,
		}).then((res) => {
			setIsButtonDisabled(false);
			container.current?.closeToast();
			innerMqService.pub(Topic.REFRESH_ADDRESS_LIST, true);
			if (res?.success) {
				innerMqService.pub(
					Topic.ADDRESS_MANAGEMENT_PAGE_MESSAGE,
					{ message: '保存成功', type: 'success' },
					{ persistent: true, type: PersistentType.ON_ONCE_SUB }
				);
				Taro.navigateBack();
			} else {
				container.current?.openMessage({ message: '保存失败', type: 'error' });
			}
		});
	}

	const update = () => {
		if (id == null || longitude == null || latitude == null) {
			return;
		}
		UserApi.addressUpdate({
			id: id, province: '', city: '', district: district,
			address: address, room: room, longitude: longitude, latitude: latitude,
			contactName: contactName, contactPhone: contactPhone,
		}).then((res) => {
			innerMqService.pub(Topic.REFRESH_ADDRESS_LIST, true);
			if (res?.success) {
				innerMqService.pub(
					Topic.ADDRESS_MANAGEMENT_PAGE_MESSAGE,
					{ message: '保存成功', type: 'success' },
					{ persistent: true, type: PersistentType.ON_ONCE_SUB }
				);
				Taro.navigateBack();
			} else {
				container.current?.openMessage({ message: '保存失败', type: 'error' });
			}
		});
	}

	const chooseLocation = () => {
		Taro.chooseLocation({
			longitude: longitude,
			latitude: latitude,
			success: (res) => {
				setDistrict(res.address);
				setAddress(res.name);
				setLongitude(res.longitude);
				setLatitude(res.latitude);
			}
		});
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<ListItem title='地址' titleFontWeight='bold' titleWidthFix
					  extraText={CommonUtil.stringIsNull(district) ? '选择位置' : district + address}
					  extraTextHighLight={!CommonUtil.stringIsNull(district)}
					  extraTextAlign='left'
					  onClick={chooseLocation}></ListItem>
			{/*<RegionPickerItem title='地区' titleWidthFix titleFontWeight='bold'*/}
			{/*				  showValue={`${province}${city}${district}`} placeholder='请选择省市区'*/}
			{/*				  onChange={regionSelect}></RegionPickerItem>*/}
			<InputItem title='门牌号' titleWidthFix titleFontWeight='bold' placeholder='楼号、门牌等信息'
					   value={room} onInput={(e) => setRoom(e.detail.value)}></InputItem>
			<InputItem title='联系人' titleWidthFix titleFontWeight='bold' placeholder='请输入姓名'
					   value={contactName} onInput={(e) => setContactName(e.detail.value)}></InputItem>
			<InputItem title='手机号' titleWidthFix titleFontWeight='bold' placeholder='请输入手机号'
					   value={contactPhone} onInput={(e) => setContactPhone(e.detail.value)}></InputItem>
			<Button className={styles.button} type='primary' disabled={isButtonDisabled} onClick={submit}>
				保存地址
			</Button>
		</PageContainer>
	);

}

export default AddressInputPage;
