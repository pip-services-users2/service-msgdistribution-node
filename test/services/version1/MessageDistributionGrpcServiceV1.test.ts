const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

import { Descriptor } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
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
import { MessageDistributionGrpcServiceV1 } from '../../../src/services/version1/MessageDistributionGrpcServiceV1';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('MessageDistributionGrpcServiceV1', ()=> {
    let service: MessageDistributionGrpcServiceV1;

    let client: any;

    suiteSetup(async () => {
        let controller = new MessageDistributionController();

        let emailSettingsClient = new EmailSettingsMemoryClientV1();
        emailSettingsClient.setSettings(null, { id: '1', name: 'User 1', email: 'somebody@somewhere.com' });

        let smsSettingsClient = new SmsSettingsMemoryClientV1();
        smsSettingsClient.setSettings(null, { id: '1', name: 'User 1', phone: '+12345678901' });

        let emailDeliveryClient = new EmailNullClientV1();
        let smsDeliveryClient = new SmsNullClientV1();
        let templatesClient = new MessageTemplatesMockClientV1();
        
        service = new MessageDistributionGrpcServiceV1();
        service.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-emailsettings', 'client', 'memory', 'default', '1.0'), emailSettingsClient,
            new Descriptor('service-smssettings', 'client', 'memory', 'default', '1.0'), smsSettingsClient,
            new Descriptor('service-email', 'client', 'null', 'default', '1.0'), emailDeliveryClient,
            new Descriptor('service-sms', 'client', 'null', 'default', '1.0'), smsDeliveryClient,
            new Descriptor('service-msgtemplates', 'client', 'mock', 'default', '1.0'), templatesClient,
            new Descriptor('service-msgdistribution', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-msgdistribution', 'service', 'grpc', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let packageDefinition = protoLoader.loadSync(
            __dirname + "../../../../../src/protos/msgdistribution_v1.proto",
            {
                keepCase: true,
                longs: Number,
                enums: Number,
                defaults: true,
                oneofs: true
            }
        );
        let clientProto = grpc.loadPackageDefinition(packageDefinition).msgdistribution_v1.MessageDistribution;

        client = new clientProto('localhost:3000', grpc.credentials.createInsecure());
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
            client.send_message(
                {
                    recipient: recipient,
                    message: message,
                    method: DeliveryMethodV1.All
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.settings);
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
            client.send_message_to_recipients(
                {
                    recipient_ids: ['1', '2'],
                    message: message,
                    method: DeliveryMethodV1.All
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.settings);
                }
            );
        });
    });

    test('Send Message using Template', async () => {
        let message = <MessageV1> {
            template: 'test'
        };

        await new Promise<any>((resolve, reject) => {
            client.send_message_to_recipient(
                {
                    recipient_id: '1',
                    message: message,
                    method: DeliveryMethodV1.All
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.settings);
                }
            );
        });
    });

});
