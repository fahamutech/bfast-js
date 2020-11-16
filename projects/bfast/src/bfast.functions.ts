import {FunctionsController} from './controllers/FunctionsController';
import {AxiosRestController} from './controllers/AxiosRestController';
import {AuthController} from './controllers/AuthController';
import {CacheController} from './controllers/CacheController';
import {BFastConfig} from './conf';
import {SocketController} from './controllers/SocketController';
import {HttpRequestModel} from './models/HttpRequestModel';
import {EventResponseModel, HttpResponseModel} from './models/HttpResponseModel';
import {HttpNextModel} from './models/HttpNextModel';
import {isNode} from 'browser-or-node';

export class BfastFunctions {
  constructor(private readonly appName: string) {
  }

  request(path: string): FunctionsController {
    const config = BFastConfig.getInstance();
    const restController = new AxiosRestController();
    return new FunctionsController(
      path,
      restController,
      new AuthController(
        this.appName,
        restController,
        new CacheController(
          this.appName,
          config.cacheDatabaseName(BFastConfig.getInstance().DEFAULT_AUTH_CACHE_DB_NAME(), this.appName),
          config.cacheCollectionName(`cache`, this.appName),
          config.cacheAdapter(this.appName)
        ),
        config.authAdapter(this.appName)
      ),
      this.appName
    );
  }

  event(eventName: string, onConnect?: (data: any) => any, onDisconnect?: (data: any) => any): SocketController {
    return new SocketController(eventName, this.appName, onConnect, onDisconnect);
  }

  onHttpRequest(path: string,
                handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                  | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
    if (isNode) {
      return {
        method: null,
        path,
        onRequest: handler
      };
    } else {
      throw new Error('Works In NodeJs Environment Only');
    }
  }

  onPostHttpRequest(path: string,
                    handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                      | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
    if (isNode) {
      return {
        method: 'POST',
        path,
        onRequest: handler
      };
    } else {
      throw new Error('Works In NodeJs Environment Only');
    }
  }

  onPutHttpRequest(path: string,
                   handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                     | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
    if (isNode) {
      return {
        method: 'PUT',
        path,
        onRequest: handler
      };
    } else {
      throw new Error('Works In NodeJs Environment Only');
    }
  }

  onDeleteHttpRequest(path: string,
                      handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                        | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
    if (isNode) {
      return {
        method: 'DELETE',
        path,
        onRequest: handler
      };
    } else {
      throw new Error('Works In NodeJs Environment Only');
    }
  }

  onGetHttpRequest(path: string,
                   handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
                     | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
    if (isNode) {
      return {
        method: 'GET',
        path,
        onRequest: handler
      };
    } else {
      throw new Error('Works In NodeJs Environment Only');
    }
  }

  onEvent(path: string, handler: (request: { auth?: any, body?: any }, response: EventResponseModel) => any) {
    if (isNode) {
      return {
        name: path,
        onEvent: handler
      };
    } else {
      throw new Error('Works In NodeJs Environment Only');
    }
  }

  onGuard(path: string, handler: ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)[]
    | ((request: HttpRequestModel, response: HttpResponseModel, next?: HttpNextModel) => any)) {
    if (isNode) {
      return {
        path,
        onGuard: handler
      };
    } else {
      throw new Error('Works In NodeJs Environment Only');
    }
  }

  onJob(schedule: {
    second?: string,
    minute?: string,
    hour?: string,
    day?: string,
    month?: string,
    dayOfWeek?: string
  },    handler: (job: any) => any): { onJob: any, rule: string } {
    const defaultRule: any = {second: '*', minute: '*', month: '*', day: '*', dayOfWeek: '*', hour: '*'};
    Object.keys(schedule).forEach(key => {
      delete defaultRule[key];
    });
    Object.assign(schedule, defaultRule);
    // @ts-ignore
    const rule: any = Object.keys(schedule).map(x => schedule[x]).join(' ');
    if (isNode) {
      return {
        onJob: handler,
        rule,
      };
    } else {
      throw new Error('Works In NodeJs Environment Only');
    }
  }
}
