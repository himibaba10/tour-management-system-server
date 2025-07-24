export interface IErrorSources {
  field: string;
  message: string;
}

export interface IErrorResponse {
  message: string;
  errorSources?: IErrorSources[];
  statusCode?: number;
}
