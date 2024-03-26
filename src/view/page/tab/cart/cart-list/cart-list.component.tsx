import React, { useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import { UserApi } from "@/http/api/user.api";
import { CartType } from "@/model/type/cart.type";
import CheckSVG from "@/assets/svg/check-fill.svg";
import styles from "./cart-list.module.scss";

export type CartListPropsType = {
	className?: string,
	dataList: Array<CartType>,
	onSelected: (e: Array<CartType>) => void,
	onDeleteSuccess: (id: number, msg: string) => void,
	onDeleteFail: (msg: string) => void,
}

const CartList: React.ComponentType<CartListPropsType> = (props) => {

	const [selectedList, setSelectedList] = useState<Array<number>>([]);
	const selectedItems = useRef<Array<CartType>>([]);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const select = (item: CartType): void => {
		let index = selectedList.indexOf(item.id);
		if (index == -1) {
			selectedList.push(item.id);
			selectedItems.current.push(item);
		} else {
			selectedList.splice(index, 1);
			selectedItems.current.splice(index, 1);
		}
		setSelectedList([...selectedList]);
		props.onSelected(selectedItems.current);
	}

	const remove = (id: number) => {
		if (isButtonDisabled) {
			return;
		}
		setIsButtonDisabled(true);
		UserApi.chartDelete({ id: id }).then((res) => {
			setIsButtonDisabled(false);
			if (res && res.success) {
				removeSelectedById(id);
				props.onDeleteSuccess(id, '删除成功');
			} else {
				props.onDeleteFail(res?.msg ? res.msg : '删除失败');
			}
		});
	}

	const removeSelectedById = (id: number) => {
		let list = selectedList.filter((e) => {
			return e != id;
		});
		setSelectedList([...list]);
		selectedItems.current = selectedItems.current.filter((e) => {
			return e.id != id;
		});
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			{
				props.dataList.map((each, index) => {
					return (
						<View className={styles.each} key={index}
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-detail/housekeeping-detail-page?id=' + each.productId })}>
							<View className={styles.check}>
								{
									selectedList.indexOf(each.id) != -1 ?
										<Image className={styles.image} src={CheckSVG} onClick={(e) => {
											e.stopPropagation();
											select(each);
										}}></Image> :
										<View className={styles.circle} onClick={(e) => {
											e.stopPropagation();
											select(each);
										}}></View>
								}
							</View>
							<Image className={styles.image} src={each.productCoverImgUrl}
								   onClick={(e) => {
									   e.stopPropagation();
									   select(each);
								   }}></Image>
							<View className={styles.content}>
								<View className={styles.title}>{each.productName}</View>
								<View className={styles.introduction}>{each.productBrief}</View>
								<View className={styles.bottom}>
									<View className={styles.price}>
										<View className={styles.price1}>
											<View className={styles.value}>{each.productCurrentPrice}</View>
											<View className={styles.yuan}>元</View>
										</View>
										<View className={styles.price2}>
											会员价：{each.productCurrentMemberPrice}
										</View>
									</View>
									<View className={styles.delete} onClick={(e) => {
										e.stopPropagation();
										remove(each.id);
									}}>删除</View>
								</View>
							</View>
						</View>
					);
				})
			}
		</View>
	);

}

export default CartList;
