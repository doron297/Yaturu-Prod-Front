/**
 * Yaturu
 * ## Welcome  This is a place to put general notes and extra information, for internal use.
 *   To get started designing/documenting this API, select a version on the left. ## Welcome
 *   This is a place to put general notes and extra information, for internal use. 
 *  To get started designing/documenting this API, select a version on the left.
 *
 * OpenAPI spec version: 
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as models from '../model/models';
import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

/* tslint:disable:no-unused-variable member-ordering */


@Injectable()
export class SiteApi {
    protected basePath = 'https://yaturu-test-server.appspot.com/_ah/api';
    public defaultHeaders: Headers = new Headers();
    public configuration: Configuration = new Configuration();

    constructor(protected http: Http, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
        }
        this.defaultHeaders.set('Content-Type', 'application/json');
    }

	/**
     * 
     * Extends object by coping non-existing properties.
     * @param objA object to be extended
     * @param objB source object
     */
    private extendObj<T1, T2>(objA: T1, objB: T2) {
        for (let key in objB) {
            if (objB.hasOwnProperty(key)) {
                objA[key] = objB[key];
            }
        }
        return <T1 & T2>objA;
    }

    /**
     * deleteSite
     * 
     * @param siteKey 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     */
    public dELETESiteSiteKey(siteKey: string, authorization: string, extraHttpRequestParams?: any): Observable<{}> {
        return this.dELETESiteSiteKeyWithHttpInfo(siteKey, authorization, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * getAllSite
     * 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     */
    public gETSite(authorization: string, extraHttpRequestParams?: any): Observable<Array<models.Site>> {
        return this.gETSiteWithHttpInfo(authorization, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * getSiteByKey
     * 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     */
    public gETSiteByKey(key: string, authorization: string, extraHttpRequestParams?: any): Observable<Array<models.Site>> {
        return this.getSiteSiteKeyWithHttpInfo(key, authorization, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }
    /**
     * updateSite
     * 
     * @param siteKey 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     * @param body 
     */
    public pOSTSiteSiteKey(siteKey: string, authorization: string, body?: models.Site, extraHttpRequestParams?: any): Observable<{}> {
        return this.pOSTSiteSiteKeyWithHttpInfo(siteKey, authorization, body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * createSite
     * 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     * @param body 
     */
    public pUTSite(authorization: string, body?: models.Site, extraHttpRequestParams?: any): Observable<models.KeyWrapper> {
        return this.pUTSiteWithHttpInfo(authorization, body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }


    /**
     * deleteSite
     * 
     * @param siteKey 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     */
    public dELETESiteSiteKeyWithHttpInfo(siteKey: string, authorization: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/site/${siteKey}`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'siteKey' is not null or undefined
        if (siteKey === null || siteKey === undefined) {
            throw new Error('Required parameter siteKey was null or undefined when calling dELETESiteSiteKey.');
        }
        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling dELETESiteSiteKey.');
        }
        headers.set('Authorization', String(authorization));

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];





        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Delete,
            headers: headers,
            search: queryParameters,
            body: ''
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = this.extendObj(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * getAllSite
     * 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     */
    public gETSiteWithHttpInfo(authorization: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/site`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling gETSite.');
        }
        headers.set('Authorization', String(authorization));

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];





        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters,
            body: '',
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = this.extendObj(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * get Site with key
     * 
     * @param siteKey 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     * @param body 
     */
    public getSiteSiteKeyWithHttpInfo(siteKey: string, authorization: string, body?: models.Site,
        extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/site/${siteKey}`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'siteKey' is not null or undefined
        if (siteKey === null || siteKey === undefined) {
            throw new Error('Required parameter siteKey was null or undefined when calling GetSiteSiteKey.');
        }
        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling GetSiteSiteKey.');
        }
        headers.set('Authorization', String(authorization));

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'text/html'
        ];



        headers.set('Content-Type', 'application/json');


        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = this.extendObj(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * updateSite
     * 
     * @param siteKey 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     * @param body 
     */
    public pOSTSiteSiteKeyWithHttpInfo(siteKey: string, authorization: string, body?: models.Site,
        extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/site/${siteKey}`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'siteKey' is not null or undefined
        if (siteKey === null || siteKey === undefined) {
            throw new Error('Required parameter siteKey was null or undefined when calling pOSTSiteSiteKey.');
        }
        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling pOSTSiteSiteKey.');
        }
        headers.set('Authorization', String(authorization));

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'text/html'
        ];



        headers.set('Content-Type', 'application/json');


        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = this.extendObj(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * createSite
     * 
     * @param authorization token with \&quot;Bearer \&quot; prefix
     * @param body 
     */
    public pUTSiteWithHttpInfo(authorization: string, body?: models.Site, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/site`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'authorization' is not null or undefined
        if (authorization === null || authorization === undefined) {
            throw new Error('Required parameter authorization was null or undefined when calling pUTSite.');
        }
        headers.set('Authorization', String(authorization));

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];
        headers.set('Content-Type', 'application/json');


        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Put,
            headers: headers,
            body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });
        if (extraHttpRequestParams) {
            requestOptions = this.extendObj(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

}
