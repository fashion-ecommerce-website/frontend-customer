"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { VerifyOtpRequest } from "../types/verifyOtp.types";
import { authApi } from "@/services/api/authApi";
import { VerifyOtpPresenter } from "../components/VerifyOtpPresenter";
import { useToast } from '@/providers/ToastProvider';

export interface VerifyOtpContainerProps {
  email: string;
  redirectTo?: string;
}

export const VerifyOtpContainer: React.FC<VerifyOtpContainerProps> = ({
  email,
  redirectTo = "/auth/login",
}) => {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
  // clear previous errors via toast automatically
      const request: VerifyOtpRequest = { email, otpCode };
      const response = await authApi.verifyOtp(request);
      if (response.success) {
        router.push(redirectTo);
      } else {
        showError(response.message || "Invalid or expired OTP");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [email, otpCode, redirectTo, router, showError]);

  const handleChange = (value: string) => {
    setOtpCode(value);
  };

  return (
    <div className="bg-white min-h-[50vh]">
      <VerifyOtpPresenter
        email={email}
        otpCode={otpCode}
        isLoading={isLoading}
        onOtpChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
