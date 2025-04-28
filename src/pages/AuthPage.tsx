import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import UserRegistration from '../components/user/UserRegistration';
import useUserStore from '../store/userStore';

interface LoginFormData {
  email: string;
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login, isAuthenticated, isLoading } = useUserStore();
  
  // If user is already authenticated, redirect to report page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/report');
    }
  }, [isAuthenticated, navigate]);
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email);
      navigate('/report');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen pt-12 pb-24">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? 'Report incidents and track cases in your community'
                : 'Join the Namma Suraksha community network'}
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 py-4 text-center text-sm font-medium ${
                  isLogin
                    ? 'text-blue-900 border-b-2 border-blue-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 py-4 text-center text-sm font-medium ${
                  !isLogin
                    ? 'text-blue-900 border-b-2 border-blue-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register
              </button>
            </div>
            
            <div className="p-6">
              {isLogin ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                        icon={<Lock className="h-5 w-5" />}
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="font-medium text-blue-900 hover:text-blue-800"
                      >
                        Register now
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                <UserRegistration />
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By using Namma Suraksha, you agree to our{' '}
              <a href="#" className="font-medium text-blue-900 hover:text-blue-800">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-blue-900 hover:text-blue-800">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthPage;