const services = require('../../../../src/protos/msgdistribution_v1_grpc_pb');
const messages = require('../../../../src/protos/msgdistribution_v1_pb');

import { IReferences, ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { GrpcService } from 'pip-services3-grpc-nodex';

import { IMessageDistributionController } from '../../logic/IMessageDistributionController';
import { MessageDistributionGrpcConverterV1 } from './MessageDistributionGrpcConverterV1';

export class MessageDistributionGrpcServiceV1 extends GrpcService {
    private _controller: IMessageDistributionController;
	
    public constructor() {
        super(services.MessageDistributionService);
        this._dependencyResolver.put('controller', new Descriptor("service-msgdistribution", "controller", "default", "*", "*"));
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IMessageDistributionController>('controller');
    }
    
    private async sendMessage(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let message = MessageDistributionGrpcConverterV1.toMessage(call.request.getMessage());
        let parameters = new ConfigParams();
        MessageDistributionGrpcConverterV1.setMap(parameters, call.request.getParametersMap());
        let recipient = MessageDistributionGrpcConverterV1.toRecipient(call.request.getRecipient());
        let method = call.request.getMethod();

        let response = new messages.SendEmptyReply();

        try {
            await this._controller.sendMessage(
                correlationId,
                recipient, message, parameters, method
            );
        } catch(err) {
            let error = MessageDistributionGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async sendMessages(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let message = MessageDistributionGrpcConverterV1.toMessage(call.request.getMessage());
        let parameters = new ConfigParams();
        MessageDistributionGrpcConverterV1.setMap(parameters, call.request.getParametersMap());
        let recipients = MessageDistributionGrpcConverterV1.toRecipients(call.request.getRecipientsList());
        let method = call.request.getMethod();

        let response = new messages.SendEmptyReply();

        try {
            await this._controller.sendMessages(
                correlationId,
                recipients, message, parameters, method
            );
        } catch (err) {
            let error = MessageDistributionGrpcConverterV1.fromError(err);
            response.setError(error);
        }
        
        return response;
    }

    private async sendMessageToRecipient(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let message = MessageDistributionGrpcConverterV1.toMessage(call.request.getMessage());
        let parameters = new ConfigParams();
        MessageDistributionGrpcConverterV1.setMap(parameters, call.request.getParametersMap());
        let recipientId = call.request.getRecipientId();
        let subscription = call.request.getSubscription();
        let method = call.request.getMethod();

        let response = new messages.SendEmptyReply();

        try {
            await this._controller.sendMessageToRecipient(
                correlationId,
                recipientId, subscription, message, parameters, method
            );
        } catch (err) {
            let error = MessageDistributionGrpcConverterV1.fromError(err);
            response.setError(error);
        }
        
        return response;
    }

    private async sendMessageToRecipients(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let message = MessageDistributionGrpcConverterV1.toMessage(call.request.getMessage());
        let parameters = new ConfigParams();
        MessageDistributionGrpcConverterV1.setMap(parameters, call.request.getParametersMap());
        let recipientIds = call.request.getRecipientIdsList();
        let subscription = call.request.getSubscription();
        let method = call.request.getMethod();

        let response = new messages.SendEmptyReply();

        try {
            await this._controller.sendMessageToRecipients(
                correlationId,
                recipientIds, subscription, message, parameters, method
            );
        } catch (err) {
            let error = MessageDistributionGrpcConverterV1.fromError(err);
            response.setError(error);
        }
        
        return response;
    }
        
    public register() {
        this.registerMethod(
            'send_message', 
            null,
            this.sendMessage
        );

        this.registerMethod(
            'send_messages', 
            null,
            this.sendMessages
        );

        this.registerMethod(
            'send_message_to_recipient', 
            null,
            this.sendMessageToRecipient
        );

        this.registerMethod(
            'send_message_to_recipients', 
            null,
            this.sendMessageToRecipients
        );
    }
}
