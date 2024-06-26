export interface GenericResponse<T> {
  code: number;
  message: string;
  data: T;
}
