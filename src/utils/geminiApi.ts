
interface TravelInputs {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string;
}

export const generateTravelPlan = async (inputs: TravelInputs, apiKey: string): Promise<string> => {
  const prompt = `
You are an expert travel planner. Create a detailed, personalized travel itinerary based on the following information:

Source: ${inputs.source}
Destination: ${inputs.destination}
Travel Dates: ${inputs.startDate} to ${inputs.endDate}
Budget: ${inputs.budget}
Number of Travelers: ${inputs.travelers}
Interests: ${inputs.interests}

Please provide a comprehensive travel plan that includes:

1. **Overview**
   - Brief description of the destination
   - Best time to visit considerations
   - Duration of trip

2. **Budget Breakdown**
   - Estimated costs for flights
   - Accommodation suggestions with price ranges
   - Daily food budget recommendations
   - Activity and entertainment costs
   - Transportation costs
   - Emergency fund suggestions

3. **Day-by-Day Itinerary**
   - Detailed daily schedule
   - Must-visit attractions based on interests
   - Recommended restaurants and local cuisine
   - Transportation between locations
   - Approximate timing for each activity

4. **Accommodation Recommendations**
   - 3-4 hotel/accommodation options in different price ranges
   - Location benefits and amenities
   - Booking tips

5. **Transportation**
   - Flight recommendations and booking tips
   - Local transportation options
   - Getting around the destination

6. **Packing Suggestions**
   - Weather-appropriate clothing
   - Essential items based on planned activities
   - Documents needed

7. **Local Tips & Cultural Information**
   - Cultural etiquette
   - Language basics if applicable
   - Tipping customs
   - Safety considerations
   - Local customs to be aware of

8. **Emergency Information**
   - Important phone numbers
   - Embassy contact (if international)
   - Health and safety tips

Please make the plan practical, realistic within the given budget, and tailored to the specified interests. Format the response in a clear, easy-to-read structure.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
