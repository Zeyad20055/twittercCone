// ============================================================
// CHANGE PASSWORD PAGE
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import userService from '../../services/userService';
import FormField from '../../components/forms/FormField';

// ─── Validation Schema ────────────────────────────────────────
const schema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Please confirm your new password'),
});

// ─── Eye Toggle — defined OUTSIDE to avoid recreation on every render ─────────
const EyeToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-twitter-text hover:text-twitter-white transition-colors"
    aria-label={show ? 'Hide password' : 'Show password'}
  >
    {show ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
);

// ─── Page Component ───────────────────────────────────────────
const ChangePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // BACKEND NOTE: POST /users/updatePassword
      await userService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      toast.success('Password changed successfully!');
      reset();
      navigate('/profile');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-twitter-border px-4 py-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-twitter-hover transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-twitter-white">Change password</h1>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* Info Banner */}
        <div className="bg-twitter-blue/10 border border-twitter-blue/30 rounded-xl p-4 mb-6 flex gap-3">
          <svg className="w-5 h-5 text-twitter-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-twitter-text text-sm leading-relaxed">
            Make sure your new password is at least 8 characters with an uppercase letter and a number.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Current Password" error={errors.currentPassword?.message} required>
            <div className="relative">
              <input
                {...register('currentPassword')}
                type={showCurrent ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder="Enter current password"
                autoComplete="current-password"
              />
              <EyeToggle show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} />
            </div>
          </FormField>

          <div className="border-t border-twitter-border my-4" />

          <FormField label="New Password" error={errors.newPassword?.message} required>
            <div className="relative">
              <input
                {...register('newPassword')}
                type={showNew ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <EyeToggle show={showNew} onToggle={() => setShowNew((v) => !v)} />
            </div>
          </FormField>

          <FormField label="Confirm New Password" error={errors.confirmNewPassword?.message} required>
            <div className="relative">
              <input
                {...register('confirmNewPassword')}
                type={showConfirm ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
            </div>
          </FormField>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => navigate(-1)} className="btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-blue flex-1">
              {isLoading ? 'Saving...' : 'Save password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
