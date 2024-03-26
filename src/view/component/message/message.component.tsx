import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "@tarojs/components";
import { ViewProps } from "@tarojs/components/types/View";
import { useModuleClass } from "@/hook/style";
import styles from './message.module.scss';

export type OpenMessageParam = { message: string, type: 'info' | 'success' | 'warning' | 'error' };

export type MessageRef = React.Ref<{
	openMessage: (data: OpenMessageParam) => void,
}>;

const Message: React.ComponentType<ViewProps> = forwardRef((props, ref: MessageRef) => {

	const [open, setOpen] = useState(false);
	const [type, setType] = useState('');
	const [message, setMessage] = useState('');
	const closeTimeout = useRef<any>();
	const resetTimeout = useRef<any>();

	const openMessage = async (data: OpenMessageParam) => {
		clearTimeout(closeTimeout.current);
		clearTimeout(resetTimeout.current);
		setOpen(true);
		setType(data.type);
		setMessage(data.message);
		closeTimeout.current = setTimeout(() => {
			closeMessage();
		}, 2000);
	}

	const closeMessage = () => {
		setOpen(false);
		resetTimeout.current = setTimeout(() => {
			setType('');
			setMessage('');
		}, 500);
	}

	useImperativeHandle(ref, () => {
		return {
			openMessage: (data) => openMessage(data)
		}
	});

	return (
		<View className={useModuleClass(styles, {
			'container': true,
			'row-center': true,
			'open': open,
			'info': type == 'info',
			'success': type == 'success',
			'warning': type == 'warning',
			'error': type == 'error',
		}) + ' ' + (props.className ? props.className : '')}>
			{message}
		</View>
	);

});

export default Message;
