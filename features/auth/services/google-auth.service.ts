import { auth, db } from "@/core/firebase/firebase.config";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../types";

// Configure Google Sign-In (call this in your app initialization)
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.googleWebClientId, // Your Web Client ID from Firebase
    offlineAccess: false,
  });
};

export const useGoogleAuth = () => {
  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign-in...");
      configureGoogleSignIn();
      console.log("Google Sign-In configured");

      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      console.log("Google Play Services supported");

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      console.log("Google sign-in successful:", userInfo);

      // Get the ID token
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error("No ID token received from Google");
      }

      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUser = userCredential.user;

      // Handle user creation in Firestore
      await handleUserCreation(firebaseUser);

      return firebaseUser;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);

      // Handle specific error codes
      if (error.code === "SIGN_IN_CANCELLED") {
        throw new Error("Google sign-in was cancelled");
      } else if (error.code === "IN_PROGRESS") {
        throw new Error("Google sign-in is already in progress");
      } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        throw new Error("Google Play Services not available");
      }

      throw error;
    }
  };

  const signOutGoogle = async () => {
    try {
      // Ensure Google Sign-In is configured before attempting to sign out
      configureGoogleSignIn();

      // Check if user is currently signed in with Google
      const isSignedIn = await GoogleSignin.hasPreviousSignIn();

      if (isSignedIn) {
        await GoogleSignin.signOut();
        console.log("Google sign out successful");
      }

      // Always sign out from Firebase
      await auth.signOut();
      console.log("Firebase sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);

      // If Google sign-out fails, still try to sign out from Firebase
      try {
        await auth.signOut();
        console.log(
          "Firebase sign out successful (after Google sign-out error)"
        );
      } catch (firebaseError) {
        console.error("Firebase sign out also failed:", firebaseError);
        throw firebaseError;
      }
    }
  };

  const handleUserCreation = async (firebaseUser: any) => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("Creating new user document in Firestore");
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || "",
        phoneNumber: firebaseUser.phoneNumber || "",
        emailVerified: firebaseUser.emailVerified,
        createdAt: new Date(),
      };

      await setDoc(userDocRef, userData);
      console.log("New Google user document created");
    } else {
      console.log("User document already exists");
    }
  };

  return {
    signInWithGoogle,
    signOutGoogle,
    configureGoogleSignIn,
  };
};
