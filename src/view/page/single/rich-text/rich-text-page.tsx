import React, { useEffect, useState } from "react";
import useStore from "@/hook/store";
import { CacheStore } from "@/store/cache.store";
import { RichText, View } from "@tarojs/components";
import { CommonUtil } from "@/util/common-util";
import styles from "./rich-text-page.module.scss";

const RichTextPage: React.FC = () => {

	const cache: CacheStore = useStore().cacheStore;
	const [content, setContent] = useState<string>();

	useEffect(() => {
		setContent(CommonUtil.richHtml(cache.richTextContent));
	}, [cache.richTextContent]);

	return (
		<View className={styles.container}>
			<RichText nodes={content}></RichText>
		</View>
	);

}

export default RichTextPage;
