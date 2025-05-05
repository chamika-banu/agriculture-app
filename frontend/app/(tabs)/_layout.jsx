import { Tabs } from "expo-router"
import { View } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import Ionicons from "@expo/vector-icons/Ionicons"
import { StatusBar } from "expo-status-bar"

const TabIcon = ({ icon, color, name, focused }) => {
	return (
		<View className="flex items-center justify-center" style={{ gap: 4 }}>
			{icon}
		</View>
	)
}

const TabLayout = () => {

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: "#2bbc49",
					tabBarInactiveTintColor: "#CDCDE0",
					tabBarShowLabel: false,
					tabBarStyle: {
						backgroundColor: "#f1fcf2",
						borderTopWidth: 1,
						borderTopColor: "#2bbc49",
						height: 64,
					},
					tabBarItemStyle: {
						paddingVertical: 8,
						justifyContent: "center",
						alignItems: "center",
					},
				}}
			>
				<Tabs.Screen
					name="home"
					options={{
						title: "Home",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={<Feather name="home" size={24} color={color} />}
								color={color}
								name="Home"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="plantations"
					options={{
						title: "Plantations",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={<Ionicons name="leaf-outline" size={24} color={color} />}
								color={color}
								name="Plantations"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="news"
					options={{
						title: "News",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={
									<Ionicons name="newspaper-outline" size={24} color={color} />
								}
								color={color}
								name="News"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="community"
					options={{
						title: "Community",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={<Feather name="users" size={24} color={color} />}
								color={color}
								name="Community"
								focused={focused}
							/>
						),
					}}
				/>

				<Tabs.Screen
					name="profile"
					options={{
						title: "Profile",
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={<Feather name="user" size={24} color={color} />}
								color={color}
								name="Profile"
								focused={focused}
							/>
						),
					}}
				/>
			</Tabs>

			<StatusBar backgroundColor="#F2F2F2" style="dark" />
		</>
	)
}

export default TabLayout
