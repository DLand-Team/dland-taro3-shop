import { HttpResultType } from "@/http/http-result.type";
import { HttpClient } from "@/http/http-client";

export class ParamApi {

	public static getValueByCode(data: {
		code: string,
	}): Promise<HttpResultType<number> | null> {
		return HttpClient.get(
			'/param/getValueByCode?code=' + data.code, {}, { token: false },
		);
	}

}
