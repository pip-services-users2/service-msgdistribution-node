import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { BadRequestException } from 'pip-services3-commons-nodex';
import { ConfigException } from 'pip-services3-commons-nodex';
import { NotFoundException } from 'pip-services3-commons-nodex';

import { EmailSettingsV1 } from 'client-emailsettings-node';
import { IEmailSettingsClientV1 } from 'client-emailsettings-node';
import { SmsSettingsV1 } from 'client-smssettings-node';
import { ISmsSettingsClientV1 } from 'client-smssettings-node';

import { EmailMessageV1 } from 'client-email-node';
import { EmailRecipientV1 } from 'client-email-node';
import { IEmailClientV1 } from 'client-email-node';
import { SmsMessageV1 } from 'client-sms-node';
import { SmsRecipientV1 } from 'client-sms-node';
import { ISmsClientV1 } from 'client-sms-node';

import { IMessageTemplatesClientV1 } from 'client-msgtemplates-node';

import { MessageV1 } from '../data/version1/MessageV1';
import { RecipientV1 } from '../data/version1/RecipientV1';
import { DeliveryMethodV1 } from '../data/version1/DeliveryMethodV1';
import { IMessageDistributionController } from './IMessageDistributionController';
import { MessageDistributionCommandSet } from './MessageDistributionCommandSet';

export class MessageDistributionController implements IConfigurable, IReferenceable, ICommandable, IMessageDistributionController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.emailsettings', 'service-emailsettings:client:*:*:1.0',
        'dependencies.smssettings', 'service-smssettings:client:*:*:1.0',
        'dependencies.emaildelivery', 'service-email:client:*:*:1.0',
        'dependencies.smsdelivery', 'service-sms:client:*:*:1.0',
        'dependencies.msgtemplates', 'service-msgtemplates:client:*:*:1.0'
    );

    private _config: ConfigParams = new ConfigParams();
    private _dependencyResolver: DependencyResolver = new DependencyResolver(MessageDistributionController._defaultConfig);
    private _emailSettingsClient: IEmailSettingsClientV1;
    private _smsSettingsClient: ISmsSettingsClientV1;
    private _emailDeliveryClient: IEmailClientV1;
    private _smsDeliveryClient: ISmsClientV1;
    private _templatesClient: IMessageTemplatesClientV1;
    private _commandSet: MessageDistributionCommandSet;

    public configure(config: ConfigParams): void {
        config = config.setDefaults(MessageDistributionController._defaultConfig);
        this._dependencyResolver.configure(config);
        this._config = config;
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);

        this._emailSettingsClient = this._dependencyResolver.getOneOptional<IEmailSettingsClientV1>('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional<ISmsSettingsClientV1>('smssettings');
        this._emailDeliveryClient = this._dependencyResolver.getOneOptional<IEmailClientV1>('emaildelivery');
        this._smsDeliveryClient = this._dependencyResolver.getOneOptional<ISmsClientV1>('smsdelivery');
        this._templatesClient = this._dependencyResolver.getOneOptional<IMessageTemplatesClientV1>('msgtemplates');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new MessageDistributionCommandSet(this);
        return this._commandSet;
    }

    private async getMessage(correlationId: string, message: MessageV1): Promise<MessageV1> {
        // Validate for present message
        if (message == null) {
            throw new BadRequestException(
                correlationId,
                'MSG_MISSING',
                'Message cannot be null'
            );
        }

        // Process regular messages
        if (message.template == null && message.template != "") {
            if (message.subject == null && message.html == null && message.text == null) {
                throw new BadRequestException(
                    correlationId,
                    'MSG_EMPTY',
                    'Message subject, text and html cannot all be empty at the same time'
                );
            }

            return message;
        }

        // Process message templates
        if (this._templatesClient == null) {
            throw new ConfigException(
                correlationId,
                'MSG_TEMPLATE_CLIENT_UNDEFINED',
                'MessageTemplateClient is not defined'
            );
        }

        // Retrieve template from message template service
        let template = await this._templatesClient.getTemplateByIdOrName(correlationId, message.template);

        if (template == null) {
            throw new NotFoundException(
                correlationId,
                'MSG_TEMPLATE_NOT_FOUND',
                'Message template ' + message.template + ' was not found',
            ).withDetails('name', message.template);
        }

        message = <MessageV1>{
            from: template.from,
            subject: template.subject,
            text: template.text,
            html: template.html
        };

        return message;
    }

    private async sendEmailMessages(correlationId: string, recipients: any[],
        message: MessageV1, parameters: ConfigParams): Promise<void> {
        if (this._emailDeliveryClient == null) {
            throw new ConfigException(
                correlationId,
                'EMAIL_DELIVERY_CLIENT_UNDEFINED',
                'Email client is not defined'
            );
        }

        let emailMessage = <EmailMessageV1>{
            from: message.from,
            subject: message.subject,
            text: message.text,
            html: message.html
        };

        let emailRecipients = recipients.filter(r => r.email != null);

        if (emailRecipients.length == 0) {
            throw new BadRequestException(
                correlationId,
                'NO_EMAIL_RECIPIENTS',
                'email recipients.email not set; emailRecipients.length equals 0'
            );
        }

        await this._emailDeliveryClient.sendMessageToRecipients(
            correlationId, emailRecipients, emailMessage, parameters
        );
    }

    private async sendSmsMessages(correlationId: string, recipients: any[],
        message: MessageV1, parameters: ConfigParams): Promise<void> {

        if (this._smsDeliveryClient == null) {
            throw new ConfigException(
                correlationId,
                'SMS_DELIVERY_CLIENT_UNDEFINED',
                'Sms client is not defined'
            );
        }

        let smsMessage = <SmsMessageV1>{
            from: message.from,
            text: message.text || message.subject,
        };
        let smsRecipients = recipients.filter(r => r.phone != null);

        if (smsRecipients.length == 0) {
            throw new BadRequestException(
                correlationId,
                'NO_SMS_RECIPIENTS',
                'sms recipients.phone not set; smsRecipients.length equals 0'
            );
        }

        await this._smsDeliveryClient.sendMessageToRecipients(
            correlationId, smsRecipients, smsMessage, parameters
        );
    }


    public async sendMessage(correlationId: string, recipient: RecipientV1,
        message: MessageV1, parameters: ConfigParams, method: string) : Promise<void> {

        await this.sendMessages(correlationId, [recipient], message, parameters, method);
    }

    public async sendMessages(correlationId: string, recipients: RecipientV1[],
        message: MessageV1, parameters: ConfigParams, method: string): Promise<void> {
        
        // Validate message or retrieve template
        message = await this.getMessage(correlationId, message);

        // Deliver messages
        let tasks = [];

        // Send via Email
        if (method == DeliveryMethodV1.Email || method == DeliveryMethodV1.All) {
            tasks.push(
                this.sendEmailMessages(correlationId, recipients, message, parameters)
            );
        }
            
        // Send via SMS
        if (method == DeliveryMethodV1.Sms || method == DeliveryMethodV1.All) {
            tasks.push(
                this.sendSmsMessages(correlationId, recipients, message, parameters)
            );
        }
            
        await Promise.all(tasks);
    }

    private async sendEmailMessageToRecipients(correlationId: string, recipientIds: string[], subscription: string,
        message: MessageV1, parameters: ConfigParams): Promise<void> {

        let settings: EmailSettingsV1[];
        let recipients: EmailRecipientV1[];

        if (this._emailDeliveryClient == null || this._emailSettingsClient == null) {
            throw new ConfigException(
                correlationId,
                'EMAIL_OR_EMAIL_SETTINGS_CLIENT_UNDEFINED',
                'Email or emailSettings client is not defined'
            );
        }

        // Retrieve recipient settings
        settings = await this._emailSettingsClient.getSettingsByIds(correlationId, recipientIds);

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
        recipients = settings.map(s => <EmailRecipientV1>{
            id: s.id,
            name: s.name,
            email: s.email,
            language: s.language
        });

        // Deliver messages
        await this.sendEmailMessages(correlationId, recipients, message, parameters);
    }

    private async sendSmsMessageToRecipients(correlationId: string, recipientIds: string[], subscription: string,
        message: MessageV1, parameters: ConfigParams): Promise<void> {

        let settings: SmsSettingsV1[];
        let recipients: SmsRecipientV1[];

        if (this._smsDeliveryClient == null || this._smsSettingsClient == null) {
            throw new ConfigException(
                correlationId,
                'SMS_OR_SMS_SETTINGS_CLIENT_UNDEFINED',
                'Sms or smsSettings client is not defined'
            );
        }

        // Retrieve recipient settings
        settings = await this._smsSettingsClient.getSettingsByIds(correlationId, recipientIds);

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
        recipients = settings.map(s => <SmsRecipientV1>{
            id: s.id,
            name: s.name,
            phone: s.phone,
            language: s.language
        });

        await this.sendSmsMessages(correlationId, recipients, message, parameters);
    }

    public async sendMessageToRecipient(correlationId: string, recipientId: string, subscription: string,
        message: MessageV1, parameters: ConfigParams, method: string): Promise<void> {

        await this.sendMessageToRecipients(correlationId, [recipientId], subscription, message, parameters, method);
    }

    public async sendMessageToRecipients(correlationId: string, recipientIds: string[], subscription: string,
        message: MessageV1, parameters: ConfigParams, method: string): Promise<void> {

        // Validate message or retrieve template
        message = await this.getMessage(correlationId, message);

        // Deliver messages
        let tasks = [];

        // Send via Email
        if (method == DeliveryMethodV1.Email || method == DeliveryMethodV1.All) {
            tasks.push(
                this.sendEmailMessageToRecipients(correlationId, recipientIds, subscription, message, parameters)
            );
        }
        
        // Send via SMS
        if (method == DeliveryMethodV1.Sms || method == DeliveryMethodV1.All) {
            tasks.push(
                this.sendSmsMessageToRecipients(correlationId, recipientIds, subscription, message, parameters)
            );
        }
            
        await Promise.all(tasks);
    }
}
