import { generateText } from "@/lib/ai";

export async function POST(request: Request) {
	const { prompt } = await request.json();
	const result = await generateText(prompt);
	return Response.json({ result });
}
