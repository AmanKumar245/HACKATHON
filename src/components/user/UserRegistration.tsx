import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import useUserStore from '../../store/userStore';

interface RegistrationFormData {
  name: string;
  email: string;
}

const UserRegistration: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormData>();
  const { register: registerUser, isLoading } = useUserStore();
  const navigate = useNavigate();
  
  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await registerUser(data.name, data.email);
      navigate('/report');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create an Account</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { 
                required: 'Name is required', 
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistration;