import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import api from '../../services/api';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Image,
	Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { SvgUri } from 'react-native-svg';
import { Feather as Icon } from '@expo/vector-icons';

interface Item {
	id: number;
	title: string;
	image_url: string;
}

interface Point {
	id: number;
	image: string;
	image_url: string;
	name: string;
	latitude: number;
	longitude: number;
}

interface Params {
	uf: string;
	city: string;
}

const Points = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [points, setPoints] = useState<Point[]>([]);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [initialPosition, setInitialPosition] = useState<[number, number]>([
		0,
		0,
	]);

	const navigation = useNavigation();
	const route = useRoute();

	const routeParams = route.params as Params;

	useEffect(() => {
		async function loadPosition() {
			const { status } = await Location.requestPermissionsAsync();

			if (status !== 'granted') {
				Alert.alert(
					'Oooops...',
					'Precisamos de sua permissão para obter a localização'
				);
				return;
			}

			const location = await Location.getCurrentPositionAsync();

			const { latitude, longitude } = location.coords;

			setInitialPosition([latitude, longitude]);
		}

		loadPosition();
	}, []);

	useEffect(() => {
		api.get('items').then(response => {
			setItems(response.data);
		});
	}, []);

	useEffect(() => {
		api
			.get('points', {
				params: {
					city: routeParams.city,
					uf: routeParams.uf,
					items: selectedItems,
				},
			})
			.then(response => {
				setPoints(response.data);
			});
	}, [selectedItems]);

	function handleNavigationBack() {
		navigation.goBack();
	}

	function handleNavigationToDetail(id: number) {
		navigation.navigate('Detail', { point_id: id });
	}

	function handleSelectedItem(id: number) {
		const alreadySelected = selectedItems.findIndex(item => item === id);

		if (alreadySelected >= 0) {
			const filteredItems = selectedItems.filter(item => item !== id);
			setSelectedItems(filteredItems);
		} else {
			setSelectedItems([...selectedItems, id]);
		}
	}

	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleNavigationBack}>
					<Icon size={20} name="arrow-left" color="#b02e38" />
				</TouchableOpacity>

				<Text style={styles.title}>Bem vindo.</Text>
				<Text style={styles.description}>
					Encontre no mapa um ponto de doação.
				</Text>

				<View style={styles.mapContainer}>
					{initialPosition[0] !== 0 && (
						<MapView
							style={styles.map}
							initialRegion={{
								latitude: initialPosition[0],
								longitude: initialPosition[1],
								latitudeDelta: 0.014,
								longitudeDelta: 0.014,
							}}
						>
							{points.map(point => (
								<Marker
									key={String(point.id)}
									onPress={() => handleNavigationToDetail(point.id)}
									style={styles.mapMarker}
									coordinate={{
										latitude: point.latitude,
										longitude: point.longitude,
									}}
								>
									<View style={styles.mapMarkerContainer}>
										<Image
											style={styles.mapMarkerImage}
											source={{
												uri: point.image_url,
											}}
										/>
										<Text style={styles.mapMarkerTitle}>{point.name}</Text>
									</View>
								</Marker>
							))}
						</MapView>
					)}
				</View>
			</View>

			<View style={styles.itemsContainer}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 20 }}
				>
					{items.map(item => (
						<TouchableOpacity
							key={String(item.id)}
							style={[
								styles.item,
								selectedItems.includes(item.id) ? styles.selectedItem : {},
							]}
							onPress={() => handleSelectedItem(item.id)}
							activeOpacity={0.7}
						>
							<SvgUri width={60} height={60} uri={item.image_url} />
							<Text style={styles.itemTitle}>{item.title}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	selectedItem: {
		borderColor: '#b02e38',
		borderWidth: 2,
	},

	container: {
		flex: 1,
		padding: 32,
		paddingTop: 20 + Constants.statusBarHeight,
	},

	title: {
		color: '#304f57',
		fontSize: 20,
		fontFamily: 'Ubuntu_700Bold',
		maxWidth: 290,
		marginTop: 16,
	},

	description: {
		color: '#304f57',
		fontSize: 12,
		fontFamily: 'Roboto_400Regular',
		maxWidth: 260,
	},

	mapContainer: {
		flex: 1,
		width: '100%',
		borderRadius: 10,
		overflow: 'hidden',
		marginTop: 16,
	},

	mapMarker: {
		width: 90,
		height: 80,
	},

	map: {
		width: '100%',
		height: '100%',
	},

	itemsContainer: {
		flexDirection: 'row',
		marginTop: 0,
		marginBottom: 32,
	},

	item: {
		backgroundColor: '#fff',
		borderRadius: 8,
		borderColor: '#ccc',
		borderWidth: 1,
		height: 120,
		width: 100,
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 16,
		marginRight: 8,
		alignItems: 'center',
		justifyContent: 'space-between',
		textAlign: 'center',
	},

	itemTitle: {
		color: '#304f57',
		fontFamily: 'Roboto_400Regular',
		textAlign: 'center',
		fontSize: 10,
	},

	mapMarkerImage: {
		width: 90,
		height: 45,
		resizeMode: 'cover',
	},

	mapMarkerContainer: {
		backgroundColor: '#b02e38',
		width: 90,
		height: 70,
		flexDirection: 'column',
		borderRadius: 8,
		overflow: 'hidden',
		alignItems: 'center',
	},

	mapMarkerTitle: {
		flex: 1,
		fontFamily: 'Roboto_400Regular',
		color: '#FFF',
		fontSize: 10,
		lineHeight: 23,
		alignItems: 'center',
	},
});

export default Points;
