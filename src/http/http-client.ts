import Taro from "@tarojs/taro";
import { userInfoStore } from "@/app-provider";

type headerType = { [name: string]: string };

const serverPath = process.env.NODE_ENV === "development" ? "" : "";

export class HttpClient {
	public static get<T>(
		url,
		params,
		config: { header?: headerType; token: boolean }
	): Promise<T | null> {
		if (config.header == null) {
			config.header = {};
		}
		let tempHeader = {};
		if (config.token) {
			tempHeader = {
				...tempHeader,
				...{ "housekeeping-token": userInfoStore.token },
			};
		}
		let data = {
			url: serverPath + url,
			method: "get",
			data: params,
			header: {
				"content-type": "application/json", // 默认值
				...config.header,
				...tempHeader,
			},
		};
		return this.request<T>(data);
	}

	public static post<T>(
		url,
		params,
		config: { header?: headerType; token: boolean }
	): Promise<T | null> {
		if (config.header == null) {
			config.header = {};
		}
		let tempHeader = {};
		if (config.token) {
			tempHeader = {
				...tempHeader,
				...{ "housekeeping-token": userInfoStore.token },
			};
		}
		let data = {
			url: serverPath + url,
			method: "post",
			data: params,
			header: {
				"content-type": "application/json", // 默认值
				...this.headerInterceptor(config),
				...tempHeader,
			},
		};
		return this.request<T>(data);
	}

	private static headerInterceptor(config: {
		header?: headerType;
		token: boolean;
	}): headerType {
		let header = {};
		if (config.header != null) {
			header = { ...header, ...config.header };
		}
		return header;
	}

	private static request<T>(data): Promise<T | null> {
		return new Promise((resolve) => {
			Taro.request({
				...data,
				success: (res) => {
					resolve(res.data as T);
				},
				fail: (err) => {
					console.error(err);
					resolve(null);
				},
			});
		});
	}
}
