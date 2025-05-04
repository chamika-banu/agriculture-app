import "../global.css"
import { AuthProvider } from "../context/authContext"
import { CommunityProvider } from "../context/communityContext"
import Header from "../components/Header"

import { SplashScreen, Stack } from "expo-router"
import { useFonts } from "expo-font"
import { useEffect } from "react"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
	const [fontsLoaded, error] = useFonts({
		"Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
		"Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
		"Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
		"Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
		"Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
		"Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
		"Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
		"Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
		"Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
	})

	useEffect(() => {
		if (error) throw error

		if (fontsLoaded) {
			SplashScreen.hideAsync()
		}
	}, [fontsLoaded, error])

	if (!fontsLoaded && !error) {
		return null
	}

	return (
		<AuthProvider>
			<CommunityProvider>
				<Stack>
					<Stack.Screen name="index" options={{ headerShown: false }} />
					<Stack.Screen name="(auth)" options={{ headerShown: false }} />
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen
						name="communities"
						options={{ headerShown: false }}
						// options={{
						// 	header: () => (
						// 		<Header backLink={"community"} title="Communities" />
						// 	),
						// 	animation: "fade",
						// }}
					/>
					<Stack.Screen
						name="community/[communityId]"
						options={{ headerShown: false }}
						// options={{
						// 	header: () => (
						// 		<Header title="Community" backLink={"communities"} />
						// 	),
						// 	animation: "fade",
						// }}
					/>
					<Stack.Screen
						name="communityUser/[userId]"
						options={{ headerShown: false }}
						// options={{
						// 	header: () => <Header title="" />,
						// 	animation: "fade",
						// }}
					/>
					<Stack.Screen
						name="community/post/[postId]"
						options={{ headerShown: false }}
						// options={{
						// 	header: () => <Header title="Post" />,
						// 	animation: "fade",
						// }}
					/>
					<Stack.Screen
						name="community/post/reply/[postId]"
						options={{ headerShown: false }}
						// options={{
						// 	header: () => <Header title="Reply" />,
						// 	animation: "fade",
						// }}
					/>
				</Stack>
			</CommunityProvider>
		</AuthProvider>
	)
}

export default RootLayout
