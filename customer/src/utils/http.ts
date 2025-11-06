import { CapacitorHttp } from '@capacitor-community/http';
import { Capacitor } from '@capacitor/core';

export const fastFetch = async (url: string, options: any = {}) => {
  if (Capacitor.isNativePlatform()) {
    const response = await CapacitorHttp.request({
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      data: options.body ? JSON.parse(options.body) : undefined,
    });
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
    };
  }
  return fetch(url, options);
};
