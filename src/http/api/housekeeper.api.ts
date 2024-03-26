import { HttpResultType } from "@/http/http-result.type";
import { HttpClient } from "@/http/http-client";
import { PageableType } from "@/model/type/pageable.type";
import { HousekeeperType } from "@/model/type/housekeeper.type";

export class HousekeeperApi {

	/** 查询服务人员列表（带分页） */
	public static selectPage(data: {
		page: PageableType,
	}): Promise<HttpResultType<{
		list: Array<HousekeeperType>,
		pageable: PageableType,
	}> | null> {
		return HttpClient.post(
			'/housekeeper/selectPage', data, { token: true },
		);
	}

}
