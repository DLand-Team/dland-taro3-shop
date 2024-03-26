import Taro from "@tarojs/taro";

const serverPath = "";

export class PlatformUtil {
	public static login(): Promise<string> {
		return new Promise((resolve, reject) => {
			Taro.login({
				success(res) {
					resolve(res.code);
				},
				fail(err) {
					reject(err);
				},
			});
		});
	}

	public static requestPayment(data: {
		timestamp: string;
		nonceStr: string;
		paySign: string;
		signType: "MD5" | "HMAC-SHA256" | "RSA";
		prepayId: string;
	}): Promise<TaroGeneral.CallbackResult | null> {
		return new Promise((resolve) => {
			Taro.requestPayment({
				timeStamp: data.timestamp,
				nonceStr: data.nonceStr,
				package: data.prepayId,
				paySign: data.paySign,
				signType: data.signType,
				success: (res: TaroGeneral.CallbackResult) => {
					resolve(res);
				},
				fail: (err) => {
					console.error(err);
					resolve(null);
				},
			});
		});
	}

	public static uploadFile(
		tempPath: string,
		type: string
	): Promise<{
		code: string;
		msg: string;
		data: string;
		success: boolean;
	} | null> {
		return new Promise((resolve) => {
			Taro.getImageInfo({
				src: tempPath,
				success: (sres) => {
					Taro.uploadFile({
						url: serverPath + "/upload/single?type=" + type,
						filePath: sres.path,
						name: "file",
						success: (res) => {
							let resData;
							if (typeof res.data == "string") {
								resData = JSON.parse(res.data);
							} else {
								resData = res.data;
							}
							if (resData.success) {
								resolve(resData);
							} else {
								console.error(resData);
								resolve(null);
							}
						},
						fail: (err) => {
							console.error(err);
							resolve(null);
						},
					});
				},
				fail: (serr) => {
					console.error(serr);
					resolve(null);
				},
			});
		});
	}
}
