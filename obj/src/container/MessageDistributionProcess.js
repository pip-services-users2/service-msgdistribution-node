"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDistributionProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const client_emailsettings_node_1 = require("client-emailsettings-node");
const client_smssettings_node_1 = require("client-smssettings-node");
const client_email_node_1 = require("client-email-node");
const client_sms_node_1 = require("client-sms-node");
const client_msgtemplates_node_1 = require("client-msgtemplates-node");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
const MessageDistributionServiceFactory_1 = require("../build/MessageDistributionServiceFactory");
class MessageDistributionProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super("msg_distribution", "Message distribution microservice");
        this._factories.add(new MessageDistributionServiceFactory_1.MessageDistributionServiceFactory);
        this._factories.add(new client_emailsettings_node_1.EmailSettingsClientFactory());
        this._factories.add(new client_smssettings_node_1.SmsSettingsClientFactory());
        this._factories.add(new client_email_node_1.EmailClientFactory());
        this._factories.add(new client_sms_node_1.SmsClientFactory());
        this._factories.add(new client_msgtemplates_node_1.MessageTemplatesClientFactory());
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory());
        this._factories.add(new pip_services3_grpc_nodex_1.DefaultGrpcFactory());
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory());
    }
}
exports.MessageDistributionProcess = MessageDistributionProcess;
//# sourceMappingURL=MessageDistributionProcess.js.map