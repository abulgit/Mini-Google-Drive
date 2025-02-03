import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Auth() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-800 p-8 rounded-xl border border-zinc-700 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Welcome to Cloud Storage</h1>
          <p className="text-zinc-400">Sign in with Google to continue</p>
        </div>
        
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                await loginWithGoogle(credentialResponse.credential);
                navigate('/');
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
              auto_select
              shape="pill"
              size="large"
              text="continue_with"
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
} 