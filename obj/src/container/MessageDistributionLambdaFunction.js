"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.MessageDistributionLambdaFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_aws_nodex_1 = require("pip-services3-aws-nodex");
const client_emailsettings_node_1 = require("client-emailsettings-node");
const client_smssettings_node_1 = require("client-smssettings-node");
const client_email_node_1 = require("client-email-node");
const client_sms_node_1 = require("client-sms-node");
const client_msgtemplates_node_1 = require("client-msgtemplates-node");
const MessageDistributionServiceFactory_1 = require("../build/MessageDistributionServiceFactory");
class MessageDistributionLambdaFunction extends pip_services3_aws_nodex_1.CommandableLambdaFunction {
    constructor() {
        super("msg_distribution", "Message distribution function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-msgdistribution', 'controller', 'default', '*', '*'));
        this._factories.add(new MessageDistributionServiceFactory_1.MessageDistributionServiceFactory());
        this._factories.add(new client_emailsettings_node_1.EmailSettingsClientFactory());
        this._factories.add(new client_smssettings_node_1.SmsSettingsClientFactory());
        this._factories.add(new client_email_node_1.EmailClientFactory());
        this._factories.add(new client_sms_node_1.SmsClientFactory());
        this._factories.add(new client_msgtemplates_node_1.MessageTemplatesClientFactory());
    }
}
exports.MessageDistributionLambdaFunction = MessageDistributionLambdaFunction;
exports.handler = new MessageDistributionLambdaFunction().getHandler();
//# sourceMappingURL=MessageDistributionLambdaFunction.js.map