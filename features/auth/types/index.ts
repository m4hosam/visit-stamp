export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  createdAt: Date;
  emailVerified?: boolean;
  authProvider?: string;
}
/**
 * Auth provider types
 */
export type AuthProvider = "password" | "google.com" | "unknown";

/**
 * Auth error codes for better error handling
 */
export enum AuthErrorCode {
  INVALID_EMAIL = "auth/invalid-email",
  USER_NOT_FOUND = "auth/user-not-found",
  WRONG_PASSWORD = "auth/wrong-password",
  EMAIL_IN_USE = "auth/email-already-in-use",
  WEAK_PASSWORD = "auth/weak-password",
  NETWORK_ERROR = "auth/network-request-failed",
  TOO_MANY_REQUESTS = "auth/too-many-requests",
  NO_USER = "auth/no-user",
  ALREADY_VERIFIED = "auth/already-verified",
  REQUIRES_PASSWORD = "auth/requires-password",
  REQUIRES_RECENT_LOGIN = "auth/requires-recent-login",
}

/**
 * Custom auth error with better typing
 */
export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode | string,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "AuthError";
  }
}
