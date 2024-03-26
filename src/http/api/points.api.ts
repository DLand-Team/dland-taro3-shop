import { HttpClient } from "@/http/http-client";
import { HttpResultType } from "@/http/http-result.type";
import { PageableType } from "@/model/type/pageable.type";
import { GoodsListItemType } from "@/model/type/goods-list-item.type";
import { GoodsDetailType } from "@/model/type/goods-detail.type";

export class PointsApi {

	/** 查询积分商城商品列表（带分页） */
	public static productSelectPage(data: {
		criteria?: {
			name?: string,
		},
		page: PageableType,
	}): Promise<HttpResultType<{
		list: Array<GoodsListItemType>,
		count: number,
		pageable: PageableType,
	}> | null> {
		return HttpClient.post(
			'/points/product/selectPage', data, { token: false },
		);
	}

	/** 查询积分商城商品详情 */
	public static productDetail(data: {
		id: number,
	}): Promise<HttpResultType<GoodsDetailType> | null> {
		return HttpClient.get(
			'/points/product/detail?id=' + data.id, {}, { token: false },
		);
	}

}
