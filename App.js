import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	FlatList,
	Dimensions,
	Image,
} from 'react-native';
import axios from 'axios';
import { ACCESS_KEY } from 'react-native-dotenv';

export default function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [images, setImages] = useState([]);
	const { height, width } = Dimensions.get('window');

	useEffect(() => {
		loadWallPapers();
	}, []);

	function loadWallPapers() {
		axios
			.get(
				`https://api.unsplash.com/photos/random?count=30&client_id=${ACCESS_KEY}`
			)
			.then((response) => {
				setImages(response.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function renderItem(image) {
		return (
			<View style={{ height, width }}>
				<Image
					style={{
						flex: 1,
						height: null,
						width: null,
					}}
					source={{ uri: image.urls.regular }}
					resizeMode="cover"
				/>
			</View>
		);
	}

	return (
		<>
			{isLoading ? (
				<View
					style={{
						flex: 1,
						backgroundColor: 'black',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator
						size="large"
						color="grey"
					></ActivityIndicator>
				</View>
			) : (
				<View
					style={{
						flex: 1,
						backgroundColor: 'black',
					}}
				>
					<FlatList
						horizontal
						pagingEnabled
						data={images}
						renderItem={({ item }) => renderItem(item)}
						keyExtractor={(item) => item.id}
					/>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
