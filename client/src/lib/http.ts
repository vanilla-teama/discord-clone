import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URL, PROD_API_URL } from '../constants';
import socket from './socket';

enum ErrorStatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin': '*',
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
      baseURL: PROD_API_URL,
      headers,
      withCredentials: true,
    });

    // http.interceptors.request.use(injectToken, (error: AxiosError) => Promise.reject(error));

    http.interceptors.request.use((config) => {
      if (config.url !== '/test' && !this.connected) {
        throw Error('NO CONNECTION!');
      }
      return config;
    });

    http.interceptors.request.use((config) => {
      config.params = { ...config.params, socketId: socket.id };
      return config;
    });

    http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const { response } = error;
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
