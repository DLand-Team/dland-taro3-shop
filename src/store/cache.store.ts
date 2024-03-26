import { makeAutoObservable } from "mobx";
import { AddressType } from "@/model/type/address.type";
import { HousekeeperType } from "@/model/type/housekeeper.type";

export class CacheStore {

	richTextContent: string = '';
	editAddress?: AddressType;
	commentHousekeeper?: HousekeeperType;

	constructor() {
		makeAutoObservable(this);
	}

	setRichTextContent(value: string) {
		this.richTextContent = value;
	}

	setEditAddress(value?: AddressType): void {
		value ? (this.editAddress = { ...value }) : this.editAddress = undefined;
	}

	setCommentHousekeeper(value?: HousekeeperType): void {
		value ? (this.commentHousekeeper = { ...value }) : this.commentHousekeeper = undefined;
	}

}
