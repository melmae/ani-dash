export interface MediaData {
    name: string,
    entries: MediaEntry[]
}

export interface MediaEntry {
    status: "current" | "planning" | "completed" | "dropped" | "paused",
    progress: number,
    score?: number,
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
            large: string,
        }
    }
}

export interface MediaActivity {
    createdAt: number,
    progress: string,
    status: string,
    media: {
        title: {
            english: string
        }
    }
}