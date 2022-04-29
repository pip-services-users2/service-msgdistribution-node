# Configuration Guide <br/> Message Distribution Microservice

Message distribution microservice configuration structure follows the 
[standard configuration](https://github.com/pip-services/pip-services/blob/master/usage/Configuration.md) 
structure. 

* [controller](#controller)
* [service](#service)
  - [http](#service_http)
  - [seneca](#service_seneca)


## <a name="controller"></a> Controller

Example:
```yaml
- descriptor: "service-msgdistribution:controller:default:default:1.0"
```

## <a name="service"></a> Services

The **service** components (also called endpoints) expose external microservice API for the consumers. 
Each microservice can expose multiple APIs (HTTP/REST, Thrift or Seneca) and multiple versions of the same API type.
At least one service is required for the microservice to run successfully.

### <a name="service_http"></a> Http

HTTP/REST service has the following configuration properties:
- connection: object - HTTP transport configuration options
  - protocol: string - HTTP protocol - 'http' or 'https' (default is 'http')
  - host: string - IP address/hostname binding (default is '0.0.0.0')
  - port: number - HTTP port number

A detailed description of HTTP protocol version 1 can be found [here](HttpProtocolV1.md)

Example:
```yaml
- descriptor: "service-msgdistribution:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 3000
```

### <a name="service_seneca"></a> Seneca

Seneca service has the following configuration properties:
- connection: object - Seneca transport configuration options. See http://senecajs.org/api/ for details.
  - type: string - Seneca transport type 
  - host: string - IP address/hostname binding (default is '0.0.0.0')
  - port: number - Seneca port number

A detail description of Seneca protocol version 1 can be found [here](SenecaProtocolV1.md)

Example:
```yaml
- descriptor: "service-msgdistribution:service:seneca:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 3000
```

For more information on this section read 
[Pip.Services Configuration Guide](https://github.com/pip-services/pip-services/blob/master/usage/Configuration.md)
