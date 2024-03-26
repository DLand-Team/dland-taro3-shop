import { HttpClient } from "@/http/http-client";
import { HttpResultType } from "@/http/http-result.type";
import { PageableType } from "@/model/type/pageable.type";
import { UserInfoEntity } from "@/model/entity/user-info.entity";
import { CouponType } from "@/model/type/coupon.type";
import { AddressType } from "@/model/type/address.type";
import { CartType } from "@/model/type/cart.type";
import { PointHistoryType } from "@/model/type/point-history.type";

export class UserApi {
	/** 微信小程序登录 */
	public static login(data: {
		code: string;
	}): Promise<HttpResultType<UserInfoEntity> | null> {
		return HttpClient.post(
			"/user/login?code=" + data.code,
			{},
			{ token: false }
		);
	}

	/** 注册 */
	public static register(data: {
		code: string;
		wechatOpenId?: string;
	}): Promise<HttpResultType<UserInfoEntity> | null> {
		return HttpClient.post(
			`/user/register?code=${data.code}${
				data.wechatOpenId == null
					? ""
					: `&shareUserId=${data.wechatOpenId}`
			}`,
			{},
			{ token: true }
		);
	}

	public static switchLoginType(data: {
		loginType: string;
	}): Promise<HttpResultType<UserInfoEntity> | null> {
		return HttpClient.post(
			`/user/switchLoginType?loginType=${data.loginType}`,
			{},
			{ token: true }
		);
	}

	/** 更新用户信息 */
	public static syncUserInfo(data: {
		nickname: string;
		avatar: string;
		gender: number;
	}): Promise<HttpResultType<UserInfoEntity> | null> {
		return HttpClient.post("/user/syncUserInfo", data, { token: true });
	}

	/** 查询用户已领取的优惠券列表 */
	public static couponList(data: {
		criteria: {
			valid: number;
			status?: number;
			endTimeFrom?: string;
		};
	}): Promise<HttpResultType<{
		list: Array<CouponType>;
		count: number;
		pageable: PageableType;
	}> | null> {
		return HttpClient.post("/user/coupon/list", data, { token: true });
	}

	/** 查询用户积分获取记录列表（带分页） */
	public static pointAddSelectPage(data: {
		page: PageableType;
	}): Promise<HttpResultType<{
		list: Array<PointHistoryType>;
		pageable: PageableType;
	}> | null> {
		return HttpClient.post("/user/point/add/selectPage", data, {
			token: true,
		});
	}

	/** 查询用户购物车列表（带分页） */
	public static chartSelectPage(data: {
		page: PageableType;
	}): Promise<HttpResultType<{
		list: Array<CartType>;
		pageable: PageableType;
	}> | null> {
		return HttpClient.post("/user/chart/selectPage", data, { token: true });
	}

	/** 查询用户地址列表 */
	public static addressList(): Promise<HttpResultType<{
		list: Array<AddressType>;
	}> | null> {
		return HttpClient.post("/user/address/list", {}, { token: true });
	}

	/** 新增用户地址接口 */
	public static addressInsert(data: {
		province: string;
		city: string;
		district: string;
		address: string;
		room: string;
		longitude: number;
		latitude: number;
		contactName: string;
		contactPhone: string;
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post("/user/address/insert", data, { token: true });
	}

	/** 更新用户地址接口 */
	public static addressUpdate(data: {
		id: number;
		province: string;
		city: string;
		district: string;
		address: string;
		room: string;
		longitude: number;
		latitude: number;
		contactName: string;
		contactPhone: string;
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post("/user/address/update", data, { token: true });
	}

	/** 删除用户地址接口 */
	public static addressDelete(data: {
		id: number;
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post("/user/address/delete?id=" + data.id, data, {
			token: true,
		});
	}

	/** 添加产品/服务至购物车 */
	public static chartAdd(data: {
		productId: number;
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post("/user/chart/add", data, { token: true });
	}

	/** 删除购物车数据 */
	public static chartDelete(data: {
		id: number;
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post(
			"/user/chart/delete?id=" + data.id,
			{},
			{ token: true }
		);
	}

	/** 获取当前登录用户信息 */
	public static current(): Promise<HttpResultType<UserInfoEntity> | null> {
		return HttpClient.get("/user/current", {}, { token: true });
	}
}
