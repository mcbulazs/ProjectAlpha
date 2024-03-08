import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { PageData } from './interfaces/page.data.interface';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { environment } from '../environments/environment.development';
import { ChannelType } from './interfaces/channel.interface';

export const ARTICLE_CONTENT_MAX_LENGTH = 500;
export const ARTICLE_TITLE_MAX_LENGTH = 150;

export const CHANNEL_NAME_MAX_LENGTH = 50;
export const CHANNEL_LINK_MAX_LENGTH = 150;

export const MAT_SNACKBAR_CONFIG: MatSnackBarConfig = {
  duration: 2000,
  horizontalPosition: 'start',
  verticalPosition: 'bottom',
};

export const CKEDITOR_CONFIG: EditorConfig = {
  extraPlugins: [],
  simpleUpload: {
    // TODO: image upload
    uploadUrl: `${environment.backendURL}/page/1/files`,
    withCredentials: true,
    headers: {
      'Content-Type': 'image/png',
    },
  },
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      '|',
      'link',
      'bulletedList',
      'numberedList',
      'alignment',
      'horizontalLine',
      'fontColor',
      'fontFamily',
      'imageUpload',
      'mediaEmbed',
      'undo',
      'redo'
    ],
  },
};

export const STATIC_IMAGES_PATH = '/assets/images';

export const CHANNEL_TYPES: ChannelType[] = [
  {
    id: "0",
    name: 'Twitch',
    logo: `https://static-00.iconduck.com/assets.00/twitch-icon-489x512-jqw4vk2h.png`,
    color: 'plum',
  },
  {
    id: "1",
    name: 'YouTube',
    logo: `${STATIC_IMAGES_PATH}/youtube.png`,
    color: '#ff3a3a',
  },
];

export const PLACEHOLDER_DATA: PageData = {
  customcss: '',
  rules: '',
  presetid: 0,
  title: 'Site name',

  logo: 'https://via.placeholder.com/100x100',
  articles: [
    {
      title: 'Article2',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      date: Date.now().toString(),
      id: -1,
    },
    {
      title: 'Article1',
      content:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      date: (Date.now() - 8.64e7).toString(),
      id: -1,
    },
  ],
  banner: 'https://via.placeholder.com/1900x400/222',
  calendar: [],
  navbar: [
    {
      id: 0,
      name: 'Home',
      path: '',
      enabled: true,
    },
    {
      id: 1,
      name: 'About',
      path: 'about',
      enabled: true,
    },
  ],
  templateid: 0,
  progress: [
    {
      id: -1,
      name: 'Progress1',
      raids: [
        {
          difficulty: 'Difficulty1',
          max: 10,
          current: 7,
        },
        {
          difficulty: 'Difficulty2',
          max: 10,
          current: 10,
        },
      ],
      background: 'https://via.placeholder.com/100x200/0',
    },
    {
      id: -1,
      name: 'Progress2',
      raids: [
        {
          difficulty: 'Difficulty1',
          max: 10,
          current: 9,
        },
        {
          difficulty: 'Difficulty2',
          max: 10,
          current: 10,
        },
      ],
      background: 'https://via.placeholder.com/100x200/0',
    },
  ],
  recruitment: [
    {
      id: -1,
      class: 'druid',
      subclasses: ['balance', 'restoration'],
    },
    {
      id: -1,
      class: 'deathknight',
      subclasses: ['unholy', 'blood'],
    },
  ],
  channels: [
    {
      id: -1,
      name: 'Example1',
      link: '',
      site: '0',
    },
    {
      id: -1,
      name: 'Example2',
      link: '',
      site: '0',
    },
    {
      id: -1,
      name: 'Example1',
      link: '',
      site: '1',
    },
    {
      id: -1,
      name: 'Example2',
      link: '',
      site: '1',
    },
  ],
};
