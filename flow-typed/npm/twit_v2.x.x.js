// flow-typed signature: 869a03a0093e9012dc85b8deebfdb1f9
// flow-typed version: b43dff3e0e/twit_v2.x.x/flow_>=v0.25.x

declare module 'twit' {
  declare class Stream extends events$EventEmitter {
    stop(): void;
    start(): void;
  }
  declare class Twit {
    constructor(options: {
      consumer_key: string,
      consumer_secret: string,
      access_token: string,
      access_token_secret: string,
      timeout_ms?: number,
      trusted_cert_fingerprints?: string[],
    }): Twit;
    post(endpoint: string, options: Object, cb?: (err: ?Error, data: any, response: any) => mixed): Promise<any>;
    postMediaChunked(options: Object, cb?: (err: ?Error, data: any, response: any) => mixed): Promise<any>;
    get(endpoint: string, options: Object, cb?: (err: ?Error, data: any, response: any) => mixed): Promise<any>;
    stream(path: string, params?: Object): Stream;
  }
  declare module.exports: Class<Twit>;
}
