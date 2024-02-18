import { MatSnackBarConfig } from "@angular/material/snack-bar";
import { PageData } from "./interfaces/page.data.interface";

export const ARTICLE_CONTENT_MAX_LENGTH = 500;
export const ARTICLE_TITLE_MAX_LENGTH = 150;

export const CHANNEL_NAME_MAX_LENGTH = 50;
export const CHANNEL_LINK_MAX_LENGTH = 150;

export const MAT_SNACKBAR_CONFIG: MatSnackBarConfig = {
    duration: 2000,
    horizontalPosition: 'start',
    verticalPosition: 'bottom',
};

export const CKEDITOR_CONFIG = {
    toolbar: {
      shouldNotGroupWhenFull: true
    }
  }

export const PLACEHOLDER_DATA: PageData = {
    backgroundColor: '#333333',
    title: "Site name",
    
    logo: 'https://via.placeholder.com/100x100',
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
            date: (Date.now() - 8.64e+7).toString(),
            id: -1
        }
    ],
    banner: 'https://via.placeholder.com/1900x400/222',
    calendar: [],
    navbar: [
        {
            id: 0,
            name: "Home",
            path: "",
            enabled: true,
        },
        {
            id: 1,
            name: "About",
            path: "about",
            enabled: true,
        }
    ],
    templateid: 0,
    progress: [
        {
            id: -1,
            name: "Progress1",
            raids: [
                {
                    difficulty: "Difficulty1",
                    max: 10,
                    current: 7,
                    id: -1,
                },
                {
                    difficulty: "Difficulty2",
                    max: 10,
                    current: 10,
                    id: -1,
                },
            ],
            background: 'https://via.placeholder.com/100x200/0'
        },
        {
            id: -1,
            name: "Progress2",
            raids: [
                {
                    difficulty: "Difficulty1",
                    max: 10,
                    current: 9,
                    id: -1,
                },
                {
                    difficulty: "Difficulty2",
                    max: 10,
                    current: 10,
                    id: -1,
                },
            ],
            background: 'https://via.placeholder.com/100x200/0'
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
            name: "Example1",
            link: "",
        },
        {
            id: -1,
            name: "Example2",
            link: "",
        }
    ],
    youtube: [
        {
            id: -1,
            name: "Example1",
            link: ""
        },
        {
            id: -1,
            name: "Example2",
            link: ""
        }
    ]
}