import { Tabs } from 'expo-router';
import { TabBar, TabItem } from '@/components/ui/tab-bar';
import { getColor } from '@/lib/colors';
import type { TabConfig } from '@/types/tabs';
import { useTheme } from '@/wrappers/ThemeProvider';

export default function Layout() {
	const { currentScheme } = useTheme();
	return (
		<Tabs
			initialRouteName="index"
			tabBar={(props) => (
				<TabBar
					variant="default"
					margin={{
						top: 10,
						bottom: 5,
						left: 1,
						right: 1,
					}}
					backgroundColor={getColor({
						value: 'tabBarBackgroundColor',
						mode: currentScheme,
					})}
					borderColor={getColor({ value: 'tabBarBorderColor', mode: currentScheme })}
					useSafeArea={true}
				>
					{props.state.routes.map((route, index) => {
						const isFocused = props.state.index === index;

						const onPress = () => {
							const event = props.navigation.emit({
								type: 'tabPress',
								target: route.key,
								canPreventDefault: true,
							});

							if (!isFocused && !event.defaultPrevented) {
								props.navigation.navigate(route.name);
							}
						};

						const tabConfig: TabConfig = {
							index: {
								label: 'Home',
								icon: 'home-outline',
								iconFocused: 'home',
								focused: isFocused,
								animation: 'spring',
								springConfig: {
									damping: 20,
									stiffness: 200,
									mass: 0.8,
								},
							},
							search: {
								label: 'Search',
								icon: 'search-outline',
								focused: isFocused,
								iconFocused: 'search',
								badge: 5,
							},
							notifications: {
								label: 'Notifications',
								icon: 'notifications-outline',
								focused: isFocused,
								iconFocused: 'notifications',
								badge: 10,
								animation: 'spring',
								springConfig: {
									damping: 20,
									stiffness: 200,
									mass: 0.8,
								},
							},
							settings: {
								label: 'Settings',
								icon: 'settings-outline',
								focused: isFocused,
								iconFocused: 'settings',
								animation: 'spring',
								springConfig: {
									damping: 20,
									stiffness: 200,
									mass: 0.8,
								},
							},
							profile: {
								label: 'Profile',
								icon: 'person-outline',
								focused: isFocused,
								iconFocused: 'person',
								animation: 'spring',
								springConfig: {
									damping: 20,
									stiffness: 200,
									mass: 0.8,
								},
							},
						};

						const config = tabConfig[route.name] || {
							label: route.name,
							icon: 'ellipse-outline',
						};

						return (
							<TabItem
								key={route.key}
								label={config.label}
								icon={config.icon}
								iconFocused={config.iconFocused}
								focused={config.focused}
								onPress={onPress}
								iconStyle={config.iconStyle || 'pill'}
								animation={config.animation || 'bounce'}
								springConfig={config.springConfig}
								focusedColor={
									config.focusedColor ||
									getColor({ value: 'tabBarFocusedColor', mode: currentScheme })
								}
								unfocusedColor={
									config.unfocusedColor ||
									getColor({ value: 'tabBarUnfocusedColor', mode: currentScheme })
								}
								pillBackgroundColor={
									config.pillBackgroundColor ||
									getColor({
										value: 'tabBarPillBackgroundColor',
										mode: currentScheme,
									})
								}
								hideLabel={config.hideLabel}
								badge={config.badge}
							/>
						);
					})}
				</TabBar>
			)}
		>
			<Tabs.Screen name="search" options={{ headerShown: false }} />
			<Tabs.Screen name="notifications" options={{ headerShown: false }} />
			<Tabs.Screen name="index" options={{ headerShown: false }} />
			<Tabs.Screen name="settings" options={{ headerShown: false }} />
			<Tabs.Screen name="profile" options={{ headerShown: false }} />
		</Tabs>
	);
}
