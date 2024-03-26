import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Taro from "@tarojs/taro";
import { ViewProps } from "@tarojs/components/types/View";
import { View } from '@tarojs/components';
import { AtMessage, AtToast } from 'taro-ui';
import Message, { MessageRef, OpenMessageParam } from "@/view/component/message/message.component";
import Toast, { ToastRef, OpenToastParam } from "@/view/component/toast/toast.component";
import styles from './page-container.module.scss';

export type PageContainerRef = React.Ref<{
	openMessage: (data: OpenMessageParam) => void,
	openToast: (data: OpenToastParam) => void,
	closeToast: () => void,
	openTaroMessage: (data: { message: string, type: 'info' | 'success' | 'warning' | 'error' }) => void,
	openTaroToast: (data: {
		message: string,
		duration: number,
		mask: boolean
	}) => void,
}>;

const PageContainer: React.ComponentType<ViewProps> = forwardRef((props, ref: PageContainerRef) => {

	const message: MessageRef = useRef(null);
	const toast: ToastRef = useRef(null);

	const [toastOpen, setToastOpen] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [toastDuration, setToastDuration] = useState(0);
	const [toastMask, setToastMask] = useState(false);

	useEffect(() => {
	}, []);

	const openMessage = (data: OpenMessageParam) => {
		message.current?.openMessage(data);
	}

	const openToast = (data: OpenToastParam) => {
		toast.current?.openToast(data);
	}

	const closeToast = () => {
		toast.current?.closeToast();
	}

	const openTaroMessage = (data) => {
		Taro.atMessage({
			message: data.message,
			type: data.type,
		})
	}

	const openTaroToast = (data) => {
		setToastOpen(true);
		setToastMessage(data.message);
		setToastDuration(data.duration);
		setToastMask(data.mask);
	}

	useImperativeHandle(ref, () => {
		return {
			openMessage: (data) => openMessage(data),
			openTaroMessage: (data) => openTaroMessage(data),
			openToast: (data) => openToast(data),
			closeToast: () => closeToast(),
			openTaroToast: (data) => openTaroToast(data),
		}
	});

	return (
		<View className={styles['page-container'] + ' ' + (props.className ? props.className : '')}>
			<Message ref={message}></Message>
			<Toast ref={toast}></Toast>
			<AtMessage></AtMessage>
			<AtToast isOpened={toastOpen} text={toastMessage} duration={toastDuration} hasMask={toastMask}
					 onClose={() => setToastOpen(false)}></AtToast>
			{props.children}
		</View>
	);

});

export default PageContainer;
