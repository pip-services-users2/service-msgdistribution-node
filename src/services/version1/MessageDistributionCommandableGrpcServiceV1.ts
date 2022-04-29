import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableGrpcService } from 'pip-services3-grpc-nodex';

export class MessageDistributionCommandableGrpcServiceV1 extends CommandableGrpcService {
    public constructor() {
        super('v1/msg_distribution');
        this._dependencyResolver.put('controller', new Descriptor('service-msgdistribution', 'controller', 'default', '*', '1.0'));
    }
}