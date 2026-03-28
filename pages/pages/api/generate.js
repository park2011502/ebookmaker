import Anthropic from "@anthropic-ai/sdk";
import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await client.messages.create({
    model: "claude-3-sonnet",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: "재회 타로 전자책 1장을 작성해줘",
      },
    ],
  });

  const content = response.content[0].text;

  const html = `
    <html>
      <body style="font-family: Arial; line-height:1.6; padding:40px;">
        <h1 style="text-align:center;">타로 전자책</h1>
        <p>${content}</p>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const pdf = await page.pdf({ format: "A4" });

  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
}
