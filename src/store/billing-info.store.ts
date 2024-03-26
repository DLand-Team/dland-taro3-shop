import { makeAutoObservable } from "mobx";
import { CartType } from "@/model/type/cart.type";
import { AddressType } from "@/model/type/address.type";
import { CouponType } from "@/model/type/coupon.type";
import { HousekeeperType } from "@/model/type/housekeeper.type";

export class BillingInfoStore {

	petCleaningPrice: number = 0;

	cartItems: Array<CartType> = [];

	address?: AddressType;
	timeStart?: { show: string, short: string, value: string };
	timeEnd?: { show: string, short: string, value: string };
	housekeeper?: HousekeeperType;
	coupon?: CouponType;

	needPetCleaning: number = 0;
	remark?: string;

	constructor() {
		makeAutoObservable(this);
	}

	clear(): void {
		this.address = undefined;
		this.timeStart = undefined;
		this.timeEnd = undefined;
		this.housekeeper = undefined;
		this.coupon = undefined;
		this.needPetCleaning = 0;
		this.remark = undefined;
	}

	setPetCleaningPrice(value: number) {
		this.petCleaningPrice = value;
	}

	setCartItems(value: Array<CartType>): void {
		this.cartItems = [...value];
	}

	setAddress(value: AddressType): void {
		this.address = { ...value };
	}

	setTimeStart(value: { show: string, short: string, value: string }): void {
		this.timeStart = { ...value };
	}

	setTimeEnd(value: { show: string, short: string, value: string }): void {
		this.timeEnd = { ...value };
	}

	setHousekeeper(value?: HousekeeperType): void {
		value ? (this.housekeeper = { ...value }) : this.housekeeper = undefined;
	}

	setCoupon(value?: CouponType): void {
		value ? (this.coupon = { ...value }) : this.coupon = undefined;
	}

	setNeedPetCleaning(value: number) {
		this.needPetCleaning = value;
	}

	setRemark(value: string) {
		this.remark = value;
	}

}
