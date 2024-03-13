import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../components/Editor/editor/axiosConfig';

declare global {
  interface Window { google: any; }
}

interface GoogleLoginButtonProps {
  clientId: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ clientId }) => {
  const router = useRouter();

  const handleCredentialResponse = useCallback(async (response: any) => {
    console.log("Encoded JWT ID token: " + response.credential);
    try {
      const accessToken = response.credential;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const backendResponse = await axiosInstance.post('authentication/google_create', {
        token: accessToken,
      });
      if (backendResponse.status === 200) {
        console.log('ログイン成功:', backendResponse.data);
        const accessToken = backendResponse.headers['accesstoken'];
        if (accessToken) {
          sessionStorage.setItem('accessToken', accessToken);
        }
        alert('ログインしました。');
        router.push('main/Editor');
      }
    } catch (error) {
      console.error('バックエンドへのリクエストエラー:', error);
    }
  }, [router]); // routerを依存配列に追加

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginButton"),
        { theme: "outline", size: "large" }
      );
      window.google.accounts.id.prompt();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, handleCredentialResponse]); // handleCredentialResponseを依存配列に追加

  return (
    <div id="googleLoginButton"></div>
  );
};

export default GoogleLoginButton;