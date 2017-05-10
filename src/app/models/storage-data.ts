import * as _ from "lodash";

export class StorageData<T> {
    constructor(public modifiedAt: Date, public data: T) {
    }

    isExpired(timeout: number): boolean {
        if (!_.isNil(this.modifiedAt)) {
            var currentDateTime = new Date();
            var modifiedAtDateTimeWithTimeout = new Date(this.modifiedAt);

            modifiedAtDateTimeWithTimeout.setSeconds(modifiedAtDateTimeWithTimeout.getSeconds() + timeout);

            return modifiedAtDateTimeWithTimeout < currentDateTime;
        }

        return false;

    }
}