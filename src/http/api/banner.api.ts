import { HttpClient } from "@/http/http-client";
import { HttpResultType } from "@/http/http-result.type";
import { BannerType } from "@/model/type/banner.type";

export class BannerApi {
	public static list(data: {
		criteria: {
			redirectType?: string;
			valid?: number;
			type?: string;
		};
		sortings?: Array<{
			column: string;
			asc: number;
		}>;
	}): Promise<HttpResultType<{
		list: Array<BannerType>;
		count: number;
		pageable: null;
	}> | null> {
		return HttpClient.post("/banner/list", data, { token: false });
	}
}
