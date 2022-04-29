import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
export declare class MessageDistributionServiceFactory extends Factory {
    static Descriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static HttpServiceDescriptor: Descriptor;
    static CommandableGrpcServiceDescriptor: Descriptor;
    static GrpcServiceDescriptor: Descriptor;
    constructor();
}
