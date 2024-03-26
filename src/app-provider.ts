import { createContext } from "react";
import { InnerMqService } from "@/service/inner-mq/service/inner-mq.service";
import { CacheStore } from "@/store/cache.store";
import { UserInfoStore } from "@/store/user-info.store";
import { BillingInfoStore } from "@/store/billing-info.store";

export const innerMqService = new InnerMqService();

export const cacheStore = new CacheStore();
export const userInfoStore = new UserInfoStore();
export const billingInfoStore = new BillingInfoStore();

export const AppProvider = createContext<{ innerMqService: InnerMqService }>({
	innerMqService: innerMqService,
});
