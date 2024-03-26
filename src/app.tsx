import React, { PropsWithChildren, useEffect, useRef } from "react";
import { observer, Provider } from "mobx-react";
import Taro from "@tarojs/taro";
import {
	AppProvider,
	billingInfoStore,
	cacheStore,
	innerMqService,
	userInfoStore,
} from "@/app-provider";
import { InnerMqClient } from "@/service/inner-mq/client/inner-mq.client";
import { Topic } from "@/service/inner-mq/topic";
import { PlatformUtil } from "@/util/platform-util";
import { UserApi } from "@/http/api/user.api";
import { ParamApi } from "@/http/api/param.api";
import { MembershipApi } from "@/http/api/membership.api";
import "taro-ui/dist/style/index.scss";
import "./app.scss";

const App: React.FC<PropsWithChildren> = observer((props) => {
	const client = useRef<InnerMqClient>();

	useEffect(() => {
		Taro.showShareMenu({
			withShareTicket: true,
			showShareItems: ["shareAppMessage", "shareTimeline"],
		});

		client.current = innerMqService.createClient();
		subMqMessage();

		async function init() {
			// 微信登录
			let wxCode = await PlatformUtil.login();
			// 后端登录
			let loginResult = await UserApi.login({ code: wxCode });
			debugger;
			if (loginResult?.code == "0000") {
				userInfoStore.setIsLogin(true);
				userInfoStore.setToken(loginResult.data.token);
				userInfoStore.setUserInfo(loginResult.data);
			}
		}

		init().then();
		paramGetter();
		// checkMemberActive();
		return () => {
			client.current && innerMqService.destroyClient(client.current);
		};
	}, []);

	useEffect(() => {
		let flag = userInfoStore.isLogin;
		let flag2 = userInfoStore.inst.membership;
		if (flag && flag2 == 1) {
			MembershipApi.list({ criteria: { valid: 1 } }).then((res) => {
				if (res && res.success) {
					for (let i = 0; i < res.data.list.length; i++) {
						if (
							userInfoStore.inst.membershipId ==
							res.data.list[i].id
						) {
							let arr =
								res.data.list[i].productCategory.split(",");
							let newArr: Array<number> = [];
							for (let j = 0; j < arr.length; j++) {
								newArr.push(Number(arr[j]));
							}
							userInfoStore.setMemberProductCategory(newArr);
						}
					}
				}
			});
		}
	}, [userInfoStore.inst]);

	const subMqMessage = () => {
		client.current?.sub(Topic.UPDATE_USERINFO, () => {
			updateUserInfo();
		});
	};

	const paramGetter = () => {
		ParamApi.getValueByCode({ code: "PET_CLEANING_PRICE" }).then((res) => {
			if (res && res.success) {
				billingInfoStore.setPetCleaningPrice(res.data);
			}
		});
	};

	// 会员过期
	// const checkMemberActive = () => {
	// 	setInterval(() => {
	// 		if (userInfoStore.isLogin && userInfoStore.inst.membership == 1) {
	// 			let data = userInfoStore.inst.membershipExpireDate;
	// 			let isExpire = dayjs(data).isBefore(dayjs(new Date()));
	// 			if (isExpire) {
	// 				let user = { ...userInfoStore.inst };
	// 				user.membership = 0;
	// 				userInfoStore.setUserInfo(user);
	// 				userInfoStore.setMemberProductCategory([]);
	// 			}
	// 		}
	// 	}, 1000);
	// };

	// 更新用户信息
	const updateUserInfo = () => {
		if (userInfoStore.isLogin) {
			UserApi.current().then((res) => {
				if (res && res.success) {
					userInfoStore.setUserInfo(res.data);
					if (res.data.membership == 0) {
						userInfoStore.setMemberProductCategory([]);
					}
				}
			});
		}
	};

	return (
		<AppProvider.Provider value={{ innerMqService: innerMqService }}>
			<Provider {...{ cacheStore, userInfoStore, billingInfoStore }}>
				{props.children}
			</Provider>
		</AppProvider.Provider>
	);
});

export default App;
