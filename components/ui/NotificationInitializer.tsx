// components/ui/NotificationInitializer.tsx
import { useEffect } from "react";
import { useNotifications } from "../../hooks/useNotifications";

export const NotificationInitializer: React.FC = () => {
  const { checkPermissions } = useNotifications();

  useEffect(() => {
    // Initialize permissions on app start
    const initializePermissions = async () => {
      try {
        await checkPermissions();
        console.log("Permissions initialized");
      } catch (error) {
        console.error("Failed to initialize permissions:", error);
      }
    };

    // Small delay to ensure app is fully loaded
    const timer = setTimeout(() => {
      initializePermissions();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};
