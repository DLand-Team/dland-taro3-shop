import { HttpResultType } from "@/http/http-result.type";
import { HttpClient } from "@/http/http-client";

export class WechatApi {

	/** 创建预支付订单 */
	public static payPrepay(data: {
		orderSerialId: string,
		orderType: 'H' | 'M',
	}): Promise<HttpResultType<{
		timestamp: string,
		nonceStr: string,
		paySign: string,
		signType: 'MD5' | 'HMAC-SHA256' | 'RSA',
		prepayId: string,
	}> | null> {
		return HttpClient.post(
			'/wechat/pay/prepay', data, { token: true },
		);
	}

}
