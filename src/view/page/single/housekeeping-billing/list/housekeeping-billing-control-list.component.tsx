import React from "react";
import { observer } from "mobx-react";
import useStore from "@/hook/store";
import { BillingInfoStore } from "@/store/billing-info.store";
import ListItem from "@/view/component/list-item/list-item.component";
import LocationFillSvg from "@/assets/svg/location-fill.svg";
import Taro from "@tarojs/taro";
import ClockFillSvg from "@/assets/svg/clock-fill.svg";
import UserFillSvg from "@/assets/svg/user-fill.svg";
import TicketFillSvg from "@/assets/svg/ticket-fill.svg";

const HousekeepingBillingControlList: React.FC = observer(() => {

	const billingInfo: BillingInfoStore = useStore().billingInfoStore;

	return (
		<>
			{
				billingInfo.address == null ?
					<ListItem title='请选择服务地址' titleFontWeight='bold'
							  icon={LocationFillSvg} note='请补全您的服务地址信息'
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-address-selector/housekeeping-address-selector-page' })}></ListItem> :
					<ListItem
						title={billingInfo.address.province + billingInfo.address.city + billingInfo.address.district + billingInfo.address.address + billingInfo.address.room}
						titleFontWeight='bold'
						icon={LocationFillSvg}
						note={billingInfo.address.contactName + ' ' + billingInfo.address.contactPhone}
						onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-address-selector/housekeeping-address-selector-page' })}></ListItem>
			}
			{
				billingInfo.timeStart == null ?
					<ListItem title='上门时间' titleFontWeight='bold'
							  icon={ClockFillSvg} extraText='请选择服务时间'
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-time-selector/housekeeping-time-selector-page' })}></ListItem> :
					<ListItem title='上门时间' titleFontWeight='bold'
							  icon={ClockFillSvg}
							  extraText={`${billingInfo.timeStart.show}-${billingInfo.timeEnd?.short}`}
							  extraTextHighLight
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-time-selector/housekeeping-time-selector-page' })}></ListItem>
			}
			{
				billingInfo.housekeeper == null ?
					<ListItem title='选择服务人员' titleFontWeight='bold'
							  icon={UserFillSvg} extraText='默认服务人员' extraTextHighLight
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-housekeeper-selector/housekeeping-housekeeper-selector-page' })}></ListItem> :
					<ListItem title='选择服务人员' titleFontWeight='bold'
							  icon={UserFillSvg}
							  extraText={billingInfo.housekeeper.housekeeperName}
							  extraTextImage={billingInfo.housekeeper.housekeeperAvatar}
							  extraTextHighLight
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-housekeeper-selector/housekeeping-housekeeper-selector-page' })}></ListItem>
			}
			{
				billingInfo.coupon == null ?
					<ListItem title='优惠券' titleFontWeight='bold'
							  icon={TicketFillSvg} extraText='无优惠券'
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-coupon-selector/housekeeping-coupon-selector-page' })}></ListItem> :
					<ListItem title='优惠券' titleFontWeight='bold'
							  icon={TicketFillSvg}
							  extraText={billingInfo.coupon.title} extraTextHighLight
							  onClick={() => Taro.navigateTo({ url: '/view/page/single/housekeeping-coupon-selector/housekeeping-coupon-selector-page' })}></ListItem>
			}
		</>
	)

});

export default HousekeepingBillingControlList;
