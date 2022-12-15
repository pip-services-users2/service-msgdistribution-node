"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDistributionServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const MessageDistributionController_1 = require("../logic/MessageDistributionController");
const MessageDistributionCommandableHttpServiceV1_1 = require("../services/version1/MessageDistributionCommandableHttpServiceV1");
const MessageDistributionCommandableGrpcServiceV1_1 = require("../services/version1/MessageDistributionCommandableGrpcServiceV1");
const MessageDistributionGrpcServiceV1_1 = require("../services/version1/MessageDistributionGrpcServiceV1");
class MessageDistributionServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(MessageDistributionServiceFactory.ControllerDescriptor, MessageDistributionController_1.MessageDistributionController);
        this.registerAsType(MessageDistributionServiceFactory.HttpServiceDescriptor, MessageDistributionCommandableHttpServiceV1_1.MessageDistributionCommandableHttpServiceV1);
        this.registerAsType(MessageDistributionServiceFactory.CommandableGrpcServiceDescriptor, MessageDistributionCommandableGrpcServiceV1_1.MessageDistributionCommandableGrpcServiceV1);
        this.registerAsType(MessageDistributionServiceFactory.GrpcServiceDescriptor, MessageDistributionGrpcServiceV1_1.MessageDistributionGrpcServiceV1);
    }
}
exports.MessageDistributionServiceFactory = MessageDistributionServiceFactory;
MessageDistributionServiceFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor("service-msgdistribution", "factory", "default", "default", "1.0");
MessageDistributionServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-msgdistribution", "controller", "default", "*", "1.0");
MessageDistributionServiceFactory.HttpServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-msgdistribution", "service", "commandable-http", "*", "1.0");
MessageDistributionServiceFactory.CommandableGrpcServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-msgdistribution", "service", "commandable-grpc", "*", "1.0");
MessageDistributionServiceFactory.GrpcServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-msgdistribution", "service", "grpc", "*", "1.0");
//# sourceMappingURL=MessageDistributionServiceFactory.js.map