import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Image } from "expo-image"
import { Feather, Ionicons } from "@expo/vector-icons"
import React, { useContext } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "../context/authContext"

const CompactCommunityCard = ({ community, classname }) => {
	const blurhash = "LCKMX[}@I:OE00Eg$%Na0eNHWp-B"
	const { user } = useAuth()
	const { userId } = user
	const router = useRouter()
	const { imageUrl, name, members, _id: communityId, admin } = community

	return (
		<TouchableOpacity
			className={`w-[160px] bg-white rounded-xl overflow-hidden pb-4 mx-3 shadow-sm ${classname}`}
			onPress={() => router.push(`/community/${communityId}`)}
		>
			
			<View>
				{imageUrl && (
					<Image
						source={{ uri: imageUrl }}
						style={styles.communityImage}
						contentFit="cover"
						placeholder={{ blurhash }}
						transition={300}
					/>
				)}
			</View>

			
			<View className="pt-3 px-2">
				<Text className="text-lg font-pmedium line-clamp-1">{name}</Text>
				<View className="flex-row items-center justify-between mt-1">
					<View className="flex-row items-center">
						<Feather
							name="users"
							size={14}
							color="#6b7280"
						/>
						<Text className="text-md font-pmedium text-gray-500 ml-2 mt-1">
							{members.length} {members.length === 1 ? "member" : "members"}
						</Text>
					</View>
					{admin === userId && (
						<Ionicons
							name="shield-checkmark-outline"
							size={14}
							color="#22c55e"
						/>
					)}
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	communityImage: {
		width: "100%",
		height: "100%",
		minHeight: 120,
		flex: 1,
	},
})

export default CompactCommunityCard
