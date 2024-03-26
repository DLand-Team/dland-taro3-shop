import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Observable, Subscriber } from "rxjs";
import styles from './alert.module.scss';

type AlertPropsType = {
	title?: string,
	content?: string,
	ref?: React.Ref<AlertRef>,
}

type callbackType = 'ok' | 'cancel';

export type AlertRef = {
	openWithText: (title?: string, content?: string, callback?: { [key in callbackType]?: () => void }) => void,
	open: (callback?: { [key in callbackType]?: () => void }) => void,
}

const Alert: React.ComponentType<AlertPropsType> = forwardRef((props, ref?: React.Ref<AlertRef>) => {

	const [isOpen, setIsOpen] = useState(false);
	const [display, setDisplay] = useState('none');
	const [alertTitle, setAlertTitle] = useState<string>();
	const [alertContent, setAlertContent] = useState<string>();
	const [subscriber, setSubscriber] = useState<Subscriber<callbackType>>();

	useEffect(() => {
		setAlertTitle(props.title);
		setAlertContent(props.content);
		return () => {
			subscriber?.unsubscribe();
			setSubscriber(undefined);
		}
	}, []);

	useImperativeHandle(ref, () => ({
		openWithText: (title?: string, content?: string, callback?: { [key in callbackType]?: () => void }) => {
			doOpen(title, content, callback);
		},
		open: (callback?: { [key in callbackType]?: () => void }) => {
			doOpen(undefined, undefined, callback);
		}
	}));

	const doOpen = (title?: string, content?: string, callback?: { [key in callbackType]?: () => void }): void => {
		if (title) {
			setAlertTitle(title);
		}
		if (content) {
			setAlertContent(content);
		}
		setDisplay('flex');
		setTimeout(() => {
			setIsOpen(true);
		}, 10);
		const stream$ = new Observable<callbackType>(s => setSubscriber(s));
		stream$.subscribe({
			next: (e: callbackType) => {
				if (callback) {
					let cb = callback[e];
					cb && cb();
				}
				subscriber?.unsubscribe();
				setSubscriber(undefined);
			}
		});
	}

	const cancel = (): void => {
		setIsOpen(false);
		subscriber?.next('cancel');
		setTimeout(() => {
			setDisplay('none');
		}, 360);
	}

	const ok = (): void => {
		setIsOpen(false);
		subscriber?.next('ok');
		setTimeout(() => {
			setDisplay('none');
		}, 360);
	}

	return (
		<View className={`${styles.container} ${isOpen ? styles.open : styles.close}`}
			  style={{ display: display }}>
			<View className={styles.alert}>
				<Text className={styles.title}>{alertTitle}</Text>
				<Text className={styles.content}>{alertContent}</Text>
				<View className={styles.buttons}>
					<View className={`${styles.each} ${styles.cancel}`} onClick={() => cancel()}>取消</View>
					<View className={`${styles.each} ${styles.confirm}`} onClick={() => ok()}>确定</View>
				</View>
			</View>
		</View>
	);

})

export default Alert;
