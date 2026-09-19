import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { imageBase64 } = body

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY

    // Fallback parser if API key is not configured or set to placeholder
    if (!apiKey || apiKey.includes('your-openrouter-key-here') || apiKey === 'sk-or-v1-...') {
      // Provide an intelligent mock estimation for instant demonstration
      return NextResponse.json({
        success: true,
        data: {
          food_item: 'Grilled Chicken Salad with Quinoa & Avocado',
          estimated_calories: 420,
          protein_g: 38,
          carbs_g: 28,
          fat_g: 18,
        },
        notice: 'Using demonstration analyzer (Add valid OPENROUTER_API_KEY to .env for live OpenRouter AI vision calls)',
      })
    }

    const prompt = `Analyze this food image. Provide nutritional estimates strictly in JSON format without markdown ticks, with no conversational preamble.

JSON Schema required:
{
  "food_item": "String name of the dish or food items",
  "estimated_calories": integer total calories,
  "protein_g": float protein in grams,
  "carbs_g": float carbohydrates in grams,
  "fat_g": float fats in grams
}`

    // Ensure data URL prefix is formatted properly for vision models
    const formattedImage = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://localhost:3000',
        'X-Title': 'Personal Productivity Hub',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: formattedImage,
                },
              },
            ],
          },
        ],
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('OpenRouter vision call error:', response.status, errText)

      // Fallback try secondary vision model if llama vision rate limited
      const fallbackResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://localhost:3000',
          'X-Title': 'Personal Productivity Hub',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite-001',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: { url: formattedImage },
                },
              ],
            },
          ],
        }),
      })

      if (!fallbackResponse.ok) {
        throw new Error(`OpenRouter API responded with status ${response.status}`)
      }

      const fallbackData = await fallbackResponse.json()
      const content = fallbackData.choices?.[0]?.message?.content ?? ''
      const parsed = parseJSONContent(content)
      return NextResponse.json({ success: true, data: parsed })
    }

    const data = await response.json()
    const contentText = data.choices?.[0]?.message?.content ?? ''
    const parsedData = parseJSONContent(contentText)

    return NextResponse.json({
      success: true,
      data: parsedData,
    })
  } catch (error: unknown) {
    console.error('Scan food error:', error)
    const message = error instanceof Error ? error.message : 'Failed to scan food image'
    return NextResponse.json(
      {
        success: false,
        error: message,
        fallbackData: {
          food_item: 'Healthy Meal Bowl',
          estimated_calories: 380,
          protein_g: 25,
          carbs_g: 45,
          fat_g: 12,
        },
      },
      { status: 500 }
    )
  }
}

function parseJSONContent(text: string) {
  // Strip markdown code fences if present
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }

  // Extract JSON block if surrounded by text
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1)
  }

  const rawObj = JSON.parse(cleaned)
  return {
    food_item: String(rawObj.food_item || rawObj.foodItem || 'Scanned Meal'),
    estimated_calories: Number(rawObj.estimated_calories || rawObj.calories || 350),
    protein_g: Number(rawObj.protein_g || rawObj.protein || 20),
    carbs_g: Number(rawObj.carbs_g || rawObj.carbs || 40),
    fat_g: Number(rawObj.fat_g || rawObj.fat || 10),
  }
}
