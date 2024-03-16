import { Obj2string } from '@/utils/index';
import { request } from '@umijs/max';

/** 登陆 POST /auth/oauth2/token */
export async function oauth2Login(body: LoginAPI.OauthLoginParams) {
  return request<LoginAPI.OauthLoginResult>('/admin/login', {
    method: 'POST',
    data: body,
  });
}

/** 登陆 POST /auth/social/bind/login */
export async function bindLogin(body: LoginAPI.LoginParams, options?: Record<string, any>) {
  return request<{
    data: LoginAPI.LoginResult;
  }>('/auth/social/bind/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 登陆 POST /auth/social/bind/login */
export async function signLogin(body: LoginAPI.LoginParams, options?: Record<string, any>) {
  return request<{
    data: LoginAPI.LoginResult;
  }>('/auth/social/sign/login', {
    method: 'post',
    data: body,
    ...(options || {}),
  });
}

/** 登陆 GET /admin/user/findByName */
export async function getUserDetailInfo(
  params: LoginAPI.UserDetailInfoParams,
  options?: Record<string, any>,
) {
  return request<LoginAPI.UserDetailInfoResult>('/admin/user/findByName', {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/** 登陆 GET /admin/user/success */
export async function loginSuccessCallback() {
  return request('/admin/user/success', {
    method: 'GET',
  });
}

/** 登陆 GET admin/menu/${username} */
export async function getAdminMenu(username: string, options?: Record<string, any>) {
  return request<LoginAPI.UserMenuResult>(`/admin/menu/${username}`, {
    method: 'GET',
    ...(options || {}),
  });
}
