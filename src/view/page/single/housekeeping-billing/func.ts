import Decimal from "decimal.js";
import { UserInfoStore } from "@/store/user-info.store";
import { BillingInfoStore } from "@/store/billing-info.store";

export const calculatePrice = (userInfo: UserInfoStore, billingInfo: BillingInfoStore): {
	total: number, needPay: number,
} => {
	// 商品总费用
	let totalPrice = new Decimal(0);
	for (let i = 0; i < billingInfo.cartItems.length; i++) {
		if (userInfo.inst.membership == 1 &&
			userInfo.memberProductCategory.indexOf(billingInfo.cartItems[i].productCategoryId) != -1) {
			totalPrice = totalPrice.add(new Decimal(billingInfo.cartItems[i].productCurrentMemberPrice));
		} else {
			totalPrice = totalPrice.add(new Decimal(billingInfo.cartItems[i].productCurrentPrice));
		}
	}
	// 服务人员费用
	if (billingInfo.housekeeper != null) {
		totalPrice = totalPrice.add(new Decimal(billingInfo.housekeeper.housekeeperLevelPrice));
	}
	// 宠物清理费
	if (billingInfo.needPetCleaning == 1) {
		totalPrice = totalPrice.add(new Decimal(billingInfo.petCleaningPrice));
	}
	// 优惠券
	let needPayPrice = totalPrice;
	if (billingInfo.coupon) {
		needPayPrice = needPayPrice.sub(new Decimal(billingInfo.coupon.creditPrice));
	}
	return { total: totalPrice.toNumber(), needPay: needPayPrice.toNumber() };
}
