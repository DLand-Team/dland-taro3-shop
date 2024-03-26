import { HttpClient } from "@/http/http-client";
import { HttpResultType } from "@/http/http-result.type";
import { PageableType } from "@/model/type/pageable.type";
import { ExchangeType } from "@/model/type/exchange.type";
import { OrderListItemType } from "@/model/type/order-list-item.type";
import { OrderDetailType } from "@/model/type/order-detail.type";
import { CommentType } from "@/model/type/comment.type";

export class OrderApi {

	/** 查询积分兑换订单列表（带分页） */
	public static exchangeSelectPage(data: {
		page: PageableType,
	}): Promise<HttpResultType<{
		list: Array<ExchangeType>,
		count: number,
		pageable: PageableType,
	}> | null> {
		return HttpClient.post(
			'/order/exchange/selectPage', data, { token: true },
		);
	}

	/** 创建积分兑换订单 */
	public static exchangeCreate(data: {
		pointsProductId: number,
		addressId: number,
	}): Promise<HttpResultType<{
		prepayId: string,
	}> | null> {
		return HttpClient.post(
			'/order/exchange/create', data, { token: true },
		);
	}

	/** 创建购买会员订单 */
	public static membershipCreate(data: {
		membershipId: number,
	}): Promise<HttpResultType<{
		serialId: string,
	}> | null> {
		return HttpClient.post(
			'/order/membership/create', data, { token: true },
		);
	}

	/** 查询服务订单列表（带分页） */
	public static housekeepingSelectPage(data: {
		criteria: {
			status?: number,
			cancel_status?: number,
		},
		page: PageableType,
	}): Promise<HttpResultType<{
		list: Array<OrderListItemType>,
		count: number,
		pageable: PageableType,
	}> | null> {
		return HttpClient.post(
			'/order/housekeeping/selectPage', data, { token: true },
		);
	}

	/** （用户）创建服务订单 */
	public static housekeepingCreate(data: {
		addressId?: number,
		expectArriveTimeStart?: string,
		expectArriveTimeEnd?: string,
		housekeeperUserId?: number,
		couponId?: number,
		needPetCleaning: number,
		remark?: string,
		needPayPrice: number,
		totalPrice: number,
		productList: Array<{
			productId: number,
			payPrice: number,
		}>,
	}): Promise<HttpResultType<{
		orderSerialId: string,
	}> | null> {
		// console.log(JSON.stringify(data))
		return HttpClient.post(
			'/order/housekeeping/create', data, { token: true },
		);
	}

	/** （用户）取消服务订单 */
	public static housekeepingCancel(data: {
		id: number,
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post(
			'/order/housekeeping/cancel?id=' + data.id, {}, { token: true },
		);
	}

	/** （用户）删除服务订单 */
	public static housekeepingDelete(data: {
		id: number,
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post(
			'/order/housekeeping/delete?id=' + data.id, {}, { token: true },
		);
	}

	/** （用户）评价服务订单 */
	public static housekeepingComment(data: {
		id: number,
		content?: string,
		rate: number,
		imgList: Array<string>,
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post(
			'/order/housekeeping/comment', data, { token: true },
		);
	}

	/** 查询服务订单详情 */
	public static housekeepingDetail(data: {
		id: number,
	}): Promise<HttpResultType<OrderDetailType> | null> {
		return HttpClient.get(
			'/order/housekeeping/detail?id=' + data.id, {}, { token: true },
		);
	}

	/** 查询服务订单详情 */
	public static commentSelectPage(data: {
		criteria: {
			userId?: number,
			housekeeperUserId?: number,
			orderId?: number,
			orderSerialId?: string,
		},
		page: PageableType,
	}): Promise<HttpResultType<{
		list: Array<CommentType>,
		count: number,
	}> | null> {
		return HttpClient.post(
			'/order/comment/selectPage', data, { token: true },
		);
	}

	/** （服务人员）开始服务 */
	public static housekeepingStartService(data: {
		orderId: number,
		imgList: Array<string>,
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post(
			'/order/housekeeping/startService', data, { token: true },
		);
	}

	/** （服务人员）完成服务 */
	public static housekeepingFinishService(data: {
		orderId: number,
		imgList: Array<string>,
	}): Promise<HttpResultType<any> | null> {
		return HttpClient.post(
			'/order/housekeeping/finishService', data, { token: true },
		);
	}

}
