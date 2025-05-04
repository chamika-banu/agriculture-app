export const timeAgo = (timestamp) => {
	const now = new Date()
	const past = new Date(timestamp)
	const diffMs = now - past // Calculate the difference in milliseconds
	const diffMins = Math.floor(diffMs / 60000) // Convert to minutes
	const diffHrs = Math.floor(diffMins / 60) // Convert to hours
	const diffDays = Math.floor(diffHrs / 24) // Convert to days

	// Return appropriate time format based on the difference
	if (diffMins < 1) return "Just now"
	if (diffMins < 60) return `${diffMins}m ago`
	if (diffHrs < 24) return `${diffHrs}h ago`
	if (diffDays < 30) return `${diffDays}d ago`
	
	return past.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	})
}

// Format timestamp into readable format
export const formatTime = (timestamp) => {
	return new Date(timestamp).toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		hourCycle: "h12",
	})
}

// Format timestamp into readable format
export const formatDate = (timestamp) => { 
	return new Date(timestamp).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	})
}