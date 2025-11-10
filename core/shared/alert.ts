// utils/alert.ts
// This creates a singleton instance that can be used anywhere in your app
// Similar to React Native's Alert.alert()

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface AlertInstance {
  showAlert: (options: {
    title: string;
    message?: string;
    buttons?: AlertButton[];
  }) => void;
}

let alertInstance: AlertInstance | null = null;

export const setAlertInstance = (instance: AlertInstance) => {
  alertInstance = instance;
};

export const Alert = {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => {
    if (!alertInstance) {
      console.warn(
        "Alert instance not initialized. Make sure AlertProvider is mounted."
      );
      return;
    }
    alertInstance.showAlert({ title, message, buttons });
  },
};
