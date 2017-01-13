/// <reference path="../../node_modules/@types/jasmine/index.d.ts"/>
import { Type } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, HttpModule, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
export { async, inject } from '@angular/core/testing';

// testbed helper
export function testService(service: Type<any>, extraProviders: any[] = []) {
  this._testing = service;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        service,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (mockBackend, options) => new Http(mockBackend, options)
        },
        MockBackend,
        BaseRequestOptions,
        ...extraProviders
      ]
    });
  });
};

// http request helper
interface HttpMocker { (responseBody: string|Object, status?: number): void; }
interface HttpTestCallback { (thingWeAreTesting: any, mocker: HttpMocker): any; }
export function injectHttp(testFn: HttpTestCallback) {
  return inject([this._testing, MockBackend], (testing, mockBackend) => {
    let mocker = (resp: string|Object, status = 200) => {
      mockBackend.connections.subscribe(conn => {
        let body = typeof(resp) === 'string' ? resp : JSON.stringify(resp);
        conn.mockRespond(new Response(new ResponseOptions({body, status})));
      });
    };
    testFn(testing, mocker);
  });
};
