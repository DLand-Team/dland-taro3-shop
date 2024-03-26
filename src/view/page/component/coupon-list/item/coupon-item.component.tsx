import React from "react";
import { Image, Text, View } from "@tarojs/components";
import dayjs from "dayjs";
import { CouponType } from "@/model/type/coupon.type";
import CheckSVG from "@/assets/svg/check-fill.svg";
import CouponExpiredImage from "@/assets/image/coupon-expired.png";
import styles from './coupon-item.module.scss';

type CouponItemPropsType = {
	className?: string,
	data: CouponType,
	onClick?: (id: number) => void,
	selected: 0 | 1 | 2 | 3, // 不显示，未选中，已选中，已过期
}

const CouponItem: React.ComponentType<CouponItemPropsType> = (props) => {

	const click = () => {
		props.onClick && props.onClick(props.data.id);
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}
			  onClick={click}>
			<View className={styles.left}>
				<Text className={styles.amount}>{props.data.creditPrice}元</Text>
				<Text className={styles.tip}>抵扣券</Text>
			</View>
			<View className={styles.content}>
				<Text className={styles.title}>{props.data.title}</Text>
				<Text className={styles.date}>
					{dayjs(props.data.startTime).format('YYYY-MM-DD')}~
					{dayjs(props.data.endTime).format('YYYY-MM-DD')}
				</Text>
				<Text className={styles.each}>适用项目：{props.data.productNameList.join(',')}</Text>
			</View>
			{props.selected == 1 || props.selected == 2 ?
				<View className={styles.selector}>
					{props.selected == 2 ?
						<Image className={styles.image} src={CheckSVG}></Image> :
						<View className={styles.circle}></View>
					}
				</View> : ''
			}
			{props.selected == 3 ?
				<View className={styles.expired}>
					<Image className={styles.image} src={CouponExpiredImage}></Image>
				</View> : ''
			}
		</View>
	);

}

export default CouponItem;
