import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { MessageDistributionController } from '../logic/MessageDistributionController';
import { MessageDistributionCommandableHttpServiceV1 } from '../services/version1/MessageDistributionCommandableHttpServiceV1';
import { MessageDistributionCommandableGrpcServiceV1 } from '../services/version1/MessageDistributionCommandableGrpcServiceV1';
import { MessageDistributionGrpcServiceV1 } from '../services/version1/MessageDistributionGrpcServiceV1';

export class MessageDistributionServiceFactory extends Factory {
	public static Descriptor = new Descriptor("service-msgdistribution", "factory", "default", "default", "1.0");
	public static ControllerDescriptor = new Descriptor("service-msgdistribution", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("service-msgdistribution", "service", "commandable-http", "*", "1.0");
	public static CommandableGrpcServiceDescriptor = new Descriptor("service-msgdistribution", "service", "commandable-grpc", "*", "1.0");
	public static GrpcServiceDescriptor = new Descriptor("service-msgdistribution", "service", "grpc", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(MessageDistributionServiceFactory.ControllerDescriptor, MessageDistributionController);
		this.registerAsType(MessageDistributionServiceFactory.HttpServiceDescriptor, MessageDistributionCommandableHttpServiceV1);
		this.registerAsType(MessageDistributionServiceFactory.CommandableGrpcServiceDescriptor, MessageDistributionCommandableGrpcServiceV1);
		this.registerAsType(MessageDistributionServiceFactory.GrpcServiceDescriptor, MessageDistributionGrpcServiceV1);
	}
	
}
