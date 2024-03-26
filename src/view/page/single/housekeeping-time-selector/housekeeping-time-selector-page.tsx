import React, { useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import useStore from "@/hook/store";
import { BillingInfoStore } from "@/store/billing-info.store";
import { Button, ScrollView, Text, View } from "@tarojs/components";
import PageContainer, { PageContainerRef } from "@/view/component/page-container/page-container.component";
import styles from './housekeeping-time-selector-page.module.scss';

dayjs.extend(utc);

const weekValue = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

type DayArrType = Array<{
	week: string,
	day: string,
	value: { y: string, m: string, d: string },
	times: Array<{ start: string, end: string }>,
	selectedTimeIndex: number | null,
}>

const HousekeepingTimeSelectorPage: React.FC = () => {

	const billingInfo: BillingInfoStore = useStore().billingInfoStore;
	const container: PageContainerRef = useRef(null);
	const [dayAndTime, setDayAndTime] = useState<DayArrType>([]);
	const [selectedDayIndex, setSelectedDayIndex] = useState(0);

	useEffect(() => {
		// day
		let dayArr: DayArrType = [];
		let length = 7;
		let currentHours = new Date().getHours();
		let currentMinute = new Date().getMinutes();
		for (let i = 0; i < length; i++) {
			if (i == 0 && ((currentHours == 18 && currentMinute >= 30) || currentHours > 18)) {
				length += 1;
				continue;
			}
			let week;
			if (i == 0) {
				week = '今天';
			} else if (i == 1) {
				week = '明天';
			} else {
				week = weekValue[dayjs().add(i, 'day').format('d')];
			}
			// time
			let timeArr: Array<{ start: string, end: string }> = [];
			for (let j = 0; j < 24; j++) {
				let h = 9 + Math.floor(j / 2);
				let m = j % 2 == 0 ? '00' : '30';
				let hEnd = h;
				let mEnd = m;
				if (Number(mEnd) + 30 == 60) {
					mEnd = '00';
					hEnd = hEnd + 1;
				} else {
					mEnd = '30';
				}
				if (i == 0) { // 今天只计算两小时以后
					if (h > currentHours + 2 || (h == currentHours + 2 && Number(m) > currentMinute)) {
						timeArr.push({ start: `${h}:${m}`, end: `${hEnd}:${mEnd}` });
					}
				} else {
					timeArr.push({ start: `${h}:${m}`, end: `${hEnd}:${mEnd}` });
				}
			}
			dayArr.push({
				week: week, day: dayjs().add(i, 'day').format('MM月DD日'),
				value: {
					y: dayjs().add(i, 'day').format('YYYY'),
					m: dayjs().add(i, 'day').format('MM'),
					d: dayjs().add(i, 'day').format('DD'),
				},
				times: timeArr, selectedTimeIndex: null,
			});
		}
		setDayAndTime(dayArr);
	}, []);

	const timeSelect = (i: number, j: number): void => {
		dayAndTime[i].selectedTimeIndex = j;
		setDayAndTime([...dayAndTime]);
	}

	const selectConfirm = () => {
		let selectedTimeIndex = dayAndTime[selectedDayIndex].selectedTimeIndex;
		if (selectedTimeIndex == null) {
			container.current?.openMessage({
				message: '请选择时间',
				type: 'warning',
			});
			return;
		}
		let day = dayAndTime[selectedDayIndex].day;
		let time = dayAndTime[selectedDayIndex].times[selectedTimeIndex];
		let value = dayAndTime[selectedDayIndex].value;
		let start = `${value.y}-${value.m}-${value.d} ${time.start}:00` // ---
		let end = `${value.y}-${value.m}-${value.d} ${time.end}:00` // ---
		billingInfo.setTimeStart({
			show: day + ' ' + time.start,
			short: time.start,
			// value: dayjs(start).local().format(),
			value: dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
		});
		billingInfo.setTimeEnd({
			show: day + ' ' + time.end,
			short: time.end,
			// value: dayjs(end).local().format(),
			value: dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
		});
		Taro.navigateBack();
	}

	return (
		<PageContainer className={styles.container} ref={container}>
			<View className={styles.top}>
				<ScrollView className={styles.scroll} scrollX enhanced showScrollbar={false}>
					<View className={styles.rowContent}>
						{
							dayAndTime.map((each, index) => {
								return (
									<View className={`${styles.each} ${selectedDayIndex == index ? styles.active : ''}`}
										  key={index} onClick={() => setSelectedDayIndex(index)}>
										<Text className={styles.week}>{each.week}</Text>
										<Text className={styles.day}>{each.day}</Text>
									</View>
								);
							})
						}
					</View>
				</ScrollView>
			</View>
			<View className={styles.middle}>
				<ScrollView className={styles.scroll} scrollY>
					{
						dayAndTime.map((times, timeIndex) => {
							return (
								<>
									{
										selectedDayIndex == timeIndex ?
											<View className={styles.gridContent} key={timeIndex}>
												{
													times.times.map((each, index) => {
														return (
															<View key={index}
																  className={`${styles.each} ${times.selectedTimeIndex == index ? styles.active : ''}`}
																  onClick={() => timeSelect(timeIndex, index)}>
																{each.start}-{each.end}
															</View>
														);
													})
												}
											</View> : ''
									}
								</>
							);
						})
					}
				</ScrollView>
			</View>
			<View className={styles.bottom}>
				<Text className={styles.tip}>请预约2小时之后的时间段</Text>
				<Button className={styles.button} type='primary' onClick={selectConfirm}>确认</Button>
			</View>
		</PageContainer>
	)

}

export default HousekeepingTimeSelectorPage;
