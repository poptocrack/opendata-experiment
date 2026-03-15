import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const secret = process.env.ADMIN_SECRET;
  const isDev = process.env.NODE_ENV === "development";
  return isDev || (secret && token === secret);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);

  const [totalViews, todayViews, weekViews, monthViews, topPages, topReferrers, deviceBreakdown, dailyViews] =
    await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: today } } }),
      prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.pageView.groupBy({
        by: ["path"],
        _count: true,
        orderBy: { _count: { path: "desc" } },
        take: 20,
      }),
      prisma.pageView.groupBy({
        by: ["referrer"],
        where: { referrer: { not: null } },
        _count: true,
        orderBy: { _count: { referrer: "desc" } },
        take: 10,
      }),
      prisma.pageView.groupBy({
        by: ["device"],
        _count: true,
        orderBy: { _count: { device: "desc" } },
      }),
      // Daily views for the last 30 days (raw query for SQLite date grouping)
      prisma.$queryRawUnsafe<{ day: string; count: bigint }[]>(
        `SELECT date(createdAt) as day, COUNT(*) as count FROM PageView WHERE createdAt >= ? GROUP BY date(createdAt) ORDER BY day DESC LIMIT 30`,
        thirtyDaysAgo.toISOString()
      ),
    ]);

  return NextResponse.json({
    totalViews,
    todayViews,
    weekViews,
    monthViews,
    topPages: topPages.map((p) => ({ path: p.path, views: p._count })),
    topReferrers: topReferrers.map((r) => ({
      referrer: r.referrer,
      views: r._count,
    })),
    deviceBreakdown: deviceBreakdown.map((d) => ({
      device: d.device,
      views: d._count,
    })),
    dailyViews: dailyViews.map((d) => ({
      day: d.day,
      views: Number(d.count),
    })),
  });
}
