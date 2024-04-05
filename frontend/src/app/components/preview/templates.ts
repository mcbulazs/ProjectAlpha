import { STATIC_IMAGES_PATH } from "../../constants";
import { Recruitment } from "../../interfaces/recruitment.interface";
import { TemplateOneAboutComponent } from "./templates/template-one/template-one-about/template-one-about.component";
import { TemplateOneRulesComponent } from "./templates/template-one/template-one-rules/template-one-rules.component";
import { TemplateOneComponent } from "./templates/template-one/template-one/template-one.component";
import { TemplateTwoComponent } from "./templates/template-two/template-two/template-two.component";
export interface Template {
    name: string
    image: string
    '': any
    about: any
    rules: any
    videos: any
    tactics: any
}

//! ALL USABLE TEMPLATES MUST BE INCLUDED
export const TEMPLATES: Template[] = [
    {
        name: 'Template 1',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateOneComponent,
        'about': TemplateOneAboutComponent,
        'rules': TemplateOneRulesComponent,
        'videos': TemplateOneAboutComponent,
        'tactics': TemplateOneAboutComponent,
    },
    {
        name: 'Template 2',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateTwoComponent,
        'about': TemplateOneAboutComponent,
        'rules': TemplateOneAboutComponent,
        'videos': TemplateOneAboutComponent,
        'tactics': TemplateOneAboutComponent,
    },
    {
        name: 'Template 3',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateTwoComponent,
        'about': TemplateOneAboutComponent,
        'rules': TemplateOneAboutComponent,
        'videos': TemplateOneAboutComponent,
        'tactics': TemplateOneAboutComponent,
    },
]

export interface Preset {
    name: string
    image: string
    logoImages: string[]
    backgroundImages: string[]
    classes: Recruitment[]
}

export const PRESETS: Preset[] = [
    {
        name: 'World of Warcraft',
        image: `${STATIC_IMAGES_PATH}/wow.png`,
        backgroundImages: ['https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png', 'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png'],
        logoImages: ['https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png', 'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png'],
        classes: [
            {
                id: 0,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_warrior.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_savageblow.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_innerrage.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_defensivestance.jpg',
                ],
            },
            {
                id: 1,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_paladin.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_holybolt.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_paladin_shieldofthetemplar.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_auraoflight.jpg',
                ],
            },
            {
                id: 2,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_hunter.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_bestialdiscipline.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_focusedaim.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_camouflage.jpg',
                ],
            },
            {
                id: 3,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_rogue.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_deadlybrew.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/inv_sword_30.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_stealth.jpg',
                ],
            },
            {
                id: 4,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_priest.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_powerwordshield.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_guardianspirit.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_shadowwordpain.jpg',
                ],
            },
            {
                id: 5,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_shaman.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_lightning.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_shaman_improvedstormstrike.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_magicimmunity.jpg',
                ],
            },
            {
                id: 6,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_mage.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_magicalsentry.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_fire_firebolt02.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_frost_frostbolt02.jpg',
                ],
            },
            {
                id: 7,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_warlock.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_deathcoil.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_metamorphosis.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_rainoffire.jpg',
                ],
            },
            {
                id: 8,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_monk.jpg",
                subclasses: [
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_brewmaster_spec.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_windwalker_spec.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_mistweaver_spec.jpg",
                ],
            },
            {
                id: 9,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_druid.jpg",
                subclasses: [
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_nature_starfall.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_nature_healingtouch.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/ability_druid_catform.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/ability_racial_bearform.jpg",
                ],
            },
            {
                id: 10,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_demonhunter.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_demonhunter_specdps.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/ability_demonhunter_spectank.jpg',
                ],
            },
            {
                id: 11,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_deathknight.jpg",
                subclasses: [
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_bloodpresence.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_frostpresence.jpg',
                    'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_unholypresence.jpg'
                ],
            },
            {
                id: 12,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker.jpg",
                subclasses: [
                    "https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_augmentation.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_devastation.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_preservation.jpg",
                ],
            },
        ],
    },
    {
        name: 'Guild Wars 2',
        image: `${STATIC_IMAGES_PATH}/gw2.png`,
        backgroundImages: ['https://i.imgur.com/YZMLxmj.png', 'https://i.imgur.com/YZMLxmj.png'],
        logoImages: ['https://i.imgur.com/YZMLxmj.png', 'https://i.imgur.com/YZMLxmj.png'],
        classes: [],
    },
    {
        name: 'New World',
        image: `${STATIC_IMAGES_PATH}/new_world.png`,
        backgroundImages: ['https://wow.zamimg.com/uploads/blog/images/27174.png', 'https://wow.zamimg.com/uploads/blog/images/27174.png'],
        logoImages: ['https://wow.zamimg.com/uploads/blog/images/27174.png', 'https://wow.zamimg.com/uploads/blog/images/27174.png'],
        classes: [],
    },
    {
        name: 'Diablo 4',
        image: `${STATIC_IMAGES_PATH}/diablo4.png`,
        logoImages: [],
        backgroundImages: [],
        classes: [
            {
                id: 0,
                class: 'https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Barbarian-Icon-2-150x150.webp',
                subclasses: ['https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Barbarian-Icon-2-150x150.webp'],
            },
            {
                id: 0,
                class: 'https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Druid-Icon-2-150x150.webp',
                subclasses: ['https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Druid-Icon-2-150x150.webp'],
            },
            {
                id: 0,
                class: 'https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Necromancer-Icon-150x150.webp',
                subclasses: ['https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Necromancer-Icon-150x150.webp'],
            },
            {
                id: 0,
                class: 'https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Rogue-Icon-150x150.webp',
                subclasses: ['https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Rogue-Icon-150x150.webp'],
            },
            {
                id: 0,
                class: 'https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Sorcerer-Icon-150x150.webp',
                subclasses: ['https://diablotavern.com/wp-content/uploads/2023/02/Diablo-4-Sorcerer-Icon-150x150.webp'],
            },
        ],
    },
    {
        name: 'Lost Ark',
        image: `${STATIC_IMAGES_PATH}/lostark.png`,
        backgroundImages: [`${STATIC_IMAGES_PATH}/lostark.png`, `${STATIC_IMAGES_PATH}/lostark.png`],
        logoImages: [`${STATIC_IMAGES_PATH}/lostark.png`, `${STATIC_IMAGES_PATH}/lostark.png`],
        classes: [],
    },
]