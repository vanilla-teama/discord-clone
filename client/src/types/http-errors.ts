export interface IExpressError<T = unknown> {
  data: T;
  status: number;
}

export type ErrorCallback<T = unknown> = (error: Error | IExpressError<T>) => void;

export type LoginError = IExpressError<LoginErrorData>;

export type RegisterError = IExpressError<RegisterErrorData | LoginErrorData>;

export interface LoginErrorData {
  message: string;
}

export interface RegisterErrorData {
  errors: { value: string; msg: string; param: string; location: string }[];
}
