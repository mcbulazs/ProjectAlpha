import { PageData } from "../interfaces/page.data.interface";

export const PLACEHOLDER_DATA: any = {
    title: "Site name",
    logo: {
        id: -1,
        path: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/2048px-Square_gray.svg.png",
    },
    articles: [
        {
            title: "article2",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            date: Date.now().toString(),
            id: -1
        },
        {
            title: "article1",
            content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            date: (Date.now()-8.64e+7).toString(),
            id: -1
        }
    ],
    banner: {
        id: -1,
        path: "https://images.squarespace-cdn.com/content/v1/55fc0004e4b069a519961e2d/1442580137999-2IE5WSQSTZASOG6EMYR0/logo.gif?format=1000w",
    },
    calendar: [],
    navbar: [
        {
            id: -1,
            name: "Home",
            order: 0,
            path: "/",
        },
        {
            id: -1,
            name: "About",
            order: 1,
            path: "/about",
        }
    ],
    presetId: 0,
    progress: [
        {
            id: -1,
            name: "Aberrus",
            raids: [
                {
                    difficulty: "Mythic",
                    max: 10,
                    current: 7,
                    id: -1,
                },
                {
                    difficulty: "Heroic",
                    max: 10,
                    current: 10,
                    id: -1,
                },
            ]
        },
        {
            id: -1,
            name: "Castle Nathria",
            raids: [
                {
                    difficulty: "Heroic",
                    max: 10,
                    current: 9,
                    id: -1,
                },
                {
                    difficulty: "Normal",
                    max: 10,
                    current: 10,
                    id: -1,
                },
            ]
        }
    ],
    recruitment: [
        {
            id: -1,
            class: "druid",
            subclasses: ["balance", "restoration"],
        },
        {
            id: -1,
            class: "deathknight",
            subclasses: ["unholy", "blood"],
        }
    ],
    twitch: [
        {
            id: -1,
            name: "Asmongold",
            link: "twitch.tv/asmongold",
        },
        {
            id: -1,
            name: "TheVR",
            link: "twitch.tv/thevr",
        }
    ],
    youtube: [
        {
            id: -1,
            name: "TheVR",
            link: "youtube.com/thevr"
        }
    ]
}

/* export function getPlaceholders(data: PageData) {
    console.log(data);
    let d = data as any;
    let key: keyof any;
    for (key in data) {
        if (Array.isArray(d[key]) && d[key].length === 0) {
            d[key] = PLACEHOLDER_DATA[key];
        }
    }
    if (data.banner.path === "") {
        data.banner = PLACEHOLDER_DATA.banner;
    }
    if (data.logo.path === "") {
        data.logo = PLACEHOLDER_DATA.logo;
    }
    if (data.title === "") {
        data.title = PLACEHOLDER_DATA.title;
    }
    return data;
} */