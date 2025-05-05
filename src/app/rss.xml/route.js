// app/rss.xml/route.ts (Next.js App Router)
import { NextResponse } from "next/server";

export async function GET() {
  const feed = `
    <rss version="2.0">
      <channel>
        <title>Boykisser Quiz Updates</title>
        <link>https://boykisser.zyrofoxx.com</link>
        <description>Updates and news from the Boykisser Quiz</description>
        <item>
          <title>Quiz Launched!</title>
          <link>https://boykisser.zyrofoxx.com</link>
          <description>We just launched the chaotic meme-powered Boykisser Quiz.</description>
          <pubDate>${new Date().toUTCString()}</pubDate>
        </item>
      </channel>
    </rss>
  `.trim();

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/rss+xml"
    }
  });
}
