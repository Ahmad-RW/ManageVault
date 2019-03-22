"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class OfflineProductStorage {
    constructor(id) {
        this.id = id;
    }
    static create(productPayload) {
        if (productPayload instanceof Object && 'storage_id' in productPayload) {
            return new OfflineProductStorage(productPayload.storage_id);
        }
        else {
            throw new index_1.TwilsockError('Field "storage_id" is missing');
        }
    }
}
exports.OfflineProductStorage = OfflineProductStorage;
