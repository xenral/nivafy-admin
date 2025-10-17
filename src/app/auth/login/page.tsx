'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormInput,
  FormCheckbox,
  FormSubmit,
  FormSuccess,
  ValidationSchemas,
} from '@/components/ui/form';
import { useAuthStore } from '@/stores/auth.store';
import { accountService } from '@/lib/services';
import { toast } from 'sonner';
import { getClientId } from '@/lib/utils/client-id';

// Login form schema with cellphone
const loginSchema = z.object({
  cellphone: z.string().min(10, 'Please enter a valid phone number'),
  password: ValidationSchemas.password,
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const handleLogin = async (data: LoginFormData) => {
    try {
      // Get persistent client ID for this device
      const clientId = getClientId();
      
      console.log('🔐 Starting login process...');
      
      // Step 1: Login to get access token
      const loginResponse = await accountService.login({
        clientId,
        cellphone: data.cellphone,
        password: data.password,
      });

      console.log('✅ Login successful, received tokens');

      // Step 2: Set token temporarily to allow getUserInfo call
      setAuth(loginResponse.accessToken);

      // Step 3: Fetch user info with the token
      console.log('📡 Fetching user info...');
      const userInfo = await accountService.getUserInfo();
      console.log('✅ User info received:', userInfo.username, 'Role:', userInfo.role);

      // Step 4: Store auth token, refresh token, and user data
      const authUser = {
        id: userInfo.id.toString(),
        cellphone: userInfo.cellphone,
        username: userInfo.username,
        displayName: `${userInfo.firstName} ${userInfo.lastName}`.trim() || userInfo.username,
        avatar: userInfo.avatar,
        role: userInfo.role,
        isVerified: userInfo.isVerified,
      };

      setAuth(loginResponse.accessToken, authUser, loginResponse.refreshToken);
      console.log('💾 Auth state saved to store (with refresh token)');

      // Verify storage
      const stored = localStorage.getItem('litepanel-auth-storage');
      console.log('📦 LocalStorage check:', stored ? 'Data saved' : 'FAILED TO SAVE');

      setSuccess('Login successful! Redirecting to dashboard...');
      toast.success('Welcome to Nivafy Admin Panel!');

      // Use window.location for guaranteed navigation
      console.log('🚀 Redirecting to dashboard...');
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 500);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error; // Let form handle the error
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your account to continue
        </p>
      </div>

      <Form
        schema={loginSchema}
        onSubmit={handleLogin}
        defaultValues={{ cellphone: '', password: '', rememberMe: false }}
        className="space-y-4"
      >
        <FormInput
          name="cellphone"
          label="Phone Number"
          type="tel"
          placeholder="+1234567890"
          required
        />

        <div className="space-y-2">
          <FormInput
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            required
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-8 h-7 w-7 p-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <FormCheckbox name="rememberMe" label="Remember me" />
        </div>

        <FormSuccess message={success} show={!!success} />

        <FormSubmit className="w-full">
          <Phone className="mr-2 h-4 w-4" />
          Sign In
        </FormSubmit>
      </Form>

      {/* Demo credentials for development */}
      {process.env.NODE_ENV === 'development' && (
        <Alert>
          <AlertDescription>
            <strong>Admin credentials:</strong>
            <br />
            Phone: +1000000000
            <br />
            Password: ChangeMe123!
            <br />
            <span className="text-xs text-muted-foreground">
              Run create-admin script if this account doesn't exist
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
