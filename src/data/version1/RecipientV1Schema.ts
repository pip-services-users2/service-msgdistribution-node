import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';

export class RecipientV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withOptionalProperty('name', TypeCode.String);
        this.withOptionalProperty('email', TypeCode.String);
        this.withOptionalProperty('phone', TypeCode.String);
        this.withOptionalProperty('language', TypeCode.String);
    }
}
