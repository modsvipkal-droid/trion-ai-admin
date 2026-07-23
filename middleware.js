import { NextResponse } from "next/server";

const BOT_PATTERNS = [
  /ahrefs/i, /semrush/i, /dotbot/i, /mj12bot/i, /majestic/i,
  /rogerbot/i, /exabot/i, /screaming/i, /yandex/i, /baiduspider/i,
  /petalbot/i, /scrapy/i, /curl/i, /wget/i, /python-urllib/i,
  /ruby/i, /perl/i, /nikto/i, /sqlmap/i, /nmap/i,
];

function detectBot(userAgent) {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";

  if (detectBot(userAgent)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|fonts|favicon.ico|main.png|manifest.json|robots.txt).*)",
  ],
};
