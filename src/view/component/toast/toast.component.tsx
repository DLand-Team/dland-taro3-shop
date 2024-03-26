import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ViewProps } from "@tarojs/components/types/View";
import { View } from "@tarojs/components";
import { AtIcon } from 'taro-ui';
import { useModuleClass } from "@/hook/style";
import styles from "./toast.module.scss";

export type OpenToastParam = {
	message: string,
	type: 'loading' | 'success',
	during?: { time: number, onClose?: () => void }
};

export type ToastRef = React.Ref<{
	openToast: (data: OpenToastParam) => void,
	closeToast: () => void,
}>;

const Toast: React.ComponentType<ViewProps> = forwardRef((props, ref: ToastRef) => {

	const [open, setOpen] = useState(false);
	const [type, setType] = useState('');
	const [message, setMessage] = useState('');
	const duringTimeout = useRef<any>(null);

	const openToast = (data: OpenToastParam) => {
		setOpen(true);
		setType(data.type);
		setMessage(data.message);
		if (data.during) {
			duringTimeout.current = setTimeout(() => {
				setOpen(false);
				data.during?.onClose && data.during.onClose();
				duringTimeout.current = null;
			}, data.during.time);
		}
	}

	const closeToast = () => {
		setOpen(false);
		clearTimeout(duringTimeout.current);
	}

	useImperativeHandle(ref, () => {
		return {
			openToast: (data) => openToast(data),
			closeToast: () => closeToast(),
		}
	});

	return (
		<>
			{
				open ? <View className={styles.mask}></View> : ''
			}
			<View className={useModuleClass(styles, {
				'container': true,
				'open': open,
				'close': !open,
			}) + ' ' + (props.className ? props.className : '')}>
				{
					type == 'loading' && open ?
						<AtIcon className={styles.animateCircle}
								value='loading' size='38' color='#FFFFFF'></AtIcon> : ''
				}
				{
					type == 'success' && open ?
						<AtIcon value='check-circle' size='38' color='#FFFFFF'></AtIcon> : ''
				}
				{
					open ? <View className={styles.message}>{message}</View> : ''
				}
			</View>
		</>
	);

});

export default Toast;
