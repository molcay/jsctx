import { Context } from "./context";
import { RequestContextOptions } from "../types";
import { DEFAULT_REQUEST_OPTIONS } from "../constants";


export class RequestContext<REQ_TYPE, RES_TYPE> extends Context {
    private requestId;
    private _request: REQ_TYPE | undefined;
    private _response: RES_TYPE | undefined;

    constructor(options: RequestContextOptions = DEFAULT_REQUEST_OPTIONS) {
        super(options);
        this.requestId = options.reqIdFactory();
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
}
