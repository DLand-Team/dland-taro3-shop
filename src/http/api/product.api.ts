import { HttpClient } from "@/http/http-client";
import { HttpResultType } from "@/http/http-result.type";
import { PageableType } from "@/model/type/pageable.type";
import { ProductDetailType } from "@/model/type/product-detail.type";
import { ProductListItemType } from "@/model/type/product-list-item.type";
import { CategoryType } from "@/model/type/category.type";

export class ProductApi {

	/** 查询服务分类列表 */
	public static categoryList(data: {
		criteria: {
			name?: string,
			top?: number,
			valid: number,
		},
	}): Promise<HttpResultType<{
		list: Array<CategoryType>,
		count: number,
		pageable: PageableType,
	}> | null> {
		return HttpClient.post(
			'/product/category/list', data, { token: false },
		);
	}

	/** 查询服务列表（带分页） */
	public static selectPage(data: {
		criteria: {
			name?: string,
			categoryId?: number,
			valid: number,
			recommend?: number,
			needPetCleaning?: number,
		},
		page: PageableType,
	}): Promise<HttpResultType<{
		list: Array<ProductListItemType>,
		count: number,
		pageable: PageableType,
	}> | null> {
		return HttpClient.post(
			'/product/selectPage', data, { token: false },
		);
	}

	/** 查询服务详情 */
	public static detail(data: {
		id: number,
	}): Promise<HttpResultType<ProductDetailType> | null> {
		return HttpClient.get(
			'/product/detail?id=' + data.id, {}, { token: false },
		);
	}

}
