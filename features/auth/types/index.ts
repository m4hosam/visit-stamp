export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  createdAt: Date;
  emailVerified?: boolean;
  authProvider?: string;
}
