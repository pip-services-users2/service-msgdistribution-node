import { IReferences } from 'pip-services3-commons-nodex';
import { GrpcService } from 'pip-services3-grpc-nodex';
export declare class MessageDistributionGrpcServiceV1 extends GrpcService {
    private _controller;
    constructor();
    setReferences(references: IReferences): void;
    private sendMessage;
    private sendMessages;
    private sendMessageToRecipient;
    private sendMessageToRecipients;
    register(): void;
}
