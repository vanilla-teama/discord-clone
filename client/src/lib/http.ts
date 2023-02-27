import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URL } from '../constants';
import socket from './socket';
import { IExpressError } from '../types/http-errors';
import { toggleLoader } from '../utils/functions';

export enum ErrorStatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
}

export const isExpressError = <T = unknown>(error: IExpressError<T> | Error): error is IExpressError<T> => {
  return 'data' in error;
};

export const handleError = <T>(error: IExpressError<T> | Error, callback: (error: IExpressError<T>) => void) => {
  if (isExpressError<T>(error)) {
    callback(error);
  } else {
    console.error(error);
  }
};

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
};

export const multipartHeaders = {
  Accept: 'multipart/form-data',
  'Content-Type': 'multipart/form-data; charset=utf-8',
};

// We can use the following function to inject the JWT token through an interceptor
// We get the `accessToken` from the localStorage that we set when we authenticate
const injectToken = (config: AxiosRequestConfig = {}): AxiosRequestConfig => {
  try {
    const token = localStorage.getItem('accessToken');
    config.headers = {};
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error(error);
  }
  return config;
};

class Http {
  private instance: AxiosInstance | null = null;
  connected = false;

  private get http(): AxiosInstance {
    return this.instance ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: API_URL,
      headers,
      withCredentials: true,
    });

    // http.interceptors.request.use(injectToken, (error: AxiosError) => Promise.reject(error));

    http.interceptors.request.use((config) => {
      if (config.url !== '/test' && !this.connected) {
        // throw Error('NO CONNECTION!');
      }
      return config;
    });

    http.interceptors.request.use((config) => {
      config.params = { ...config.params, socketId: socket.id };
      toggleLoader(true);
      return config;
    });

    http.interceptors.response.use(
      (response) => {
        toggleLoader(false);
        return response;
      },
      (error: AxiosError) => {
        const { response } = error;
        toggleLoader(false);
        return this.handleError(response);
      }
    );

    this.instance = http;

    return http;
  }

  request<T = unknown, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.http.request(config);
  }

  head<T = unknown, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.head<T, R>(url, config);
  }

  get<T = unknown, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T = unknown, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = unknown, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  patch<T = unknown, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.http.patch<T, R>(url, data, config);
  }

  delete<T = unknown, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  async test() {
    await this.http
      .head('/test')
      .then((res) => {
        if (res) {
          this.connected = true;
        }
      })
      .catch((error) => console.log(error));
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private handleError(error: AxiosResponse | undefined) {
    if (!error) {
      return;
    }
    const { status } = error;

    switch (status) {
      case ErrorStatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case ErrorStatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case ErrorStatusCode.Unauthorized: {
        // Handle Unauthorized
        break;
      }
      case ErrorStatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }

    return Promise.reject(error);
  }
}

export const http = new Http();
