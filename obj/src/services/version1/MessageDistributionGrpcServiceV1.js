"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDistributionGrpcServiceV1 = void 0;
const services = require('../../../../src/protos/msgdistribution_v1_grpc_pb');
const messages = require('../../../../src/protos/msgdistribution_v1_pb');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const MessageDistributionGrpcConverterV1_1 = require("./MessageDistributionGrpcConverterV1");
class MessageDistributionGrpcServiceV1 extends pip_services3_grpc_nodex_1.GrpcService {
    constructor() {
        super(services.MessageDistributionService);
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_2.Descriptor("service-msgdistribution", "controller", "default", "*", "*"));
    }
    setReferences(references) {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired('controller');
    }
    sendMessage(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let message = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.toMessage(call.request.getMessage());
            let parameters = new pip_services3_commons_nodex_1.ConfigParams();
            MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.setMap(parameters, call.request.getParametersMap());
            let recipient = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.toRecipient(call.request.getRecipient());
            let method = call.request.getMethod();
            let response = new messages.SendEmptyReply();
            try {
                yield this._controller.sendMessage(correlationId, recipient, message, parameters, method);
            }
            catch (err) {
                let error = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    sendMessages(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let message = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.toMessage(call.request.getMessage());
            let parameters = new pip_services3_commons_nodex_1.ConfigParams();
            MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.setMap(parameters, call.request.getParametersMap());
            let recipients = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.toRecipients(call.request.getRecipientsList());
            let method = call.request.getMethod();
            let response = new messages.SendEmptyReply();
            try {
                yield this._controller.sendMessages(correlationId, recipients, message, parameters, method);
            }
            catch (err) {
                let error = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    sendMessageToRecipient(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let message = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.toMessage(call.request.getMessage());
            let parameters = new pip_services3_commons_nodex_1.ConfigParams();
            MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.setMap(parameters, call.request.getParametersMap());
            let recipientId = call.request.getRecipientId();
            let subscription = call.request.getSubscription();
            let method = call.request.getMethod();
            let response = new messages.SendEmptyReply();
            try {
                yield this._controller.sendMessageToRecipient(correlationId, recipientId, subscription, message, parameters, method);
            }
            catch (err) {
                let error = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    sendMessageToRecipients(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let message = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.toMessage(call.request.getMessage());
            let parameters = new pip_services3_commons_nodex_1.ConfigParams();
            MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.setMap(parameters, call.request.getParametersMap());
            let recipientIds = call.request.getRecipientIdsList();
            let subscription = call.request.getSubscription();
            let method = call.request.getMethod();
            let response = new messages.SendEmptyReply();
            try {
                yield this._controller.sendMessageToRecipients(correlationId, recipientIds, subscription, message, parameters, method);
            }
            catch (err) {
                let error = MessageDistributionGrpcConverterV1_1.MessageDistributionGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    register() {
        this.registerMethod('send_message', null, this.sendMessage);
        this.registerMethod('send_messages', null, this.sendMessages);
        this.registerMethod('send_message_to_recipient', null, this.sendMessageToRecipient);
        this.registerMethod('send_message_to_recipients', null, this.sendMessageToRecipients);
    }
}
exports.MessageDistributionGrpcServiceV1 = MessageDistributionGrpcServiceV1;
//# sourceMappingURL=MessageDistributionGrpcServiceV1.js.map