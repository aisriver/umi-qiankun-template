/*
 * @文件描述: 异常处理
 * @公司: thundersdata
 * @作者: 廖军
 * @Date: 2020-03-23 14:22:35
 * @LastEditors: 廖军
 * @LastEditTime: 2020-04-22 10:28:26
 */
import * as Sentry from '@sentry/browser';
import { message } from 'antd';
/**
 * 统一处理捕获的异常信息
 * @param error
 * @param message
 */
export const catchError = (error: object, msg?: string) => {
  console.error(error);
  const errorMessage = msg || error['message'];
  errorMessage && message.error(errorMessage);
};

/**
 * 统一封装try catch
 * @param func
 * @param params
 */
export interface TryCatchParams {
  errorMessage?: string;
}
export const tryCatch = async (func: Function, params?: TryCatchParams) => {
  const { errorMessage } = params || {};
  try {
    return await func();
  } catch (error) {
    catchError(error, errorMessage);
    // 统一捕获
    Sentry.captureException(error);
    return error;
  }
};
