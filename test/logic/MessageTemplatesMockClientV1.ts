import { MessageTemplatesNullClientV1, MessageTemplateV1 } from 'client-msgtemplates-node';
import { MultiString } from 'pip-services3-commons-nodex';

export class MessageTemplatesMockClientV1 extends MessageTemplatesNullClientV1 {
 
    public async getTemplateByIdOrName(correlationId: string, idOrName: string): Promise<MessageTemplateV1> {
        if (idOrName != 'test') {
            return null;
        }

        return <MessageTemplateV1>{
            id: idOrName,
            name: idOrName,
            from: null,
            status: 'new',
            subject: new MultiString({ en: 'Test subject' }),
            text: new MultiString({ en: 'Test text' }),
            html: new MultiString({ en: 'Test html' })
        }
    }
    
}