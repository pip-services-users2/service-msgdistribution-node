# Message Distribution Microservice

This microservice is distributes messages to one or many recipients
using their configured delivery methods: email or sms.

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca

This microservice has optional dependencies on the following microservices:
- [service-emailsettings](https://github.com/pip-services-users2/service-emailsettings) - recipient email settings
- [service-smssettings](https://github.com/pip-services-users2/service-emailsettings) - recipient sms settings
- [service-email](https://github.com/pip-services-infrastructure2/service-email) - email sending
- [service-sms](https://github.com/pip-services-infrastructure2/service-sms) - sms sending
- [service-msgtemplates](https://github.com/pip-services-content2/service-msgtemplates) - message templates

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services-users2/client-msgdistribution-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)
  - [Seneca Version 1](doc/SenecaProtocolV1.md)

##  Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class MessageV1 {
    public template: string;
    public from: string;
    public subject: any;
    public text: any;
    public html: any;
}

interface IMessageDistributionV1 {
    sendMessageToRecipient(correlationId: string, recipientId: string, subscription: string,
        message: MessageV1, parameters: ConfigParams, method: string): Promise<void>;
    
    sendMessageToRecipients(correlationId: string, recipientIds: string[], subscription: string,
        message: MessageV1, parameters: ConfigParams, method: string): Promise<void>;
}
```

Message can be defined directly or loaded from message template (stored in msgtemplates service);

When message is set directly its subject, text and html content can be set by handlebars template,
that it processed using parameters set. Here is an example:

```html
Dear {{ name }},
<p/>
Please, help us to verify your email address. Your verification code is {{ code }}.
<p/>
Click on the 
<a href="{{ clientUrl }}/#/verify_email?server_url={{ serverUrl }}&email={{ email }}&code={{ code }}">link</a>
to complete verification procedure
<p/>
---<br/>
{{ signature }}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-users2/service-msgdistribution-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 
Example of microservice configuration
```yaml
---
- descriptor: "service-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "service-msgdistribution:controller:default:default:1.0"
  
- descriptor: "service-msgdistribution:service:commandable-http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-msgdistribution-node": "^1.0.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
var sdk = new require('client-msgdistribution-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
var config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.MessageDistributionHttpClientV1(config);

// Connect to the microservice
try {
    await client.open(null);
    // Work with the microservice
    ...
} catch(err) {
    console.error('Connection to the microservice failed');
    console.error(err);
}

```

Now the client is ready to perform operations
```javascript
// Send email message to address
await client.sendMessageToRecipient(
    null, '123', null,
    { 
        subject: 'Test',
        text: 'This is a test message. Please, ignore it'
    },
    null, 'all',
);
```

## Acknowledgements

This microservice was created and currently maintained by *Sergey Seroukhov*.

