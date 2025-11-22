export type CurrentScheme = 'light' | 'dark';

export const colors: Record<CurrentScheme, Record<string, string>> = {
	light: {
		tabBarBackgroundColor: '#faf9f6',
		tabBarBorderColor: '#ccc',
		tabBarPillBackgroundColor: 'rgba(99, 102, 241, 0.1)',
		tabBarFocusedColor: '#6366F1',
		tabBarUnfocusedColor: '#A3A3A3',
	},
	dark: {
		tabBarBackgroundColor: '#121212',
		tabBarBorderColor: '#868686',
		tabBarPillBackgroundColor: 'rgba(99, 102, 241, 0.1)',
		tabBarFocusedColor: '#6366F1',
		tabBarUnfocusedColor: '#A3A3A3',
	},
};

export const getColor = ({
	value,
	mode = 'light',
}: {
	value: keyof typeof colors.light;
	mode?: CurrentScheme;
}) => {
	return colors[mode][value];
};
