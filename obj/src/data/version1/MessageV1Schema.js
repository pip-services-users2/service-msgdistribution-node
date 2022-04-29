"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class MessageV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('template', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('from', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('cc', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('bcc', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('reply_to', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('subject', null);
        this.withOptionalProperty('text', null);
        this.withOptionalProperty('html', null);
    }
}
exports.MessageV1Schema = MessageV1Schema;
//# sourceMappingURL=MessageV1Schema.js.map