import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let loadingToastId = null;

export const showSuccessToast = (message, time) => {
  dismissToast();
  toast.success(message, {
    position: "top-right",
    autoClose: time || 1500,
    hideProgressBar: false, // Show progress bar
  });
};

export const showSuccessToastWithoutDismiss = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false, // Show progress bar
  });
}; 


export const showErrorToast = (message, time) => {
  dismissToast();
  toast.error(message, {
    position: "top-right",
    autoClose: time || 1500, // Use the passed time or default to 1500
    hideProgressBar: false,
  });
};

export const showErrorToastWithoutDismiss = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false, // Show progress bar
  });
};

export const showLoadingToast = (message) => {
  dismissToast();
  toast.info(message, {
    position: "top-right",
    autoClose: false, // Disable auto-close for loading state
    hideProgressBar: false, // Show progress bar
  });
};

export const showLoadingToastWithoutDismiss = (message) => {
  loadingToastId = toast.info(message, {
    position: "top-right",
    autoClose: false, // Disable auto-close for loading state
    hideProgressBar: false, // Show progress bar
  });
  return loadingToastId;
};


export const dismissToastById = (toastId) => {
  if (toastId !== null) {
    toast.dismiss(toastId);
  }
};


export const dismissToast = () => {
  toast.dismiss(); // Dismiss all toasts
};
