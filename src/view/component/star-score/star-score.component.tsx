import React, { useEffect, useState } from "react";
import { Image, View } from "@tarojs/components";
import StarOnImage from "@/assets/image/star-on.png";
import StarOffImage from "@/assets/image/star-off.png";
import styles from "./star-score.module.scss";

type StarScorePropsType = {
	className?: string,
	count: number,
	onChange?: (e: number) => void,
}

const StarScore: React.ComponentType<StarScorePropsType> = (props) => {

	const [arr, setArr] = useState([1]);
	const [score, setScore] = useState(0);

	useEffect(() => {
		let arr0: Array<number> = [];
		for (let i = 0; i < props.count; i++) {
			arr0.push(1);
		}
		setArr(arr0);
		setScore(arr0.length + 1);
	}, [props.count]);

	const scoreImageClick = (index: number) => {
		let score0 = index + 1;
		setScore(score0);
		props.onChange && props.onChange(score0);
	}

	return (
		<View className={styles.container + ' ' + (props.className ? props.className : '')}>
			{
				// @ts-ignore
				arr.map((each, index) => {
					return (
						<View className={styles.each} key={index} onClick={() => scoreImageClick(index)}>
							<Image className={styles.image}
								   src={score >= index + 1 ? StarOnImage : StarOffImage}></Image>
						</View>
					)
				})
			}
		</View>
	);

}

export default StarScore;
