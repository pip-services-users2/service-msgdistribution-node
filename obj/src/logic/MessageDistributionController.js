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
exports.MessageDistributionController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const DeliveryMethodV1_1 = require("../data/version1/DeliveryMethodV1");
const MessageDistributionCommandSet_1 = require("./MessageDistributionCommandSet");
class MessageDistributionController {
    constructor() {
        this._config = new pip_services3_commons_nodex_1.ConfigParams();
        this._dependencyResolver = new pip_services3_commons_nodex_2.DependencyResolver(MessageDistributionController._defaultConfig);
    }
    configure(config) {
        config = config.setDefaults(MessageDistributionController._defaultConfig);
        this._dependencyResolver.configure(config);
        this._config = config;
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._emailSettingsClient = this._dependencyResolver.getOneOptional('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional('smssettings');
        this._emailDeliveryClient = this._dependencyResolver.getOneOptional('emaildelivery');
        this._smsDeliveryClient = this._dependencyResolver.getOneOptional('smsdelivery');
        this._templatesClient = this._dependencyResolver.getOneOptional('msgtemplates');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new MessageDistributionCommandSet_1.MessageDistributionCommandSet(this);
        return this._commandSet;
    }
    getMessage(correlationId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate for present message
            if (message == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'MSG_MISSING', 'Message cannot be null');
            }
            // Process regular messages
            if (message.template == null && message.template != "") {
                if (message.subject == null && message.html == null && message.text == null) {
                    throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'MSG_EMPTY', 'Message subject, text and html cannot all be empty at the same time');
                }
                return message;
            }
            // Process message templates
            if (this._templatesClient == null) {
                throw new pip_services3_commons_nodex_4.ConfigException(correlationId, 'MSG_TEMPLATE_CLIENT_UNDEFINED', 'MessageTemplateClient is not defined');
            }
            // Retrieve template from message template service
            let template = yield this._templatesClient.getTemplateByIdOrName(correlationId, message.template);
            if (template == null) {
                throw new pip_services3_commons_nodex_5.NotFoundException(correlationId, 'MSG_TEMPLATE_NOT_FOUND', 'Message template ' + message.template + ' was not found').withDetails('name', message.template);
            }
            message = {
                from: template.from,
                subject: template.subject,
                text: template.text,
                html: template.html
            };
            return message;
        });
    }
    sendEmailMessages(correlationId, recipients, message, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._emailDeliveryClient == null) {
                throw new pip_services3_commons_nodex_4.ConfigException(correlationId, 'EMAIL_DELIVERY_CLIENT_UNDEFINED', 'Email client is not defined');
            }
            let emailMessage = {
                from: message.from,
                subject: message.subject,
                text: message.text,
                html: message.html
            };
            let emailRecipients = recipients.filter(r => r.email != null);
            if (emailRecipients.length == 0) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_EMAIL_RECIPIENTS', 'email recipients.email not set; emailRecipients.length equals 0');
            }
            yield this._emailDeliveryClient.sendMessageToRecipients(correlationId, emailRecipients, emailMessage, parameters);
        });
    }
    sendSmsMessages(correlationId, recipients, message, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._smsDeliveryClient == null) {
                throw new pip_services3_commons_nodex_4.ConfigException(correlationId, 'SMS_DELIVERY_CLIENT_UNDEFINED', 'Sms client is not defined');
            }
            let smsMessage = {
                from: message.from,
                text: message.text || message.subject,
            };
            let smsRecipients = recipients.filter(r => r.phone != null);
            if (smsRecipients.length == 0) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_SMS_RECIPIENTS', 'sms recipients.phone not set; smsRecipients.length equals 0');
            }
            yield this._smsDeliveryClient.sendMessageToRecipients(correlationId, smsRecipients, smsMessage, parameters);
        });
    }
    sendMessage(correlationId, recipient, message, parameters, method) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMessages(correlationId, [recipient], message, parameters, method);
        });
    }
    sendMessages(correlationId, recipients, message, parameters, method) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate message or retrieve template
            message = yield this.getMessage(correlationId, message);
            // Deliver messages
            let tasks = [];
            // Send via Email
            if (method == DeliveryMethodV1_1.DeliveryMethodV1.Email || method == DeliveryMethodV1_1.DeliveryMethodV1.All) {
                tasks.push(this.sendEmailMessages(correlationId, recipients, message, parameters));
            }
            // Send via SMS
            if (method == DeliveryMethodV1_1.DeliveryMethodV1.Sms || method == DeliveryMethodV1_1.DeliveryMethodV1.All) {
                tasks.push(this.sendSmsMessages(correlationId, recipients, message, parameters));
            }
            yield Promise.all(tasks);
        });
    }
    sendEmailMessageToRecipients(correlationId, recipientIds, subscription, message, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings;
            let recipients;
            if (this._emailDeliveryClient == null || this._emailSettingsClient == null) {
                throw new pip_services3_commons_nodex_4.ConfigException(correlationId, 'EMAIL_OR_EMAIL_SETTINGS_CLIENT_UNDEFINED', 'Email or emailSettings client is not defined');
            }
            // Retrieve recipient settings
            settings = yield this._emailSettingsClient.getSettingsByIds(correlationId, recipientIds);
            // Define recipients recipients
            if (subscription) {
                // To send via subscriptions email must be verified
                settings = settings.filter(s => s.verified);
                // Check subscriptions (defined means allowed)
                settings = settings.filter(s => {
                    let subscriptions = s.subscriptions || {};
                    return Object.keys(subscriptions).length == 0 || subscriptions[subscription];
                });
            }
            // Define recipients
            recipients = settings.map(s => ({
                id: s.id,
                name: s.name,
                email: s.email,
                language: s.language
            }));
            // Deliver messages
            yield this.sendEmailMessages(correlationId, recipients, message, parameters);
        });
    }
    sendSmsMessageToRecipients(correlationId, recipientIds, subscription, message, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings;
            let recipients;
            if (this._smsDeliveryClient == null || this._smsSettingsClient == null) {
                throw new pip_services3_commons_nodex_4.ConfigException(correlationId, 'SMS_OR_SMS_SETTINGS_CLIENT_UNDEFINED', 'Sms or smsSettings client is not defined');
            }
            // Retrieve recipient settings
            settings = yield this._smsSettingsClient.getSettingsByIds(correlationId, recipientIds);
            // Define recipients recipients
            if (subscription) {
                // To send via subscriptions email must be verified
                settings = settings.filter(s => s.verified);
                // Check subscriptions (defined means allowed)
                settings = settings.filter(s => {
                    let subscriptions = s.subscriptions || {};
                    return Object.keys(subscriptions).length == 0 || subscriptions[subscription];
                });
            }
            // Define recipients
            recipients = settings.map(s => ({
                id: s.id,
                name: s.name,
                phone: s.phone,
                language: s.language
            }));
            yield this.sendSmsMessages(correlationId, recipients, message, parameters);
        });
    }
    sendMessageToRecipient(correlationId, recipientId, subscription, message, parameters, method) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMessageToRecipients(correlationId, [recipientId], subscription, message, parameters, method);
        });
    }
    sendMessageToRecipients(correlationId, recipientIds, subscription, message, parameters, method) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate message or retrieve template
            message = yield this.getMessage(correlationId, message);
            // Deliver messages
            let tasks = [];
            // Send via Email
            if (method == DeliveryMethodV1_1.DeliveryMethodV1.Email || method == DeliveryMethodV1_1.DeliveryMethodV1.All) {
                tasks.push(this.sendEmailMessageToRecipients(correlationId, recipientIds, subscription, message, parameters));
            }
            // Send via SMS
            if (method == DeliveryMethodV1_1.DeliveryMethodV1.Sms || method == DeliveryMethodV1_1.DeliveryMethodV1.All) {
                tasks.push(this.sendSmsMessageToRecipients(correlationId, recipientIds, subscription, message, parameters));
            }
            yield Promise.all(tasks);
        });
    }
}
exports.MessageDistributionController = MessageDistributionController;
MessageDistributionController._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('dependencies.emailsettings', 'service-emailsettings:client:*:*:1.0', 'dependencies.smssettings', 'service-smssettings:client:*:*:1.0', 'dependencies.emaildelivery', 'service-email:client:*:*:1.0', 'dependencies.smsdelivery', 'service-sms:client:*:*:1.0', 'dependencies.msgtemplates', 'service-msgtemplates:client:*:*:1.0');
//# sourceMappingURL=MessageDistributionController.js.map