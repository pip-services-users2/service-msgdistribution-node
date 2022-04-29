import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableLambdaFunction } from 'pip-services3-aws-nodex';

import { EmailSettingsClientFactory } from 'client-emailsettings-node';
import { SmsSettingsClientFactory } from 'client-smssettings-node';
import { EmailClientFactory } from 'client-email-node';
import { SmsClientFactory } from 'client-sms-node';
import { MessageTemplatesClientFactory } from 'client-msgtemplates-node';

import { MessageDistributionServiceFactory } from '../build/MessageDistributionServiceFactory';

export class MessageDistributionLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("msg_distribution", "Message distribution function");
        this._dependencyResolver.put('controller', new Descriptor('service-msgdistribution', 'controller', 'default', '*', '*'));
        this._factories.add(new MessageDistributionServiceFactory());
        this._factories.add(new EmailSettingsClientFactory());
        this._factories.add(new SmsSettingsClientFactory());
        this._factories.add(new EmailClientFactory());
        this._factories.add(new SmsClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
    }
}

export const handler = new MessageDistributionLambdaFunction().getHandler();