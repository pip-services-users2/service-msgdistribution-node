"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDistributionHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class MessageDistributionHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/msg_distribution');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-msgdistribution', 'controller', 'default', '*', '1.0'));
    }
}
exports.MessageDistributionHttpServiceV1 = MessageDistributionHttpServiceV1;
//# sourceMappingURL=MessageDistributionHttpServiceV1.js.map