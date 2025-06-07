export interface MediaData {
    name: string,
    entries: MediaEntry[]
}

export interface MediaEntry {
    status: "current" | "planning" | "completed" | "dropped" | "paused" | "read chapter" | "watched episode",
    progress: string,
    completedAt: {
        day: number,
        month: number
        year: number
    },
    media: {
        genres: string[],
        title: {
            english: string,
            romaji: string
        },
        chapters: number,
        siteUrl: string,
        coverImage: {
            large: string
        }
    }
}