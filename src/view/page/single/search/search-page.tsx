import React, { useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import { ProductListItemType } from "@/model/type/product-list-item.type";
import { ProductApi } from "@/http/api/product.api";
import FrameScrollContainer from "@/view/component/frame-scroll-container/frame-scroll-container.component";
import SearchBar from "@/view/component/search-bar/search-bar.component";
import ProductItem from "@/view/page/single/search/item/product-item.component";
import CartEmptyImage from "@/assets/image/cart-empty.png";
import styles from "./search-page.module.scss";

const SearchPage: React.FC = () => {

	const [isEmpty, setIsEmpty] = useState<boolean>(false);
	const [productList, setProductList] = useState<Array<ProductListItemType>>([]);

	const submit = (e: string) => {
		ProductApi.selectPage({ criteria: { name: e, valid: 1 }, page: { pageNo: 1, pageSize: 999 }, }).then((res) => {
			if (res && res.success) {
				setIsEmpty(res.data.list.length == 0);
				setProductList(res.data.list);
			}
		});
	}

	return (
		<View className={styles.container}>
			<SearchBar placeholder='搜索你想要的服务' onSubmit={submit}></SearchBar>
			{
				isEmpty ?
					<View className={styles.empty}>
						<Image className={styles.image} src={CartEmptyImage}></Image>
						<Text className={styles.text}>未找到符合条件的商品</Text>
					</View> :
					<FrameScrollContainer>
						<View className={styles.list}>
							{
								productList.map((each, index) => {
									return (
										<ProductItem className={styles.each} data={each} key={index}></ProductItem>
									);
								})
							}
						</View>
					</FrameScrollContainer>
			}
		</View>
	);

}

export default SearchPage;
