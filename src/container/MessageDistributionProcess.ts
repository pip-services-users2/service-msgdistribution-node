import { ProcessContainer } from 'pip-services3-container-nodex';

import { EmailSettingsClientFactory } from 'client-emailsettings-node';
import { SmsSettingsClientFactory } from 'client-smssettings-node';
import { EmailClientFactory } from 'client-email-node';
import { SmsClientFactory } from 'client-sms-node';
import { MessageTemplatesClientFactory } from 'client-msgtemplates-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultGrpcFactory } from 'pip-services3-grpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

import { MessageDistributionServiceFactory } from '../build/MessageDistributionServiceFactory';

export class MessageDistributionProcess extends ProcessContainer {

    public constructor() {
        super("msg_distribution", "Message distribution microservice");
        this._factories.add(new MessageDistributionServiceFactory);
        this._factories.add(new EmailSettingsClientFactory());
        this._factories.add(new SmsSettingsClientFactory());
        this._factories.add(new EmailClientFactory());
        this._factories.add(new SmsClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
        this._factories.add(new DefaultRpcFactory());
        this._factories.add(new DefaultGrpcFactory());
        this._factories.add(new DefaultSwaggerFactory());
    }
}
