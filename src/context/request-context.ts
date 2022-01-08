import { Context } from "./context";
import { ContextOptions } from "../types";
import { DEFAULT_CONTEXT_OPTIONS } from "../constants";


export class RequestContext<REQ_TYPE, RES_TYPE> extends Context {
    private _request: REQ_TYPE | undefined;
    private _response: RES_TYPE | undefined;

    constructor(options: ContextOptions = { ...DEFAULT_CONTEXT_OPTIONS, ctxType:  'REQ-CTX' }) {
        super(options);
    }

    public get request(): REQ_TYPE | undefined {
        return this._request;
    }

    public set request(requestToSet: REQ_TYPE | undefined) {
        this._request = requestToSet;
    }

    public get response(): RES_TYPE | undefined {
        return this._response;
    }

    public set response(responseToSet: RES_TYPE | undefined) {
        this._response = responseToSet;
    }

    /**
     * This method returns an object that contains request related data to log.
     * You must override this to log HTTP request's headers, request IP address, etc.
     */
    public requestToLog(): object {
        return {};
    }

    /**
     * This method returns an object that contains response related data to log.
     * You must override this to log HTTP response's status code, message etc.
     */
    public responseToLog(): object {
        return {};
    }

    public get extras(): object {
        return {
          req: this.requestToLog(),
          res: this.responseToLog(),
        };
    }
}
