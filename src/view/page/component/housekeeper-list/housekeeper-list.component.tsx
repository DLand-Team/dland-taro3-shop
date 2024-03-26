import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { View } from "@tarojs/components";
import { HousekeeperType } from "@/model/type/housekeeper.type";
import { HousekeeperApi } from "@/http/api/housekeeper.api";
import HousekeeperItem from "@/view/page/component/housekeeper-list/item/housekeeper-item.component";
import styles from "./housekeeper-list.module.scss";

type HousekeeperListPropsType = {
	className?: string,
	selectable?: boolean,
	onSelected?: (e: HousekeeperType | undefined) => void,
	ref?: HousekeeperListRef,
}

export type HousekeeperListRef = React.Ref<{
	setSelectedId: (e?: number) => void,
}>;

const HousekeeperList: React.ComponentType<HousekeeperListPropsType> = forwardRef((props, ref: HousekeeperListRef) => {

	const [housekeeperList, setHousekeeperList] = useState<Array<HousekeeperType>>([]);
	const [selectedId, setSelectedId] = useState<number>();

	useEffect(() => {
		HousekeeperApi.selectPage({ page: { pageNo: 0, pageSize: 999 } }).then((res) => {
			if (res && res.success) {
				setHousekeeperList(res.data.list);
			}
		});
	}, []);

	useImperativeHandle(ref, () => {
		return {
			setSelectedId: (e) => setSelectedId(e),
		}
	});

	const select = (e: HousekeeperType) => {
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
				housekeeperList.map((each, index) => {
					return (
						<HousekeeperItem data={each} key={index}
										 selected={props.selectable ? (selectedId == each.id ? 2 : 1) : 0}
										 onClick={() => select(each)}></HousekeeperItem>
					);
				})
			}
		</View>
	);

});

export default HousekeeperList;
