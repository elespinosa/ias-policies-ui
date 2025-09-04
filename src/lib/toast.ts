import { toast as localToast } from "sonner";

type ToastType = "error" | "success" | "info";

export const showToast = (message: string, type: ToastType = "info") => {
  const toastFn = (window as any).toast || localToast;

  toastFn[type](message, {
    duration: 4000,
    position: "bottom-right",
    id: `${type}-toast`,
  });
};

export const showToastWithDescription = (
  title: string,
  message: string,
  type: ToastType = "info"
) => {
  const toastFn = (window as any).toast || localToast;

  toastFn[type](title, {
    description: message,
    duration: 4000,
    position: "bottom-right",
    id: `${type}-toast`,
  });
};
