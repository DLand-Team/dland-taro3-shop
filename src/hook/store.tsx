import React from "react";
import { MobXProviderContext } from "mobx-react";

export default () => {
	return React.useContext(MobXProviderContext);
}
