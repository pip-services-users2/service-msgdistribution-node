const assert = require('chai').assert;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

import { Descriptor } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { EmailSettingsMockClientV1 } from 'client-emailsettings-node';
import { SmsSettingsMockClientV1 } from 'client-smssettings-node';
import { EmailNullClientV1 } from 'client-email-node';
import { SmsNullClientV1 } from 'client-sms-node';

import { MessageV1 } from '../../../src/data/version1/MessageV1';
import { RecipientV1 } from '../../../src/data/version1/RecipientV1';
import { DeliveryMethodV1 } from '../../../src/data/version1/DeliveryMethodV1';
import { MessageTemplatesMockClientV1 } from '../../logic/MessageTemplatesMockClientV1';
import { MessageDistributionController } from '../../../src/logic/MessageDistributionController';
import { MessageDistributionCommandableGrpcServiceV1 } from '../../../src/services/version1/MessageDistributionCommandableGrpcServiceV1';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('MessageDistributionCommandableGrpcServiceV1', () => {
    let service: MessageDistributionCommandableGrpcServiceV1;

    let client: any;

    suiteSetup(async () => {
        let controller = new MessageDistributionController();

        let emailSettingsClient = new EmailSettingsMockClientV1();
        emailSettingsClient.setSettings(null, { id: '1', name: 'User 1', email: 'somebody@somewhere.com' });

        let smsSettingsClient = new SmsSettingsMockClientV1();
        smsSettingsClient.setSettings(null, { id: '1', name: 'User 1', phone: '+12345678901' });

        let emailDeliveryClient = new EmailNullClientV1();
        let smsDeliveryClient = new SmsNullClientV1();
        let templatesClient = new MessageTemplatesMockClientV1();
        
        service = new MessageDistributionCommandableGrpcServiceV1();
        service.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-emailsettings', 'client', 'mock', 'default', '1.0'), emailSettingsClient,
            new Descriptor('service-smssettings', 'client', 'mock', 'default', '1.0'), smsSettingsClient,
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
            __dirname + "../../../../../node_modules/pip-services3-grpc-nodex/src/protos/commandable.proto",
            {
                keepCase: true,
                longs: Number,
                enums: Number,
                defaults: true,
                oneofs: true
            }
        );
        let clientProto = grpc.loadPackageDefinition(packageDefinition).commandable.Commandable;

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

        let response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/msg_distribution.send_message',
                    args_empty: false,
                    args_json: JSON.stringify({
                        recipient: recipient,
                        message: message,
                        method: DeliveryMethodV1.All
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isTrue(response.result_empty);
    });

    test('Send Message to Recipients', async () => {
        let message = <MessageV1> {
            subject: 'Test subject',
            text: 'Test text',
            html: 'Test html'
        };

        let response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/msg_distribution.send_message_to_recipients',
                    args_empty: false,
                    args_json: JSON.stringify({
                        recipient_ids: ['1', '2'],
                        message: message,
                        method: DeliveryMethodV1.All
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isTrue(response.result_empty);
    });

    test('Send Message using Template', async () => {
        let message = <MessageV1> {
            template: 'test'
        };

        let response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/msg_distribution.send_message_to_recipient',
                    args_empty: false,
                    args_json: JSON.stringify({
                        recipient_id: '1',
                        message: message,
                        method: DeliveryMethodV1.All
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isTrue(response.result_empty);
    });
});
