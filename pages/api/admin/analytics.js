import { getUsers, getVisits } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const users = await getUsers();
    const registeredUsersCount = users.length;

    let realVisits = await getVisits();

    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const totalViews = realVisits.length;
    const totalSessions = realVisits.filter((v) => v.isNew).length || Math.min(1, totalViews);

    const uniqueGuestsSet = new Set(
      realVisits.map((v) => `${v.device}-${v.browser}-${v.country}-${v.channel}`)
    );
    const uniqueGuests = uniqueGuestsSet.size;
    const totalUsers = registeredUsersCount + uniqueGuests;

    const activeLast30 = now - 30 * 60 * 1000;
    const activeUsers = realVisits.filter((v) => v.timestamp > activeLast30).length;
    const todayVisits = realVisits.filter((v) => v.timestamp > todayStart.getTime());

    const activeNew = todayVisits.filter((v) => v.isNew).length;
    const activeReturning = todayVisits.length - activeNew;

    const activeCounted = new Set(todayVisits.map((v) => `${v.device}-${v.browser}`));
    const activeTrafficTimeline = [];
    for (let i = 23; i >= 0; i--) {
      const hrStart = new Date();
      hrStart.setMinutes(0, 0, 0);
      hrStart.setHours(hrStart.getHours() - i);
      const hrEnd = new Date(hrStart.getTime() + 60 * 60 * 1000);
      const count = todayVisits.filter((v) => v.timestamp >= hrStart.getTime() && v.timestamp < hrEnd.getTime()).length;
      const label = hrStart.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
      activeTrafficTimeline.push({ time: label, visits: count, activeUsers: count });
    }

    const devicesMap = {};
    const countriesMap = {};
    const browsersMap = {};
    const pagesMap = {};

    for (const v of realVisits) {
      devicesMap[v.device] = (devicesMap[v.device] || 0) + 1;
      countriesMap[v.country] = (countriesMap[v.country] || 0) + 1;
      browsersMap[v.browser] = (browsersMap[v.browser] || 0) + 1;
      const p = v.path || "/";
      pagesMap[p] = (pagesMap[p] || 0) + 1;
    }

    const mobileCount = devicesMap["Mobile"] || 0;
    const desktopCount = devicesMap["Desktop"] || 0;
    const tabletCount = devicesMap["Tablet"] || 0;
    const deviceTotal = mobileCount + desktopCount + tabletCount || 1;

    const devices = {
      mobile: { count: mobileCount, percentage: Math.round((mobileCount / deviceTotal) * 100) },
      desktop: { count: desktopCount, percentage: Math.round((desktopCount / deviceTotal) * 100) },
      tablet: { count: tabletCount, percentage: Math.round((tabletCount / deviceTotal) * 100) },
    };

    const countryList = Object.entries(countriesMap)
      .map(([name, count]) => ({ name, count, flag: getCountryFlag(name), percentage: Math.round((count / totalViews) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const browserList = Object.entries(browsersMap)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / totalViews) * 100) }));

    const pageList = Object.entries(pagesMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const trafficGraph = [];
    const days = 7;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      const count = realVisits.filter((v) => v.timestamp >= dayStart.getTime() && v.timestamp < dayEnd.getTime()).length;
      trafficGraph.push({ date: dateStr, total: count });
    }

    return res.status(200).json({
      registeredUsersCount,
      totalUsers,
      activeUsers,
      sessionsCount: totalSessions,
      pageViewsCount: totalViews,
      trafficGraph,
      devices,
      countries: countryList,
      browsers: browserList,
      pagesRanking: pageList,
      realTimeStats: {
        activeUsers,
        newUsers: activeNew,
        returningUsers: activeReturning,
        chart: activeTrafficTimeline,
      },
      engagement: {
        pagesPerSession: totalSessions > 0 ? (totalViews / totalSessions).toFixed(2) : "0.00",
        sessionsPerUser: totalUsers > 0 ? (totalSessions / totalUsers).toFixed(2) : "0.00",
        viewsPerUser: totalUsers > 0 ? (totalViews / totalUsers).toFixed(2) : "0.00",
      },
      social: { instagram: 0, facebook: 0, visitors: 0, percentage: 0 },
      referral: { googleAccounts: 0, otherApps: 0, visitors: 0, percentage: 0 },
      organic: { googleSearch: 0, duckDuckGo: 0, visitors: totalViews, percentage: 100 },
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

function getCountryFlag(name) {
  const flags = {
    India: "🇮🇳", "United States": "🇺🇸", "United Kingdom": "🇬🇧",
    Bangladesh: "🇧🇩", Pakistan: "🇵🇰", Nepal: "🇳🇵",
    Canada: "🇨🇦", Australia: "🇦🇺", Germany: "🇩🇪",
    France: "🇫🇷", Brazil: "🇧🇷", Japan: "🇯🇵",
    "South Korea": "🇰🇷", Russia: "🇷🇺", China: "🇨🇳",
    Indonesia: "🇮🇩", Thailand: "🇹🇭", Vietnam: "🇻🇳",
    Philippines: "🇵🇭", Singapore: "🇸🇬", Malaysia: "🇲🇾",
  };
  return flags[name] || "🌍";
}
