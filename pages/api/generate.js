import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: "재회 타로 전자책 1장을 HTML 형식으로 작성해줘",
        },
      ],
    });

    const content = response.content?.[0]?.text || "생성 실패";

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(content);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
