import { makeAutoObservable } from "mobx";
import { UserInfoEntity } from "@/model/entity/user-info.entity";

export class UserInfoStore {

	token: string = '';
	isLogin: boolean = false;
	shareWechatOpenId?: string;
	inst = new UserInfoEntity();
	memberProductCategory: Array<number> = [];

	constructor() {
		makeAutoObservable(this);
	}

	setToken(value: string): void {
		this.token = value;
	}

	setIsLogin(value: boolean): void {
		this.isLogin = value;
	}

	setShareWechatOpenId(value?: string): void {
		this.shareWechatOpenId = value;
	}

	setUserInfo(value: UserInfoEntity): void {
		debugger
		this.inst = { ...value };
	}

	setMemberProductCategory(value: Array<number>): void {
		debugger
		this.memberProductCategory = [...value];
	}

}
