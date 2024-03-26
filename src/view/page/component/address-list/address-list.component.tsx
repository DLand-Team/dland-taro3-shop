import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { Topic } from "@/service/inner-mq/topic";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { UserApi } from "@/http/api/user.api";
import { AddressType } from "@/model/type/address.type";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import Alert, { AlertRef } from "@/view/component/alert/alert.component";
import AddressItem from "@/view/page/component/address-list/item/address-item.component";
import styles from "./address-list.module.scss";

type AddressListPropsType = {
	className?: string,
	selectable?: boolean,
	onSelected?: (e: AddressType | undefined) => void,
	ref?: AddressListRef,
}

export type AddressListRef = React.Ref<{
	setSelectedId: (e?: number) => void,
}>;

const AddressList: React.ComponentType<AddressListPropsType> = forwardRef((props, ref: AddressListRef) => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const cache: CacheStore = useStore().cacheStore;
	const client = useRef<InnerMqClient>();
	const container: PageContainerRef = useRef(null);
	const deleteAlert = useRef<AlertRef>(null);

	const [addressList, setAddressList] = useState<Array<AddressType>>([]);
	const [selectedId, setSelectedId] = useState<number | undefined>();

	useEffect(() => {
		client.current = innerMqService.createClient();
		subMqMessage();
		query();
		return () => {
			client.current && innerMqService.destroyClient(client.current);
		};
	}, []);

	useEffect(() => {
		checkSelected();
	}, [addressList]);

	useImperativeHandle(ref, () => {
		return {
			setSelectedId: (e) => setSelectedId(e),
		}
	});

	const subMqMessage = () => {
		client.current?.sub(Topic.REFRESH_ADDRESS_LIST, () => {
			query();
		});
	}

	const query = () => {
		UserApi.addressList().then((res) => {
			if (res && res.success) {
				setAddressList(res.data.list);
			}
		});
	}

	const checkSelected = () => {
		let hasSelectedId = false;
		for (let i = 0; i < addressList.length; i++) {
			if (selectedId == addressList[i].id) {
				hasSelectedId = true;
				break;
			}
		}
		if (!hasSelectedId) {
			setSelectedId(undefined);
			props.onSelected && props.onSelected(undefined);
		}
	}

	const select = (e: AddressType) => {
		if (e.id == selectedId) {
			setSelectedId(undefined);
			props.onSelected && props.onSelected(undefined);
		} else {
			setSelectedId(e.id);
			props.onSelected && props.onSelected(e);
		}
	}

	const edit = (e: AddressType) => {
		cache.setEditAddress(e);
		Taro.navigateTo({ url: '/view/page/single/address-input/address-input-page' });
	}

	const remove = (e: number) => {
		deleteAlert.current?.open({
			ok: () => {
				container.current?.openToast({ message: '删除中', type: 'loading' });
				UserApi.addressDelete({ id: e }).then((res) => {
					container.current?.closeToast();
					query();
					if (res?.success) {
						container.current?.openMessage({
							message: '删除地址成功',
							type: 'success'
						});
					} else {
						container.current?.openMessage({
							message: '删除地址失败',
							type: 'error'
						});
					}
				});
			},
		});
	}

	return (
		<PageContainer className={`${styles.container} ${props.className ? props.className : ''}`} ref={container}>
			{
				addressList.map((each, index) => {
					return (
						<AddressItem data={each} key={index}
									 selected={props.selectable ? (selectedId == each.id ? 2 : 1) : 0}
									 onClick={() => select(each)}
									 onEditClick={() => edit(each)} onRemoveClick={remove}></AddressItem>
					);
				})
			}
			<Alert ref={deleteAlert} title='确认' content='是否删除该地址'></Alert>
		</PageContainer>
	);

});

export default AddressList;
