// ============================================================
// EDIT PROFILE PAGE
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import FormField from '../../components/forms/FormField';
import Avatar from '../../components/ui/Avatar';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').max(50).required('Name is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20)
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
    .required('Username is required'),
  bio: yup.string().max(160, 'Bio cannot exceed 160 characters').optional(),
});

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    },
  });

  const bio = watch('bio', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // BACKEND NOTE: PATCH /users
      // تأكد من الحقول المطلوبة من الـ Backend
      const response = await userService.updateProfile(data);
      
      // BACKEND NOTE: Adjust response field names if needed
      const updatedUser = response.user || response.data?.user || data;
      updateUser(updatedUser);
      toast.success('Profile updated!');
      navigate('/profile');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-twitter-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-twitter-hover transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-twitter-white">Edit profile</h1>
        </div>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="btn-primary text-sm px-4 py-1.5"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Cover */}
      <div className="h-32 bg-gradient-to-r from-twitter-blue via-blue-600 to-purple-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <button type="button" className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors" aria-label="Change cover photo">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="px-4 -mt-10 mb-6">
        <div className="relative inline-block">
          <div className="border-4 border-black rounded-full">
            <Avatar name={user?.name || user?.username} src={user?.profileImage} size="2xl" />
          </div>
          <button type="button" className="absolute bottom-1 right-1 p-1.5 bg-black/70 rounded-full text-white hover:bg-black/90 transition-colors border border-twitter-border">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-4">
        <FormField label="Name" error={errors.name?.message} required>
          <input {...register('name')} type="text" className="input-field" placeholder="Your name" />
        </FormField>

        <FormField label="Username" error={errors.username?.message} required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-twitter-text">@</span>
            <input {...register('username')} type="text" className="input-field pl-8" placeholder="username" />
          </div>
        </FormField>

        <FormField label="Bio" error={errors.bio?.message}>
          <div className="relative">
            <textarea
              {...register('bio')}
              rows={3}
              className="input-field resize-none pr-16"
              placeholder="Tell the world about yourself..."
            />
            <span className={`absolute bottom-3 right-3 text-xs ${bio.length > 150 ? 'text-red-400' : 'text-twitter-text'}`}>
              {bio.length}/160
            </span>
          </div>
        </FormField>

        {/* Email (read-only) */}
        <FormField label="Email">
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="input-field opacity-50 cursor-not-allowed"
          />
          <p className="text-xs text-twitter-text mt-1">Email cannot be changed here</p>
        </FormField>
      </form>
    </div>
  );
};

export default EditProfile;
