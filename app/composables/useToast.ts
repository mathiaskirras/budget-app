export const useToast = () => {
  const toast = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  }>('toast', () => ({
    message: '',
    type: 'success',
    visible: false,
  }));

  const showSuccess = (message: string) => {
    toast.value = {
      message,
      type: 'success',
      visible: true,
    };

    setTimeout(() => {
      toast.value.visible = false;
    }, 3000);
  };

  const showError = (message: string) => {
    toast.value = {
      message,
      type: 'error',
      visible: true,
    };

    setTimeout(() => {
      toast.value.visible = false;
    }, 4000);
  };

  return {
    toast,
    showSuccess,
    showError,
  };
};