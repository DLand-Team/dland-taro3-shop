import React from "react";
import { Image, Text, View } from "@tarojs/components";
import { AddressType } from "@/model/type/address.type";
import CheckSVG from "@/assets/svg/check-fill.svg";
import EditImage from '@/assets/image/edit.png';
import DeleteImage from '@/assets/image/delete.png';
import styles from "./address-item.module.scss";

type AddressItemPropsType = {
	className?: string,
	data: AddressType,
	onClick?: (id: number) => void,
	onEditClick?: (id: number) => void,
	onRemoveClick?: (id: number) => void,
	selected: 0 | 1 | 2, // 不显示，未选中，已选中
}

const AddressItem: React.ComponentType<AddressItemPropsType> = (props) => {

	const click = () => {
		props.onClick && props.onClick(props.data.id);
	}

	const edit = (e) => {
		e.stopPropagation();
		props.onEditClick && props.onEditClick(props.data.id);
	}

	const remove = (e) => {
		e.stopPropagation();
		props.onRemoveClick && props.onRemoveClick(props.data.id);
	}

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`} onClick={click}>
			{
				props.selected != 0 ?
					<View className={styles.check}>
						{
							props.selected == 2 ?
								<Image className={styles.image} src={CheckSVG}></Image> :
								<View className={styles.circle}></View>
						}
					</View> : ''
			}
			<View className={styles.left}>
				<Text className={styles.top}>
					{props.data.province}
					{props.data.city}
					{props.data.district}
					{props.data.address}
					{props.data.room}
				</Text>
				<Text className={styles.bottom}>
					{props.data.contactName}&ensp;
					{props.data.contactPhone}
				</Text>
			</View>
			<View className={styles.right}>
				<Image className={styles.image} src={DeleteImage} onClick={remove}></Image>
				<Image className={styles.image} src={EditImage} onClick={edit}></Image>
			</View>
		</View>
	);

}

export default AddressItem;
