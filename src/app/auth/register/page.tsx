'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Eye, EyeOff, Phone, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormInput,
  FormSubmit,
  FormSuccess,
  ValidationSchemas,
} from '@/components/ui/form';
import { accountService } from '@/lib/services';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { getClientId } from '@/lib/utils/client-id';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Step 1: Initial registration form schema
const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
    cellphone: z.string().min(10, 'Please enter a valid phone number'),
    password: ValidationSchemas.password,
    confirmPassword: z.string(),
    birthDate: z.string().min(1, 'Birth date is required'),
    sex: z.enum(['male', 'female', 'other']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Step 2: OTP verification schema
const otpSchema = z.object({
  phoneOtpCode: z.string().length(8, 'OTP code must be 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registerData, setRegisterData] = useState<RegisterFormData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');

  // Step 1: Send registration data and request OTP
  const handleRegister = async (data: RegisterFormData) => {
    try {
      const clientId = getClientId();

      // Send registration request - backend will send OTP to phone
      await accountService.register({
        clientId,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        cellphone: data.cellphone,
        password: data.password,
        birthDate: data.birthDate,
        sex: data.sex,
      });

      // Store registration data for verification step
      setRegisterData(data);
      setSuccess('OTP sent to your phone! Please check your messages.');
      toast.success('OTP sent to your phone!');

      // Move to OTP verification step
      setTimeout(() => {
        setStep('verify');
        setSuccess('');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleVerifyOtp = async (data: OtpFormData) => {
    if (!registerData) return;

    try {
      const clientId = getClientId();

      // Verify OTP and complete registration
      const response = await accountService.verifyRegister({
        clientId,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        username: registerData.username,
        cellphone: registerData.cellphone,
        password: registerData.password,
        birthDate: registerData.birthDate,
        sex: registerData.sex,
        phoneOtpCode: data.phoneOtpCode,
      });

      // Set token temporarily
      setAuth(response.accessToken);

      // Fetch user info
      const userInfo = await accountService.getUserInfo();

      // Store complete auth state with refresh token
      setAuth(response.accessToken, {
        id: userInfo.id.toString(),
        cellphone: userInfo.cellphone,
        username: userInfo.username,
        displayName: `${userInfo.firstName} ${userInfo.lastName}`.trim() || userInfo.username,
        avatar: userInfo.avatar,
        role: userInfo.role,
        isVerified: userInfo.isVerified,
      }, response.refreshToken);

      setSuccess('Registration successful! Redirecting to dashboard...');
      toast.success('Welcome to Nivafy Admin Panel!');

      setTimeout(() => {
        router.replace('/admin/dashboard');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
      throw error;
    }
  };

  // Render Step 1: Registration Form
  if (step === 'register') {
    return (
      <div className="grid gap-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your details below to create your account
          </p>
        </div>

        <Form
          schema={registerSchema}
          onSubmit={handleRegister}
          defaultValues={{
            firstName: '',
            lastName: '',
            username: '',
            cellphone: '',
            password: '',
            confirmPassword: '',
            birthDate: '',
            sex: 'male' as const,
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="firstName"
              label="First Name"
              type="text"
              placeholder="John"
              required
            />
            <FormInput
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Doe"
              required
            />
          </div>

          <FormInput
            name="username"
            label="Username"
            type="text"
            placeholder="johndoe"
            required
          />

          <FormInput
            name="cellphone"
            label="Phone Number"
            type="tel"
            placeholder="+1234567890"
            required
          />

          <FormInput
            name="birthDate"
            label="Birth Date"
            type="date"
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select name="sex" defaultValue="male">
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <FormInput
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
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

          <div className="relative">
            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              required
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-8 h-7 w-7 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          <FormSuccess message={success} show={!!success} />
          <FormSubmit className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Send OTP
          </FormSubmit>
        </Form>

        <p className="text-muted-foreground px-8 text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>

        {/* Password requirements */}
        <Alert>
          <AlertDescription>
            <strong>Password requirements:</strong>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• At least 8 characters long</li>
              <li>• Include both letters and numbers</li>
              <li>• Use a mix of uppercase and lowercase</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render Step 2: OTP Verification
  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Verify your phone
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter the 8-digit code sent to {registerData?.cellphone}
        </p>
      </div>

      <Form
        schema={otpSchema}
        onSubmit={handleVerifyOtp}
        defaultValues={{ phoneOtpCode: '' }}
        className="space-y-4"
      >
        <FormInput
          name="phoneOtpCode"
          label="OTP Code"
          type="text"
          placeholder="Enter 8-digit code"
          required
          maxLength={8}
        />

        <FormSuccess message={success} show={!!success} />

        <FormSubmit className="w-full">
          <User className="mr-2 h-4 w-4" />
          Verify & Create Account
        </FormSubmit>
      </Form>

      <Button
        variant="ghost"
        className="w-full"
        onClick={() => {
          setStep('register');
          setRegisterData(null);
        }}
      >
        Back to registration
      </Button>

      <Alert>
        <AlertDescription>
          <strong>Didn't receive the code?</strong>
          <p className="mt-1 text-xs">
            Please wait 60 seconds before requesting a new code.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
