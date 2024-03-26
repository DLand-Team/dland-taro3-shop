import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, View } from '@tarojs/components';
import { AppProvider } from "@/app-provider";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { Topic } from "@/service/inner-mq/topic";
import { CategoryType } from "@/model/type/category.type";
import { ProductListItemType } from "@/model/type/product-list-item.type";
import { ProductApi } from "@/http/api/product.api";
import CatalogContentList from "@/view/page/tab/catalog/catalog-content-list/catalog-content-list.component";
import styles from "./catalog-tab.module.scss";

const CatalogTab: React.FC = () => {

	const innerMqService: InnerMqService = useContext(AppProvider).innerMqService;
	const client = useRef<InnerMqClient>();

	const [categoryList, setCategoryList] = useState<Array<CategoryType>>([]);
	const [productList, setProductList] = useState<Array<Array<ProductListItemType>>>([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		ProductApi.categoryList({ criteria: { valid: 1 } }).then((res) => {
			if (res) {
				setCategoryList(res.data.list.filter(each => each.valid == 1));
				queryProductList(0, res.data.list[0].id);
			}
		});
		return () => {
			client.current && innerMqService.destroyClient(client.current);
		};
	}, []);

	useEffect(() => {
		if (categoryList.length > 0 && client.current == null) {
			client.current = innerMqService.createClient();
			subMqMessage();
		}
	}, [categoryList]);

	const subMqMessage = () => {
		client.current?.sub<{ tabId: number, param: { id: number } }>(Topic.HREF_TO_HOME_TAB, (res) => {
			if (res.tabId == 1) {
				for (let i = 0; i < categoryList.length; i++) {
					if (categoryList[i].id == res.param.id) {
						setCurrentIndex(i);
						queryProductList(i, categoryList[i].id);
						break;
					}
				}
			}
		});
	}

	const tabChange = (e: number) => {
		setCurrentIndex(e);
		if (productList[e] == null) {
			queryProductList(e, categoryList[e].id);
		}
	}

	const queryProductList = (categoryIndex: number, categoryId: number) => {
		ProductApi.selectPage({
			criteria: { categoryId: categoryId, valid: 1 },
			page: { pageNo: 1, pageSize: 999 },
		}).then((res) => {
			if (res) {
				productList[categoryIndex] = res.data.list;
				setProductList([...productList]);
			}
		});
	}

	return (
		<View className={styles.container}>
			<View className={styles.left}>
				<ScrollView className={styles.scroll} scrollY enhanced showScrollbar={false}>
					{
						categoryList.map((each, index) => {
							return (
								<>
									{each.valid == 1 ?
										<View className={`${styles.each} ${currentIndex == index ? styles.active : ''}`}
											  key={index} onClick={() => tabChange(index)}>
											<View className={styles.activeBlock}
												  style={{ opacity: currentIndex == index ? '1' : '0' }}></View>
											{each.name}
										</View> : ''}
								</>
							);
						})
					}
				</ScrollView>
			</View>
			<View className={styles.right}>
				<ScrollView className={styles.scroll} scrollY>
					{
						productList.map((each, index) => {
							return (
								<>
									{
										(index == currentIndex && each != null) ?
											<CatalogContentList data={each} key={index}></CatalogContentList> : ''
									}
								</>
							)
						})
					}
				</ScrollView>
			</View>
		</View>
	);

}

export default CatalogTab;
