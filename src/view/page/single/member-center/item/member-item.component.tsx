import React from "react";
import { RichText, Text, View } from "@tarojs/components";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { MembershipType } from "@/model/type/membership.type";
import styles from "./member-item.module.scss";

type MemberItemPropsType = {
	className?: string,
	data: MembershipType,
	onButtonClick: () => void,
}

const MemberItem: React.ComponentType<MemberItemPropsType> = observer((props) => {

	const userInfo: UserInfoStore = useStore().userInfoStore;

	return (
		<View className={`${styles.container} ${props.className ? props.className : ''}`}>
			<View className={styles.top}>
				<Text className={styles.title}>
					{props.data.name}
					{
						userInfo.inst.membership == 1 &&
						userInfo.inst.membershipId == props.data.id ?
							'（已开通）' : ''
					}
				</Text>
				<View className={styles.paragraphs}>
					<RichText className={styles.each} nodes={props.data.descriptionHtml}></RichText>
					<Text className={styles.each}>适用分类：{props.data.productCategoryDescription}</Text>
					{
						userInfo.inst.membership == 1 &&
						userInfo.inst.membershipId == props.data.id ?
							<Text className={styles.each}>
								有效期至：{dayjs(userInfo.inst.membershipExpireDate).format('YYYY年MM月DD日')}
							</Text> : ''
					}
				</View>
			</View>
			<View className={styles.bottom}>
				<View className={styles.price}>
					<Text className={styles.value}>{props.data.price}</Text>
					<Text className={styles.yuan}>元</Text>
				</View>
				<View className={styles.button} onClick={props.onButtonClick}>
					{
						userInfo.inst.membership == 1 &&
						userInfo.inst.membershipId == props.data.id ?
							<Text>再次购买</Text> :
							<Text>购买会员</Text>
					}
				</View>
			</View>
		</View>
	);

});

export default MemberItem;
