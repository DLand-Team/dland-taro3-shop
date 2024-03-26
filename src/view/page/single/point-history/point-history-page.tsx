import React, { useEffect, useRef, useState } from "react";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { PointHistoryType } from "@/model/type/point-history.type";
import { UserApi } from "@/http/api/user.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import PointHistoryItem from "@/view/page/single/point-history/item/point-history-item.component";
import styles from "./point-history-page.module.scss";

const PointHistoryPage: React.FC = () => {

	const userInfo: UserInfoStore = useStore().userInfoStore;
	const container: PageContainerRef = useRef(null);

	const [list, setList] = useState<Array<PointHistoryType>>([]);

	useEffect(() => {
		if (!userInfo.isLogin) {
			container.current?.openMessage({ message: '请先登录', type: 'warning' });
			return;
		}
		UserApi.pointAddSelectPage({ page: { pageNo: 1, pageSize: 999 } }).then((res) => {
			if (res && res.success) {
				setList(res.data.list);
			}
		});
	}, []);

	return (
		<PageContainer className={styles.container} ref={container}>
			<FrameScrollContainer>
				{
					list.map((each, index) => {
						return (
							<PointHistoryItem data={each} key={index}></PointHistoryItem>
						)
					})
				}
			</FrameScrollContainer>
		</PageContainer>
	);

}

export default PointHistoryPage;
