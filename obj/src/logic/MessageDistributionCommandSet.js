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
exports.MessageDistributionCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const MessageV1Schema_1 = require("../data/version1/MessageV1Schema");
const RecipientV1Schema_1 = require("../data/version1/RecipientV1Schema");
class MessageDistributionCommandSet extends pip_services3_commons_nodex_2.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        this.addCommand(this.makeSendMessageCommand());
        this.addCommand(this.makeSendMessagesCommand());
        this.addCommand(this.makeSendMessageToRecipientCommand());
        this.addCommand(this.makeSendMessageToRecipientsCommand());
    }
    makeSendMessageCommand() {
        return new pip_services3_commons_nodex_3.Command("send_message", new pip_services3_commons_nodex_4.ObjectSchema(true)
            .withRequiredProperty('message', new MessageV1Schema_1.MessageV1Schema())
            .withRequiredProperty('recipient', new RecipientV1Schema_1.RecipientV1Schema())
            .withOptionalProperty('parameters', pip_services3_commons_nodex_6.TypeCode.Map)
            .withOptionalProperty('method', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let message = args.get("message");
            let recipient = args.get("recipient");
            let parameters = pip_services3_commons_nodex_1.ConfigParams.fromValue(args.get("parameters"));
            let method = args.getAsNullableString('method');
            yield this._logic.sendMessage(correlationId, recipient, message, parameters, method);
        }));
    }
    makeSendMessagesCommand() {
        return new pip_services3_commons_nodex_3.Command("send_messages", new pip_services3_commons_nodex_4.ObjectSchema(true)
            .withRequiredProperty('message', new MessageV1Schema_1.MessageV1Schema())
            .withRequiredProperty('recipients', new pip_services3_commons_nodex_5.ArraySchema(new RecipientV1Schema_1.RecipientV1Schema()))
            .withOptionalProperty('parameters', pip_services3_commons_nodex_6.TypeCode.Map)
            .withOptionalProperty('method', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let message = args.get("message");
            let recipients = args.get("recipients");
            let parameters = pip_services3_commons_nodex_1.ConfigParams.fromValue(args.get("parameters"));
            let method = args.getAsNullableString('method');
            yield this._logic.sendMessages(correlationId, recipients, message, parameters, method);
        }));
    }
    makeSendMessageToRecipientCommand() {
        return new pip_services3_commons_nodex_3.Command("send_message_to_recipient", new pip_services3_commons_nodex_4.ObjectSchema(true)
            .withRequiredProperty('message', new MessageV1Schema_1.MessageV1Schema())
            .withRequiredProperty('recipient_id', pip_services3_commons_nodex_6.TypeCode.String)
            .withOptionalProperty('subscription', pip_services3_commons_nodex_6.TypeCode.String)
            .withOptionalProperty('parameters', pip_services3_commons_nodex_6.TypeCode.Map)
            .withOptionalProperty('method', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let message = args.get("message");
            let recipientId = args.getAsString("recipient_id");
            let subscription = args.getAsString("subscription");
            let parameters = pip_services3_commons_nodex_1.ConfigParams.fromValue(args.get("parameters"));
            let method = args.getAsNullableString('method');
            yield this._logic.sendMessageToRecipient(correlationId, recipientId, subscription, message, parameters, method);
        }));
    }
    makeSendMessageToRecipientsCommand() {
        return new pip_services3_commons_nodex_3.Command("send_message_to_recipients", new pip_services3_commons_nodex_4.ObjectSchema(true)
            .withRequiredProperty('message', new MessageV1Schema_1.MessageV1Schema())
            .withRequiredProperty('recipient_ids', new pip_services3_commons_nodex_5.ArraySchema(pip_services3_commons_nodex_6.TypeCode.String))
            .withOptionalProperty('subscription', pip_services3_commons_nodex_6.TypeCode.String)
            .withOptionalProperty('parameters', pip_services3_commons_nodex_6.TypeCode.Map)
            .withOptionalProperty('method', pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let message = args.get("message");
            let recipientIds = args.get("recipient_ids");
            let subscription = args.getAsString("subscription");
            let parameters = pip_services3_commons_nodex_1.ConfigParams.fromValue(args.get("parameters"));
            let method = args.getAsNullableString('method');
            yield this._logic.sendMessageToRecipients(correlationId, recipientIds, subscription, message, parameters, method);
        }));
    }
}
exports.MessageDistributionCommandSet = MessageDistributionCommandSet;
//# sourceMappingURL=MessageDistributionCommandSet.js.map