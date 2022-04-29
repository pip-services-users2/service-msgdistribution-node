const assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { EmailSettingsMemoryClientV1 } from 'client-emailsettings-node';
import { SmsSettingsMemoryClientV1 } from 'client-smssettings-node';
import { EmailNullClientV1 } from 'client-email-node';
import { SmsNullClientV1 } from 'client-sms-node';

import { MessageV1 } from '../../src/data/version1/MessageV1';
import { RecipientV1 } from '../../src/data/version1/RecipientV1';
import { DeliveryMethodV1 } from '../../src/data/version1/DeliveryMethodV1';
import { MessageTemplatesMockClientV1 } from './MessageTemplatesMockClientV1';
import { MessageDistributionController } from '../../src/logic/MessageDistributionController';

suite('MessageDistributionController', ()=> {
    let controller: MessageDistributionController;

    setup(async () => {
        controller = new MessageDistributionController();

        let emailSettingsClient = new EmailSettingsMemoryClientV1();
        emailSettingsClient.setSettings(null, { id: '1', name: 'User 1', email: 'somebody@somewhere.com' });

        let smsSettingsClient = new SmsSettingsMemoryClientV1();
        smsSettingsClient.setSettings(null, { id: '1', name: 'User 1', phone: '+12345678901' });

        let emailDeliveryClient = new EmailNullClientV1();
        let smsDeliveryClient = new SmsNullClientV1();
        let templatesClient = new MessageTemplatesMockClientV1();

        let references: References = References.fromTuples(
            new Descriptor('service-emailsettings', 'client', 'memory', 'default', '1.0'), emailSettingsClient,
            new Descriptor('service-smssettings', 'client', 'memory', 'default', '1.0'), smsSettingsClient,
            new Descriptor('service-email', 'client', 'null', 'default', '1.0'), emailDeliveryClient,
            new Descriptor('service-sms', 'client', 'null', 'default', '1.0'), smsDeliveryClient,
            new Descriptor('service-msgtemplates', 'client', 'mock', 'default', '1.0'), templatesClient,
            new Descriptor('service-msgdistribution', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
    
    test('Send Message', async () => {
        let message = <MessageV1> {
            subject: 'Test subject',
            text: 'Test text',
            html: 'Test html'
        };
        let recipient = <RecipientV1> {
            name: 'User 1',
            email: 'somebody@somewhere.com',
            phone: '+1233452345'
        }

        await controller.sendMessage(
            null, recipient, message, null, DeliveryMethodV1.All
        );
    });

    test('Send Message using Template', async () => {
        let message = <MessageV1> {
            template: 'test'
        };

        await controller.sendMessageToRecipient(
            null, '1', null, message, null, DeliveryMethodV1.All
        );
    });

    test('Send Message to Recipients', async () => {
        let message = <MessageV1> {
            subject: 'Test subject',
            text: 'Test text',
            html: 'Test html'
        };

        await controller.sendMessageToRecipients(
            null, [ '1', '2' ], null, message, null, DeliveryMethodV1.All,
        );
    });

    test('Send Message using Template', async () => {
        let message = <MessageV1> {
            template: 'test'
        };

        await controller.sendMessageToRecipient(
            null, '1', null, message, null, DeliveryMethodV1.All,
        );
    });

});