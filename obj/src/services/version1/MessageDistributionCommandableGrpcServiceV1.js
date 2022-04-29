"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDistributionCommandableGrpcServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
class MessageDistributionCommandableGrpcServiceV1 extends pip_services3_grpc_nodex_1.CommandableGrpcService {
    constructor() {
        super('v1/msg_distribution');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-msgdistribution', 'controller', 'default', '*', '1.0'));
    }
}
exports.MessageDistributionCommandableGrpcServiceV1 = MessageDistributionCommandableGrpcServiceV1;
//# sourceMappingURL=MessageDistributionCommandableGrpcServiceV1.js.map