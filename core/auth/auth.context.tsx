import { auth } from "@/core/firebase/firebase.config";
import { AuthService } from "@/features/auth/services/auth.service";
import { UserService } from "@/features/auth/services/user.service";
import { AppUser } from "@/features/auth/types";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    phoneNumber?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        setFirebaseUser(firebaseUser);

        if (firebaseUser) {
          // Fetch user data from Firestore
          const userData = await UserService.getUser(firebaseUser.uid);

          if (userData) {
            // Update emailVerified from Firebase
            setUser({
              ...userData,
              emailVerified: firebaseUser.emailVerified,
            });
          } else {
            // Fallback to basic user data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || undefined,
              createdAt: new Date(),
              emailVerified: firebaseUser.emailVerified,
            });
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await AuthService.login(email, password);
    // User state will be updated by onAuthStateChanged
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    phoneNumber?: string
  ) => {
    await AuthService.register(email, password, displayName, phoneNumber);
    // User state will be updated by onAuthStateChanged
  };

  const logout = async () => {
    await AuthService.logout();
    // User state will be updated by onAuthStateChanged
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await UserService.getUser(firebaseUser.uid);
      if (userData) {
        setUser({
          ...userData,
          emailVerified: firebaseUser.emailVerified,
        });
      }
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
