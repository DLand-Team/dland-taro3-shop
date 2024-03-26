import { HttpClient } from "@/http/http-client";
import { HttpResultType } from "@/http/http-result.type";
import { MembershipType } from "@/model/type/membership.type";

export class MembershipApi {

	/** 查询会员设置列表 */
	public static list(data: {
		criteria: {
			valid: number,
		},
	}): Promise<HttpResultType<{
		list: Array<MembershipType>,
	}> | null> {
		return HttpClient.post(
			'/membership/list', data, { token: false },
		);
	}

}
