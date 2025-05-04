import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const analyzePlant = async (req, res) => {
	console.log("Received request to analyze plant image")

	try {
		const { plantType } = req.body

		if (!req.file) {
			console.error("No image uploaded")
			return res.status(400).json({ error: "No image uploaded" })
		}

		if (!plantType) {
			console.error("Plant type is required")
			return res.status(400).json({ error: "Plant type is required" })
		}

		console.log("Converting image buffer to base64")
		// Convert image buffer to base64 for processing
		const imageBase64 = req.file.buffer.toString("base64")
		const imageData = {
			inlineData: {
				data: imageBase64,
				mimeType: req.file.mimetype,
			},
		}

		console.log("Creating model instance")
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

		const prompt = `
                You are a tea and cinnamon plant disease detection expert.

                The plant type is: ${plantType.toLowerCase()}.

                Given the image of this ${plantType} plant, analyze it and respond in **JSON format** with:
                - Top 3 disease predictions
                - Accuracy percentage
                - Description of the disease
                - Eco-friendly treatment suggestions first (like neem oil, pruning), and only mention 1-2 chemical options at the end if necessary.             

                Format:
                {
                    "predictions": [
                        {
                            "disease": "Disease Name",
                            "accuracy": as a percentage,
                            "description": "Short explanation of the disease.",
                            "treatment": [
                                {
                                    "type": "eco-friendly",
                                    "method": "Description of eco-friendly treatment"
                                },
                                {
                                    "type": "chemical",
                                    "method": "Description of eco-friendly treatment"
                                }
                                ...
                                
                            ]
                        },
                        ...
                    ]
                }

                If the image does not contain a plant, or if the plant is not a tea or cinnamon plant, or if any other issue arises, respond with an error message in JSON format.

                Respond ONLY in JSON Object.`

		console.log("Generating content...")
		const result = await model.generateContent([prompt, imageData])
		const response = result.response
		const output = response.text()

		console.log("Analysis complete")
		res.status(200).json({
			message: "Analysis complete",
			data: {
				plantType,
				analysis: output,
			},
		})

		console.log("Output:", output)
	} catch (error) {
		console.error("Error in analyzePlant:", error)
		res.status(500).json({
			error: "Something went wrong in the server",
			details:
				process.env.NODE_ENV === "development" ? error.message : undefined,
		})
	}
}
