import React, { useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import {
	View,
	Text,
	Image,
	StyleSheet,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
	const [uf, setUf] = useState('');
	const [city, setCity] = useState('');

	const navigation = useNavigation();

	function handleNavigationToPoints() {
		navigation.navigate('Points', { uf, city });
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ImageBackground
				source={require('../../assets/bg.png')}
				style={styles.container}
				imageStyle={{ width: 320, height: 380 }}
			>
				<View style={styles.main}>
					<Image source={require('../../assets/logo.png')} />
					<View>
						<Text style={styles.title}>Amar é doar sem esperar recompensa</Text>
						<Text style={styles.description}>
							Ajudamos pessoas a encontrarem pontos de doaçães de forma
							eficiente.
						</Text>
					</View>
				</View>

				<View style={styles.footer}>
					<TextInput
						style={styles.input}
						placeholder="Digite a Uf"
						value={uf}
						onChangeText={setUf}
						maxLength={2}
						autoCapitalize="characters"
						autoCorrect={false}
					/>
					<TextInput
						style={styles.input}
						placeholder="Digite a Cidade"
						value={city}
						autoCorrect={false}
						onChangeText={setCity}
					/>

					<RectButton style={styles.button} onPress={handleNavigationToPoints}>
						<View style={styles.buttonIcon}>
							<Icon name="arrow-right" size={24} color="#fff" />
						</View>
						<Text style={styles.buttonText}>Entrar</Text>
					</RectButton>
				</View>
			</ImageBackground>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 32,
	},

	main: {
		flex: 1,
		justifyContent: 'center',
	},

	title: {
		color: '#304f57',
		fontSize: 30,
		fontFamily: 'Ubuntu_700Bold',
		maxWidth: 290,
		marginTop: 68,
	},

	description: {
		color: '#304f57',
		fontSize: 16,
		fontFamily: 'Roboto_400Regular',
		marginTop: 16,
		lineHeight: 24,
		maxWidth: 260,
	},

	footer: {},

	input: {
		height: 60,
		backgroundColor: '#fff',
		borderRadius: 10,
		marginBottom: 10,
		paddingHorizontal: 16,
		fontSize: 16,
	},

	button: {
		backgroundColor: '#b02e38',
		height: 60,
		borderRadius: 10,
		overflow: 'hidden',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 8,
	},

	buttonIcon: {
		height: 60,
		width: 60,
		backgroundColor: 'rgba(0,0,0,0.1)',
		justifyContent: 'center',
		alignItems: 'center',
	},

	buttonText: {
		color: '#fff',
		fontSize: 20,
		flex: 1,
		textAlign: 'center',
		justifyContent: 'center',
		fontFamily: 'Roboto_500Medium',
	},
});

export default Home;
