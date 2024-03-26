import { HttpClient } from "@/http/http-client";
import { HttpResultType } from "@/http/http-result.type";
import { PageableType } from "@/model/type/pageable.type";
import { NoticeType } from "@/model/type/notice.type";

export class NoticeApi {

	/** 查询通知公告列表 */
	public static list(data: {
		criteria: {
			valid: number,
		},
	}): Promise<HttpResultType<{
		list: Array<NoticeType>,
		count: number,
		pageable: PageableType,
	}> | null> {
		return HttpClient.post(
			'/notice/list', data, { token: false },
		);
	}

}
