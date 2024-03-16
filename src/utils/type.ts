/**
 * 判断是对象
 * @param value
 * @returns
 */
export function isObject(value: any) {
  return typeof value === 'object' && value !== null;
}
