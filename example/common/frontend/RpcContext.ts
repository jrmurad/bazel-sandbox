import { grpc } from "@improbable-eng/grpc-web";
import { BrowserHeaders } from "browser-headers";
import React from "react";
import { Observable, share } from "rxjs";

// copied from ts-proto's identical GrpcWebImpl for services

/* eslint-disable @typescript-eslint/no-explicit-any */
interface UnaryMethodDefinitionishR
  extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

export class GrpcWebImpl {
  private host: string;
  private options: {
    debug?: boolean;
    metadata?: grpc.Metadata;
    streamingTransport?: grpc.TransportFactory;
    transport?: grpc.TransportFactory;
  };

  constructor(
    host: string,
    options: {
      debug?: boolean;
      metadata?: grpc.Metadata;
      streamingTransport?: grpc.TransportFactory;
      transport?: grpc.TransportFactory;
    }
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
            ...this.options?.metadata.headersMap,
            ...metadata?.headersMap,
          })
        : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        debug: this.options.debug,
        host: this.host,
        metadata: maybeCombinedMetadata,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new Error(response.statusMessage) as any;
            err.code = response.status;
            err.metadata = response.trailers;
            reject(err);
          }
        },
        request,
        transport: this.options.transport,
      });
    });
  }

  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined
  ): Observable<any> {
    // Status Response Codes (https://developers.google.com/maps-booking/reference/grpc-api/status_codes)
    const upStreamCodes = [2, 4, 8, 9, 10, 13, 14, 15];
    const DEFAULT_TIMEOUT_TIME = 3_000;
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
            ...this.options?.metadata.headersMap,
            ...metadata?.headersMap,
          })
        : metadata || this.options.metadata;
    return new Observable((observer) => {
      const upStream = () => {
        const client = grpc.invoke(methodDesc, {
          debug: this.options.debug,
          host: this.host,
          metadata: maybeCombinedMetadata,
          onEnd: (code: grpc.Code, message: string) => {
            if (code === 0) {
              observer.complete();
            } else if (upStreamCodes.includes(code)) {
              setTimeout(upStream, DEFAULT_TIMEOUT_TIME);
            } else {
              observer.error(new Error(`Error ${code} ${message}`));
            }
          },
          onMessage: (next) => observer.next(next),
          request,
          transport: this.options.streamingTransport || this.options.transport,
        });
        observer.add(() => client.close());
      };
      upStream();
    }).pipe(share());
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const grpcWebImpl = new GrpcWebImpl("https://127.0.0.1:8443", {});

export const RpcContext = React.createContext(grpcWebImpl);
