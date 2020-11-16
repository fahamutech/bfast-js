import { BFastConfig} from '../conf';
import {HttpClientAdapter} from '../adapters/HttpClientAdapter';
import {isNode} from 'browser-or-node';
import * as FormDataNode from 'form-data';
import {RulesController} from './RulesController';
import {AuthController} from './AuthController';
import {RequestOptions} from './QueryController';
import {AppCredentials} from '../models/AppCredentials';

export class StorageController {

  constructor(private readonly restApi: HttpClientAdapter,
              private readonly auth: AuthController,
              private readonly rulesController: RulesController,
              private readonly appName = BFastConfig.DEFAULT_APP) {
  }

  async save(file: File | ReadableStream, uploadProgress: (progress: any) => void, options?: RequestOptions): Promise<string> {
    if (!(file && file instanceof File && file.name)) {
      throw new Error('file object to save required');
    }
    if (isNode && file instanceof ReadableStream) {
      return this._handleFileUploadInNode(file, uploadProgress, BFastConfig.getInstance().credential(this.appName), options);
    } else {
      return this._handleFileUploadInWeb(file, uploadProgress, BFastConfig.getInstance().credential(this.appName), options);
    }
  }

  async list(query: { keyword?: string, size?: number, skip?: number, after?: string } = {}, options?: RequestOptions): Promise<any[]> {
    const filesRule = await this.rulesController.storage('list', query, BFastConfig.getInstance().credential(this.appName), options);
    return this._handleFileRuleRequest(filesRule, 'list');
  }

  async delete(filename: string, options?: RequestOptions): Promise<string> {
    const filesRule = await this.rulesController.storage('delete', {filename}, BFastConfig.getInstance().credential(this.appName), options);
    return this._handleFileRuleRequest(filesRule, 'delete');
  }

  private async _handleFileRuleRequest(storageRule: any, action: string): Promise<any> {
    const credential = BFastConfig.getInstance().credential(this.appName);
    const response = await this.restApi.post(BFastConfig.getInstance().databaseURL(this.appName), storageRule, {
      headers: {
        'x-parse-application-id': credential.applicationId
      }
    });
    const data = response.data;
    if (data && data.files && data.files.list && Array.isArray(data.files.list)) {
      return data.files.list;
    } else {
      const errors = data.errors;
      throw errors && errors[`files.${action}`] ? errors[`files.${action}`] : {
        message: 'Fails to process your request',
        errors
      };
    }
  }

  private async _handleFileUploadInNode(readStream: ReadableStream, uploadProgress: (progress: any) => void,
                                        appCredentials: AppCredentials, options?: RequestOptions): Promise<string> {
    const headers = {};
    if (options && options?.useMasterKey === true) {
      Object.assign(headers, {
        masterKey: appCredentials.appPassword,
        'x-parse-application-id': appCredentials.applicationId
      });
    }
    const token = await this.auth.getToken();
    Object.assign(headers, {
      Authorization: `Bearer ${token}`
    });
    const formData = new FormDataNode();
    formData.append('file_stream', readStream);
    const response = await this.restApi.post<{ urls: string[] }>(
      BFastConfig.getInstance().databaseURL(this.appName, '/storage/' + appCredentials.applicationId), formData,
      {
        onUploadProgress: uploadProgress,
        headers
      }
    );
    const databaseUrl = BFastConfig.getInstance().databaseURL(this.appName);
    return databaseUrl + response.data.urls[0];
  }

  private async _handleFileUploadInWeb(file: File, uploadProgress: (progress: any) => void,
                                       appCredentials: AppCredentials, options?: RequestOptions): Promise<string> {
    const headers = {};
    if (options && options?.useMasterKey === true) {
      Object.assign(headers, {
        masterKey: appCredentials.appPassword,
        'x-parse-application-id': appCredentials.applicationId
      });
    }
    const token = await this.auth.getToken();
    Object.assign(headers, {
      Authorization: `Bearer ${token}`
    });
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.restApi.post<{ urls: string[] }>(
      BFastConfig.getInstance().databaseURL(this.appName, '/storage/' + appCredentials.applicationId), formData,
      {
        onUploadProgress: uploadProgress,
        headers
      }
    );
    const databaseUrl = BFastConfig.getInstance().databaseURL(this.appName);
    return databaseUrl + response.data.urls[0];
  }


}
