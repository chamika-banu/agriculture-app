import { View, Text, StyleSheet } from "react-native"
import React, { useState, useContext } from "react"
import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { TouchableOpacity } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { useAuth } from "../context/authContext"

const CommunityCard = ({ community, isMember, handleJoin, handleLeave }) => {
	const blurhash = "LCKMX[}@I:OE00Eg$%Na0eNHWp-B"
	const { user } = useAuth()	
	const { userId } = user
	const {
		imageUrl,
		name,
		members,
		description,
		_id: communityId,
		admin,
	} = community		
	

	const handleToggleMembership = () => {
		if (isMember) {
			handleLeave(communityId)
			
		} else {
			handleJoin(communityId)
		}
	}

	return (
		<View className="bg-white rounded-xl mb-4 overflow-hidden shadow-sm">
			<View className="flex flex-row gap-2">
				<View className="w-[100px] shadow-sm">
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

				<View className="flex-1 justify-between p-2">
					<Text className="text-lg font-psemibold">{name}</Text>
					<View className="flex-row items-center bg-gray-100 px-2 py-2 -ml-1 rounded-full self-start my-2">
						<Feather name="users" size={12} color="#6b7280" />
						<Text className="text-sm font-pmedium text-gray-500 ml-1">
							{members.length} {members.length === 1 ? "member" : "members"}
						</Text>
					</View>

					<Text
						className="text-base font-pregular text-gray-500 leading-5"
						numberOfLines={2}
						ellipsizeMode="tail"
					>
						{description}
					</Text>

					{admin === userId ? (
						<View className="flex-row mt-4 self-end items-center px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/10">
							<Ionicons
								name="shield-checkmark-outline"
								size={14}
								color="#22c55e"
							/>
							<Text className="text-green-500 font-pmedium text-base ml-2">
								Admin
							</Text>
						</View>
					) : (
						<TouchableOpacity
							onPress={handleToggleMembership}
							className={`px-3 py-1.5 mt-4 self-end rounded-full border border-green-500/20 ${
								isMember ? "bg-green-500/10" : ""
							}`}
						>
							{isMember ? (
								<View className="flex-row items-center">
									<Feather name="check" size={14} color="#22c55e" />
									<Text className="text-green-500 font-medium text-base ml-1">
										Joined
									</Text>
								</View>
							) : (
								<View className="flex-row items-center">
									<Feather name="plus" size={14} color="#22c55e" />
									<Text className="text-green-500 font-medium text-base ml-1">
										Join
									</Text>
								</View>
							)}
						</TouchableOpacity>
					)}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({	
	communityImage: {
		width: "100%",
		height: "100%",
		minHeight: 100,
		flex: 1,
	},
})

export default CommunityCard