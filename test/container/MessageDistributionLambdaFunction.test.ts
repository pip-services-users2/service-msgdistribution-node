import { ConfigParams } from 'pip-services3-commons-nodex';

import { MessageV1 } from '../../src/data/version1/MessageV1';
import { DeliveryMethodV1 } from '../../src/data/version1/DeliveryMethodV1';
import { MessageDistributionLambdaFunction } from '../../src/container/MessageDistributionLambdaFunction';

suite('MessageDistributionLambdaFunction', ()=> {
    let lambda: MessageDistributionLambdaFunction;

    suiteSetup(async () => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'emailsettings.descriptor', 'service-emailsettings:client:memory:default:1.0',
            'smssettings.descriptor', 'service-smssettings:client:memory:default:1.0',
            'email.descriptor', 'service-email:client:null:default:1.0',
            'sms.descriptor', 'service-sms:client:null:default:1.0',
            'msgtemplates.descriptor', 'service-msgtemplates:client:null:default:1.0',
            'controller.descriptor', 'service-msgdistribution:controller:default:default:1.0'
        );

        lambda = new MessageDistributionLambdaFunction();
        lambda.configure(config);
        await lambda.open(null);
    });
    
    suiteTeardown(async () => {
        await lambda.close(null);
    });
    

    test('Send Message to Recipients', async () => {
        let message = <MessageV1> {
            subject: 'Test subject',
            text: 'Test text',
            html: 'Test html'
        };

        // await lambda.act(
        //     {
        //         role: 'msg_distribution',
        //         cmd: 'send_message_to_recipients',
        //         recipient_ids: [ '1', '2' ], 
        //         message: message, 
        //         method: DeliveryMethodV1.All
        //     }
        // );
    });
    
});