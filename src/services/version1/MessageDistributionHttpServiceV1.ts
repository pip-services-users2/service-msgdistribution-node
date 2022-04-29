import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableHttpService } from 'pip-services3-rpc-nodex';

export class MessageDistributionHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/msg_distribution');
        this._dependencyResolver.put('controller', new Descriptor('service-msgdistribution', 'controller', 'default', '*', '1.0'));
    }
}