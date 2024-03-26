import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";
import { Image, Text, View } from "@tarojs/components";
import { CouponType } from "@/model/type/coupon.type";
import { UserApi } from "@/http/api/user.api";
import CouponItem from "@/view/page/component/coupon-list/item/coupon-item.component";
import styles from "./coupon-list.module.scss";
import CartEmptyImage from "@/assets/image/cart-empty.png";

type CouponListPropsType = {
	className?: string,
	status?: number,
	selectable?: boolean,
	onSelected?: (e: CouponType | undefined) => void,
	ref?: CouponListRef,
}

export type CouponListRef = React.Ref<{
	setSelectedId: (e?: number) => void,
}>;

const CouponList: React.ComponentType<CouponListPropsType> = forwardRef((props, ref: CouponListRef) => {

	const [requestFinish, setRequestFinish] = useState(false);
	const [couponList, setCouponList] = useState<Array<CouponType>>([]);
	const [selectedId, setSelectedId] = useState<number | undefined>();

	useEffect(() => {
		UserApi.couponList({
			criteria: {
				valid: 1,
				status: props.status,
				endTimeFrom: dayjs().format('YYYY-MM-DD'),
			}
		}).then((res) => {
			setRequestFinish(true);
			if (res) {
				setCouponList(res.data.list);
				// {
				// 	id: 1,
				// 	valid: 1,
				// 	userId: 1,
				// 	couponId: 1,
				// 	code: "1",
				// 	status: 1,
				// 	createTime: Date.now().toString(),
				// 	createUser: "1",
				// 	creditPrice: 1,
				// 	endTime: Date.now().toString(),
				// 	mobile: "123",
				// 	modifyTime: "123",
				// 	modifyUser: "123",
				// 	startTime: Date.now().toString(),
				// 	title: "123",
				// 	useTime: "2q13",
				// 	productNameList:["11243","123123"]
				// }
			}
		});
	}, []);

	useImperativeHandle(ref, () => {
		return {
			setSelectedId: (e) => setSelectedId(e),
		}
	});

	const select = (e: CouponType) => {
		if (e.id == selectedId) {
			setSelectedId(undefined);
			props.onSelected && props.onSelected(undefined);
		} else {
			setSelectedId(e.id);
			props.onSelected && props.onSelected(e);
		}
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			{
				requestFinish && couponList.length == 0 ?
					<View className={styles.empty}>
						<Image className={styles.image} src={CartEmptyImage}></Image>
						<Text className={styles.text}>暂无优惠券</Text>
					</View> :
					couponList.map((each, index) => {
						return (
							<CouponItem data={each} key={index}
										selected={
											each.status == 1 ? 3 :
												(props.selectable ? (selectedId == each.id ? 2 : 1) : 0)
										}
										onClick={() => each.status == 0 && select(each)}></CouponItem>
						)
					})
			}
		</View>
	);

});

export default CouponList;
