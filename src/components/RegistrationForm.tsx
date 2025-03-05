import React from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';

interface RegistrationFormProps {
    onRegistrationSuccess: (user: any) => void;
    onError: (message: string) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistrationSuccess, onError }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const response = await api.post('/users/register', data);
            onRegistrationSuccess(response.data);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                onError(error.response.data.message);
            } else {
                onError('Registration failed. Please try again later.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto p-4 border rounded">
            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Tên đăng nhập:</label>
                <input type="text" id="username" {...register("username", { required: 'Tên đăng nhập là bắt buộc' })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                {errors.username?.message ? <p className="text-red-500 text-xs italic">{errors.username.message as string}</p> : null}
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu:</label>
                <input type="password" id="password" {...register("password", { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' } })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                {errors.password?.message ? <p className="text-red-500 text-xs italic">{errors.password.message as string}</p> : null}
            </div>
            <div className="mb-4">
                <label htmlFor="displayName" className="block text-gray-700 text-sm font-bold mb-2">Tên hiển thị:</label>
                <input type="text" id="displayName" {...register("displayName", { required: 'Tên hiển thị là bắt buộc' })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                {errors.displayName?.message ? <p className="text-red-500 text-xs italic">{errors.displayName.message as string}</p> : null}
            </div>
            <div className="flex items-center justify-between">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Đăng ký
                </button>
            </div>
        </form>
    );
};

export default RegistrationForm;