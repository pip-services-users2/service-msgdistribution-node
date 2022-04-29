import { ConfigParams } from 'pip-services3-commons-nodex';
import { MessageV1 } from '../data/version1/MessageV1';
import { RecipientV1 } from '../data/version1/RecipientV1';
export interface IMessageDistributionController {
    sendMessage(correlationId: string, recipient: RecipientV1, message: MessageV1, parameters: ConfigParams, method: string): Promise<void>;
    sendMessages(correlationId: string, recipients: RecipientV1[], message: MessageV1, parameters: ConfigParams, method: string): Promise<void>;
    sendMessageToRecipient(correlationId: string, recipientId: string, subscription: string, message: MessageV1, parameters: ConfigParams, method: string): Promise<void>;
    sendMessageToRecipients(correlationId: string, recipientIds: string[], subscription: string, message: MessageV1, parameters: ConfigParams, method: string): Promise<void>;
}
