import React, { useEffect, useRef, useState } from "react";
import useStore from "@/hook/store";
import { UserInfoStore } from "@/store/user-info.store";
import { ExchangeType } from "@/model/type/exchange.type";
import { OrderApi } from "@/http/api/order.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import ExchangeHistoryItem from "@/view/page/single/exchange-history/item/exchange-history.component";
import styles from "./exchange-history-page.module.scss";

const ExchangeHistoryPage: React.FC = () => {

	const userInfo: UserInfoStore = useStore().userInfoStore;
	const container: PageContainerRef = useRef(null);

	const [exchangeList, setExchangeList] = useState<Array<ExchangeType>>([]);

	useEffect(() => {
		if (!userInfo.isLogin) {
			container.current?.openMessage({ message: '请先登录', type: 'warning' });
			return;
		}
		OrderApi.exchangeSelectPage({ page: { pageNo: 1, pageSize: 999 } }).then((res) => {
			if (res && res.success) {
				setExchangeList(res.data.list);
			}
		});
	}, []);

	return (
		<PageContainer className={styles.container} ref={container}>
			<FrameScrollContainer>
				{
					exchangeList.map((each, index) => {
						return (
							<ExchangeHistoryItem data={each} key={index}></ExchangeHistoryItem>
						)
					})
				}
			</FrameScrollContainer>
		</PageContainer>
	);

}

export default ExchangeHistoryPage;
