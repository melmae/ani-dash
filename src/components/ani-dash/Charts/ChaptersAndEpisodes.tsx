import {CartesianGrid, Line, LineChart, XAxis} from "recharts"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.tsx"
import {useContext} from "react";
import {AppContext} from "@/AppContext.ts";
import {AniDashContext} from "@/components/ani-dash/AniDashContext.ts";
import {MediaActivity, MediaEntry} from "@/types/MediaData.ts";
import {useQuery} from "@tanstack/react-query";

interface Props {
    mediaType: "Anime" | "Manga"
}

export function ChaptersAndEpisodes({mediaType}: Props) {
    const {user} = useContext(AppContext);
    const { range } = useContext(AniDashContext);

    const chartConfig = {
        count: {
            label: "Count",
            color: user.theme,
        },
    } satisfies ChartConfig

    const { data: rawData } = useQuery({
        queryKey: ['activityData', mediaType, range],
        placeholderData: [],
        queryFn: getAllActivity,
        staleTime: 1000 * 60 * 60 // cache for an hour
    })

    const chartData = monthToDate();

    async function getAllActivity() {
        const allActivity = [];
        let hasNextPage = true;
        let page = 1;

        while (hasNextPage) {
            const result = await getPage(page);

            allActivity.push(...result.data);
            hasNextPage = result.hasNextPage;
            page++;

            await new Promise(resolve => setTimeout(resolve, 300)); // for rate limiting
        }

        return allActivity;
    }

    async function getPage(pageNumber: number) {
        const greaterThan = new Date(range.year, range.month, 1);
        const lessThan = new Date(range.year, range.month + 1, 1);

        const query = `
            query {
                Page (page: ${pageNumber}, perPage: 50) {
                    pageInfo {
                        currentPage,
                        perPage,
                        hasNextPage
                    }
                    activities(userId: ${user.id}, type: ${mediaType === 'Anime' ? 'ANIME_LIST' : 'MANGA_LIST'}, createdAt_greater: ${greaterThan.getTime() / 1000}, createdAt_lesser: ${lessThan.getTime() / 1000}) {
                        ... on ListActivity {
                            createdAt
                            media {
                                title {
                                    english
                                }
                            },
                            progress,
                            status
                        }
                    }
                }
            }
        `

        const url = 'https://graphql.anilist.co',
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                })
            };

        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch data.');
        const json = await response.json();

        return {
            data: json.data.Page.activities,
            hasNextPage: json.data.Page.pageInfo.hasNextPage,
        }
    }

    function monthToDate() {
        const today = new Date();

        const groupedByDay:{day: number, count: number}[] = [];
        const maxDays = today.getMonth() === range.month ? today.getDate() : new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        for (let i = 1; i <= maxDays; i++) {
            groupedByDay.push({day: i, count: 0});
        }
        rawData?.forEach(x => {
            groupedByDay.find(d => d.day === new Date(x.createdAt * 1000).getDate()).count += getCount(x);
        })
        return groupedByDay;
    }

    function getCount(entry: MediaActivity) {
        if (entry.status === 'completed') {
            return 1;
        } else if (entry.status === 'read chapter' || entry.status === 'watched episode') {
            const progressParts = entry.progress.split(' - ');
            if (progressParts.length > 1) {
                return parseInt(progressParts[1]) - parseInt(progressParts[0]);
            } else {
                return 1;
            }
        } else {
            return 0
        }
    }

    return (
        <Card className="w-1/4">
            <CardHeader>
                <CardTitle>{mediaType === 'Anime' ? `Episodes Watched` : `Chapters Read`}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey={"day"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Line
                            dataKey="count"
                            type="monotone"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <h2 className="text-md">{`Total ${mediaType === 'Anime' ? 'episodes' : 'chapters'}:`}</h2>
                <h1 className="text-2xl">{chartData.reduce((acc, x) => acc + x.count, 0)}</h1>
            </CardFooter>
        </Card>
    )
}