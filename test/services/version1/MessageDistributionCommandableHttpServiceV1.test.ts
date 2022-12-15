const restify = require('restify');

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { EmailSettingsMemoryClientV1 } from 'client-emailsettings-node';
import { SmsSettingsMemoryClientV1 } from 'client-smssettings-node';
import { EmailNullClientV1 } from 'client-email-node';
import { SmsNullClientV1 } from 'client-sms-node';

import { MessageV1 } from '../../../src/data/version1/MessageV1';
import { RecipientV1 } from '../../../src/data/version1/RecipientV1';
import { DeliveryMethodV1 } from '../../../src/data/version1/DeliveryMethodV1';
import { MessageTemplatesMockClientV1 } from '../../logic/MessageTemplatesMockClientV1';
import { MessageDistributionController } from '../../../src/logic/MessageDistributionController';
import { MessageDistributionCommandableHttpServiceV1 } from '../../../src/services/version1/MessageDistributionCommandableHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('MessageDistributionCommandableHttpServiceV1', ()=> {
    let service: MessageDistributionCommandableHttpServiceV1;

    let rest: any;

    suiteSetup(async() => {
        let controller = new MessageDistributionController();
        controller.configure(new ConfigParams());

        let emailSettingsClient = new EmailSettingsMemoryClientV1();
        emailSettingsClient.setSettings(null, { id: '1', name: 'User 1', email: 'somebody@somewhere.com' });

        let smsSettingsClient = new SmsSettingsMemoryClientV1();
        smsSettingsClient.setSettings(null, { id: '1', name: 'User 1', phone: '+12345678901' });

        let emailDeliveryClient = new EmailNullClientV1();
        let smsDeliveryClient = new SmsNullClientV1();
        let templatesClient = new MessageTemplatesMockClientV1();
        
        service = new MessageDistributionCommandableHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-emailsettings', 'client', 'memory', 'default', '1.0'), emailSettingsClient,
            new Descriptor('service-smssettings', 'client', 'memory', 'default', '1.0'), smsSettingsClient,
            new Descriptor('service-email', 'client', 'null', 'default', '1.0'), emailDeliveryClient,
            new Descriptor('service-sms', 'client', 'null', 'default', '1.0'), smsDeliveryClient,
            new Descriptor('service-msgtemplates', 'client', 'mock', 'default', '1.0'), templatesClient,
            new Descriptor('service-msgdistribution', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-msgdistribution', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
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

        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/msg_distribution/send_message',
                {
                    recipient: recipient,
                    message: message,
                    method: DeliveryMethodV1.All
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });
    });

    test('Send Message to Recipients', async () => {
        let message = <MessageV1> {
            subject: 'Test subject',
            text: 'Test text',
            html: 'Test html'
        };

        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/msg_distribution/send_message_to_recipients',
                {
                    recipient_ids: ['1', '2'],
                    message: message,
                    method: DeliveryMethodV1.All
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });
    });

    test('Send Message using Template', async () => {
        let message = <MessageV1> {
            template: 'test'
        };

        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/msg_distribution/send_message_to_recipient',
                {
                    recipient_id: '1',
                    message: message,
                    method: DeliveryMethodV1.All
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });
    }); 
});