import axios, { AxiosInstance } from 'axios';

/// Axiosのインスタンスを作成
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LYRICRAFT_API_URL,
  // デフォルトのヘッダーを設定し、リクエストがJSON形式で送信されるように指定
  headers: {
    'Content-Type': 'application/json'
  }
});

// リクエストインターセプターを設定
// リクエストがサーバーに送信される前にこのインターセプターが実行される
axiosInstance.interceptors.request.use(config => {
  // sessionStorageからアクセストークンを取得
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    // トークンが存在する場合は、リクエストヘッダーにAuthorizationヘッダーを追加
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  // 変更された設定をリクエストに適用
  return config;
}, error => {
  // リクエスト設定中にエラーが発生した場合、そのエラーをPromiseとして返す
  return Promise.reject(error);
});

// 作成したAxiosインスタンスをエクスポートし、他のモジュールで再利用可能にする
export default axiosInstance;
