import { Ionicons } from '@expo/vector-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { MotiText, MotiView } from 'moti';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

// Tab Bar Variants
const tabBarVariants = cva('flex-row', {
	variants: {
		variant: {
			default: 'border-t-[0.5px] border-border bg-background',
			elevated: 'bg-background shadow-lg shadow-black/10',
			blur: 'border-t border-0.5 border-border/50 bg-background/80',
			transparent: 'bg-transparent',
			glass: 'border-t border-0.5 border-border/30 bg-background/70',
		},
		size: {
			default: 'h-16',
			compact: 'h-14',
			comfortable: 'h-20',
		},
		spacing: {
			default: '',
			padded: 'px-2',
			spacious: 'px-4',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
		spacing: 'default',
	},
});

// Tab Item Variants
const tabItemVariants = cva('flex-1 items-center justify-center gap-0.5', {
	variants: {
		animation: {
			none: '',
			scale: '',
			bounce: '',
			spring: '',
		},
	},
	defaultVariants: {
		animation: 'spring',
	},
});

// Icon Container Variants
const iconContainerVariants = cva('items-center justify-center', {
	variants: {
		style: {
			default: '',
			pill: 'rounded-full px-4 py-0.5',
			badge: 'rounded-2xl px-4 py-0.5',
			minimal: '',
			circle: 'rounded-full p-0.5',
		},
	},
	defaultVariants: {
		style: 'default',
	},
});

// Label Variants
const labelVariants = cva('text-xs font-medium', {
	variants: {
		hideLabel: {
			true: 'opacity-0 h-0',
			false: 'opacity-100',
		},
	},
	defaultVariants: {
		hideLabel: false,
	},
});

export interface TabBarProps extends VariantProps<typeof tabBarVariants> {
	className?: string;
	children?: React.ReactNode;
	margin?: {
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
	};
	/** @deprecated Use margin.bottom instead */
	bottomMargin?: number;
	useSafeArea?: boolean;
	style?: object;
	backgroundColor?: string;
	borderColor?: string;
	borderWidth?: number;
}

export interface TabConfigProps {
	label: string;
	icon: keyof typeof Ionicons.glyphMap;
	iconFocused?: keyof typeof Ionicons.glyphMap;
	focused: boolean;
	springConfig?: {
		damping?: number;
		stiffness?: number;
		mass?: number;
	};
	animation?: 'none' | 'scale' | 'bounce' | 'spring';
	iconStyle?: VariantProps<typeof iconContainerVariants>['style'];
	hideLabel?: boolean;
	badge?: number;
	focusedColor?: string;
	unfocusedColor?: string;
	iconSize?: number;
	className?: string;
	activeScale?: number;
	animationDuration?: number;
	pillBackgroundColor?: string;
}

export interface TabItemProps extends VariantProps<typeof tabItemVariants> {
	onPress: () => void;
}

// Tab Bar Root Component
export const TabBar = React.forwardRef<View, TabBarProps>(
	(
		{
			className,
			variant,
			size,
			spacing,
			children,
			margin,
			useSafeArea = true,
			style,
			backgroundColor,
			borderColor,
			borderWidth,
			...props
		},
		ref
	) => {
		const insets = useSafeAreaInsets();
		const bottomPadding = useSafeArea ? insets.bottom : 0;

		const marginTop = margin?.top ?? 0;
		const marginBottom = margin?.bottom ?? 0;
		const marginLeft = margin?.left ?? 0;
		const marginRight = margin?.right ?? 0;

		const containerStyle = {
			paddingBottom: bottomPadding + marginBottom,
			paddingTop: marginTop,
			paddingLeft: marginLeft,
			paddingRight: marginRight,
			...(backgroundColor && { backgroundColor }),
			...(borderColor && { borderColor }),
			...(borderWidth !== undefined && { borderTopWidth: borderWidth }),
			...style,
		};

		return (
			<View
				ref={ref}
				className={cn(tabBarVariants({ variant, size, spacing }), className)}
				style={containerStyle}
				{...props}
			>
				{children}
			</View>
		);
	}
);

TabBar.displayName = 'TabBar';

// Tab Item Component with Moti Animations
export const TabItem = React.forwardRef<View, TabItemProps & TabConfigProps>(
	(
		{
			label,
			icon,
			iconFocused,
			focused,
			onPress,
			animation = 'spring',
			iconStyle = 'default',
			hideLabel = false,
			badge,
			focusedColor = '#000000',
			unfocusedColor = '#737373',
			iconSize = 22,
			className,
			activeScale = 0.92,
			animationDuration = 200,
			pillBackgroundColor,
			springConfig = {
				damping: 15,
				stiffness: 150,
				mass: 0.5,
			},
			...props
		},
		ref
	) => {
		const displayIcon = focused && iconFocused ? iconFocused : icon;
		const iconColor = focused ? focusedColor : unfocusedColor;
		const showPill =
			focused && (iconStyle === 'pill' || iconStyle === 'badge' || iconStyle === 'circle');

		const [isPressed, setIsPressed] = React.useState(false);

		const getTransition = (): {
			type: 'timing' | 'spring';
			duration?: number;
		} => {
			if (animation === 'none') {
				return { type: 'timing', duration: 0 };
			}
			if (animation === 'spring' || animation === 'bounce') {
				return {
					type: 'spring',
					...springConfig,
				};
			}
			return {
				type: 'timing',
				duration: animationDuration,
			};
		};

		const transition = getTransition();

		return (
			<Pressable
				ref={ref}
				onPress={onPress}
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
				className={cn(tabItemVariants({ animation }), className)}
				{...props}
			>
				<MotiView
					animate={{
						scale: isPressed ? activeScale : 1,
					}}
					transition={{
						type: 'spring',
						damping: 20,
						stiffness: 300,
					}}
					className="items-center justify-center"
				>
					<View className="relative items-center">
						{/* Animated Pill Background */}
						{showPill && (
							<MotiView
								animate={{
									scale: focused ? 1 : 0.8,
									opacity: focused ? 1 : 0,
								}}
								transition={transition}
								className={cn(iconContainerVariants({ style: iconStyle }))}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: pillBackgroundColor || 'rgba(0, 0, 0, 0.05)',
								}}
							/>
						)}

						{/* Animated Icon Container */}
						<MotiView
							animate={{
								scale: focused ? 1 : 0.95,
							}}
							transition={transition}
							className={cn(iconContainerVariants({ style: iconStyle }))}
						>
							<View className="relative">
								<Ionicons name={displayIcon} size={iconSize} color={iconColor} />

								{/* Badge */}
								{badge !== undefined && badge > 0 && (
									<MotiView
										from={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{
											type: 'spring',
											damping: 10,
											stiffness: 200,
										}}
										className="absolute -right-2 -top-2 min-w-[16px] h-[16px] rounded-full bg-destructive items-center justify-center px-1"
									>
										<Text className="text-[9px] font-bold text-destructive-foreground">
											{badge > 99 ? '99+' : badge}
										</Text>
									</MotiView>
								)}
							</View>
						</MotiView>
					</View>

					{/* Animated Label */}
					{!hideLabel && (
						<MotiText
							animate={{
								opacity: focused ? 1 : 0.6,
								translateY: focused ? 0 : 1,
							}}
							transition={transition}
							className={cn(
								labelVariants({ hideLabel }),
								focused ? 'text-foreground' : 'text-muted-foreground'
							)}
						>
							{label}
						</MotiText>
					)}
				</MotiView>
			</Pressable>
		);
	}
);

TabItem.displayName = 'TabItem';
