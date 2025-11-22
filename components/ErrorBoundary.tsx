import { Ionicons } from '@expo/vector-icons';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {}

	public resetError = () => {
		this.setState({ hasError: false, error: null });
	};

	public render() {
		if (this.state.hasError) {
			return (
				<SafeAreaView style={styles.container}>
					<View style={styles.content}>
						<Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
						<Text style={styles.title}>Oops! Something went wrong.</Text>
						<Text style={styles.message}>
							{this.state.error?.message || 'An unexpected error occurred.'}
						</Text>
						<TouchableOpacity style={styles.button} onPress={this.resetError}>
							<Text style={styles.buttonText}>Try Again</Text>
						</TouchableOpacity>
					</View>
				</SafeAreaView>
			);
		}

		return this.props.children;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		alignItems: 'center',
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginVertical: 10,
		color: '#1F2937',
	},
	message: {
		fontSize: 16,
		color: '#6B7280',
		textAlign: 'center',
		marginBottom: 20,
	},
	button: {
		backgroundColor: '#3B82F6',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});
