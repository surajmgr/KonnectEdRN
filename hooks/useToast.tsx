import { useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

export const useToast = () => {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [type, setType] = useState<ToastType>('info');

	const showToast = (msg: string, toastType: ToastType = 'info') => {
		setMessage(msg);
		setType(toastType);
		setVisible(true);
	};

	const hideToast = () => {
		setVisible(false);
	};

	return { visible, message, type, showToast, hideToast };
};
