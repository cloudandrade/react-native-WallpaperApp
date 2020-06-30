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
	Animated,
	TouchableWithoutFeedback,
	TouchableOpacity,
	/* 	CameraRoll, */
	Share,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ACCESS_KEY } from 'react-native-dotenv';
/* import { Permissions, FileSystem } from 'expo'; */

export default function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [images, setImages] = useState([]);
	const [scale, setScale] = useState('0px');
	const [isImageFocused, setIsImageFocused] = useState(false);
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

	/* async function saveToCameraRoll(item) {
		let cameraPermissions = await Permissions.getAsync(
			Permissions.CAMERA_ROLL
		);

		if (cameraPermissions.status !== 'granted') {
			cameraPermissions = await Permissions.askAsync(
				Permissions.CAMERA_ROLL
			);
		}

		if (cameraPermissions.status === 'granted') {
			FileSystem.downloadAsync(
				image.urls.regular,
				FileSystem.documentDirectory + image.id + '.jpg'
			)
				.then(({ uri }) => {
					CameraRoll.saveToCameraRoll(uri);
					alert('Saved to galery');
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			alert('Requires camera roll permissions');
		}
	} */

	function showControls(item) {
		setIsImageFocused(!isImageFocused);
		if (isImageFocused === true) {
			setScale('0px');
		} else {
			setScale('30px');
		}
	}

	async function shareWallPaper(image) {
		try {
			await Share.share({
				message: 'Checkout this wallpaper ' + image.urls.full,
			});
		} catch (error) {
			console.log(error);
		}
	}

	function renderItem(image) {
		return (
			<View style={{ flex: 1 }}>
				<View
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						left: 0,
						bottom: 0,
						backgroundColor: 'black',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<ActivityIndicator size="large" color="grey" />
				</View>
				<TouchableWithoutFeedback
					onPress={(item) => showControls(item)}
				>
					<Animated.View
						style={{
							height,
							width,
							padding: scale,
						}}
					>
						<Image
							style={{
								flex: 1,
								height: null,
								width: null,
							}}
							source={{ uri: image.urls.regular }}
							resizeMode="cover"
						/>
					</Animated.View>
				</TouchableWithoutFeedback>

				{isImageFocused ? (
					<Animated.View
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
							height: 80,
							backgroundColor: 'black',
							flexDirection: 'row',
							justifyContent: 'space-around',
						}}
					>
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => loadWallPapers()}
							>
								<Ionicons
									name="ios-refresh"
									color="white"
									size={40}
								/>
							</TouchableOpacity>
						</View>

						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={(item) =>
									/* saveToCameraRoll(item) */ alert(
										'Unable to save yet'
									)
								}
							>
								<Ionicons
									name="ios-share"
									color="white"
									size={40}
								/>
							</TouchableOpacity>
						</View>

						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={(item) =>
									shareWallPaper(item)
								}
							>
								<Ionicons
									name="ios-save"
									color="white"
									size={40}
								/>
							</TouchableOpacity>
						</View>
					</Animated.View>
				) : (
					<></>
				)}
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
						scrollEnabled={!isImageFocused}
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
