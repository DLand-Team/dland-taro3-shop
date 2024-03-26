import { UserInfoStore } from "@/store/user-info.store";
import { CommonUtil } from "@/util/common-util";
import { UserInfoEntity } from "@/model/entity/user-info.entity";

export class AuthUtil {

	public static isNotLogin(userInfo: UserInfoStore): boolean {
		return CommonUtil.stringIsNull(userInfo.token);
	}

	public static isNotRegister(userInfo: UserInfoStore): boolean {
		return CommonUtil.stringIsNull(userInfo.inst?.nickname) || CommonUtil.stringIsNull(userInfo.inst?.avatar);
	}

	public static isNotRegisterByEntity(userInfo: UserInfoEntity): boolean {
		return CommonUtil.stringIsNull(userInfo.nickname) || CommonUtil.stringIsNull(userInfo.avatar);
	}

}
