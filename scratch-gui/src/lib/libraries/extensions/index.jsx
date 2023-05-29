import React from 'react';
import {FormattedMessage} from 'react-intl';

import musicIconURL from './music/music.png';
import musicInsetIconURL from './music/music-small.svg';

import penIconURL from './pen/pen.png';
import penInsetIconURL from './pen/pen-small.svg';

import videoSensingIconURL from './videoSensing/video-sensing.png';
import videoSensingInsetIconURL from './videoSensing/video-sensing-small.svg';

import text2speechIconURL from './text2speech/text2speech.png';
import text2speechInsetIconURL from './text2speech/text2speech-small.svg';

import translateIconURL from './translate/translate.png';
import translateInsetIconURL from './translate/translate-small.png';

import makeymakeyIconURL from './makeymakey/makeymakey.png';
import makeymakeyInsetIconURL from './makeymakey/makeymakey-small.svg';

import microbitIconURL from './microbit/microbit.png';
import microbitInsetIconURL from './microbit/microbit-small.svg';
import microbitConnectionIconURL from './microbit/microbit-illustration.svg';
import microbitConnectionSmallIconURL from './microbit/microbit-small.svg';

import ev3IconURL from './ev3/ev3.png';
import ev3InsetIconURL from './ev3/ev3-small.svg';
import ev3ConnectionIconURL from './ev3/ev3-hub-illustration.svg';
import ev3ConnectionSmallIconURL from './ev3/ev3-small.svg';

import wedo2IconURL from './wedo2/wedo.png'; // TODO: Rename file names to match variable/prop names?
import wedo2InsetIconURL from './wedo2/wedo-small.svg';
import wedo2ConnectionIconURL from './wedo2/wedo-illustration.svg';
import wedo2ConnectionSmallIconURL from './wedo2/wedo-small.svg';
import wedo2ConnectionTipIconURL from './wedo2/wedo-button-illustration.svg';

import boostIconURL from './boost/boost.png';
import boostInsetIconURL from './boost/boost-small.svg';
import boostConnectionIconURL from './boost/boost-illustration.svg';
import boostConnectionSmallIconURL from './boost/boost-small.svg';
import boostConnectionTipIconURL from './boost/boost-button-illustration.svg';

import gdxforIconURL from './gdxfor/gdxfor.png';
import gdxforInsetIconURL from './gdxfor/gdxfor-small.svg';
import gdxforConnectionIconURL from './gdxfor/gdxfor-illustration.svg';
import gdxforConnectionSmallIconURL from './gdxfor/gdxfor-small.svg';

import twIcon from './tw/tw.svg';

import customExtensionIcon from './custom/custom.svg';

import galleryIcon from './gallery/gallery.svg';
import unknownIcon from './gallery/unknown.svg';
import animatedTextIcon from './gallery/animated-text.svg';
import stretchIcon from './gallery/stretch.svg';
import gamepadIcon from './gallery/gamepad.svg';
import cursorIcon from './gallery/cursor.svg';
import fileIcon from './gallery/file.svg';
import pointerlockIcon from './gallery/pointerlock.svg';
import runtimeOptionsIcon from './gallery/runtime-options.svg';
import utilitiesIcon from './gallery/utilities.svg';
import sensingPlusIcon from './gallery/sensingplus.svg';
import clonesPlusIcon from './gallery/clonesplus.svg';
import clippingBlendingIcon from './gallery/clippingblending.svg';
import regexIcon from './gallery/regex.svg';
import bitwiseIcon from './gallery/bitwise.svg';
import textIcon from './gallery/text.svg';
import fetchIcon from './gallery/fetch.svg';
import box2dIcon from './gallery/box2d.svg';

const galleryItem = object => ({
    ...object,
    tags: ['tw'],
    incompatibleWithScratch: true,
    featured: true
});

export default [
    {
        name: (
            <FormattedMessage
                defaultMessage="Music"
                description="Name for the 'Music' extension"
                id="gui.extension.music.name"
            />
        ),
        extensionId: 'music',
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Play instruments and drums."
                description="Description for the 'Music' extension"
                id="gui.extension.music.description"
            />
        ),
        tags: ['scratch'],
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Pen"
                description="Name for the 'Pen' extension"
                id="gui.extension.pen.name"
            />
        ),
        extensionId: 'pen',
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Draw with your sprites."
                description="Description for the 'Pen' extension"
                id="gui.extension.pen.description"
            />
        ),
        tags: ['scratch'],
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Video Sensing"
                description="Name for the 'Video Sensing' extension"
                id="gui.extension.videosensing.name"
            />
        ),
        extensionId: 'videoSensing',
        iconURL: videoSensingIconURL,
        insetIconURL: videoSensingInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Sense motion with the camera."
                description="Description for the 'Video Sensing' extension"
                id="gui.extension.videosensing.description"
            />
        ),
        tags: ['scratch'],
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Text to Speech"
                description="Name for the Text to Speech extension"
                id="gui.extension.text2speech.name"
            />
        ),
        extensionId: 'text2speech',
        collaborator: 'Amazon Web Services',
        iconURL: text2speechIconURL,
        insetIconURL: text2speechInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make your projects talk."
                description="Description for the Text to speech extension"
                id="gui.extension.text2speech.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="Translate"
                description="Name for the Translate extension"
                id="gui.extension.translate.name"
            />
        ),
        extensionId: 'translate',
        collaborator: 'Google',
        iconURL: translateIconURL,
        insetIconURL: translateInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Translate text into many languages."
                description="Description for the Translate extension"
                id="gui.extension.translate.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        internetConnectionRequired: true
    },
    {
        name: 'Makey Makey',
        extensionId: 'makeymakey',
        collaborator: 'JoyLabz',
        iconURL: makeymakeyIconURL,
        insetIconURL: makeymakeyInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Make anything into a key."
                description="Description for the 'Makey Makey' extension"
                id="gui.extension.makeymakey.description"
            />
        ),
        tags: ['scratch'],
        featured: true
    },
    {
        name: 'micro:bit',
        extensionId: 'microbit',
        collaborator: 'micro:bit',
        iconURL: microbitIconURL,
        insetIconURL: microbitInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Connect your projects with the world."
                description="Description for the 'micro:bit' extension"
                id="gui.extension.microbit.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: microbitConnectionIconURL,
        connectionSmallIconURL: microbitConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their micro:bit."
                id="gui.extension.microbit.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/microbit'
    },
    {
        name: 'LEGO MINDSTORMS EV3',
        extensionId: 'ev3',
        collaborator: 'LEGO',
        iconURL: ev3IconURL,
        insetIconURL: ev3InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build interactive robots and more."
                description="Description for the 'LEGO MINDSTORMS EV3' extension"
                id="gui.extension.ev3.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: ev3ConnectionIconURL,
        connectionSmallIconURL: ev3ConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting. Make sure the pin on your EV3 is set to 1234."
                description="Message to help people connect to their EV3. Must note the PIN should be 1234."
                id="gui.extension.ev3.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/ev3'
    },
    {
        name: 'LEGO BOOST',
        extensionId: 'boost',
        collaborator: 'LEGO',
        iconURL: boostIconURL,
        insetIconURL: boostInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Bring robotic creations to life."
                description="Description for the 'LEGO BOOST' extension"
                id="gui.extension.boost.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: boostConnectionIconURL,
        connectionSmallIconURL: boostConnectionSmallIconURL,
        connectionTipIconURL: boostConnectionTipIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their BOOST."
                id="gui.extension.boost.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/boost'
    },
    {
        name: 'LEGO Education WeDo 2.0',
        extensionId: 'wedo2',
        collaborator: 'LEGO',
        iconURL: wedo2IconURL,
        insetIconURL: wedo2InsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build with motors and sensors."
                description="Description for the 'LEGO WeDo 2.0' extension"
                id="gui.extension.wedo2.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: wedo2ConnectionIconURL,
        connectionSmallIconURL: wedo2ConnectionSmallIconURL,
        connectionTipIconURL: wedo2ConnectionTipIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their WeDo."
                id="gui.extension.wedo2.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/wedo'
    },
    {
        name: 'Go Direct Force & Acceleration',
        extensionId: 'gdxfor',
        collaborator: 'Vernier',
        iconURL: gdxforIconURL,
        insetIconURL: gdxforInsetIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Sense push, pull, motion, and spin."
                description="Description for the Vernier Go Direct Force and Acceleration sensor extension"
                id="gui.extension.gdxfor.description"
            />
        ),
        tags: ['scratch'],
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: gdxforConnectionIconURL,
        connectionSmallIconURL: gdxforConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their force and acceleration sensor."
                id="gui.extension.gdxfor.connectingMessage"
            />
        ),
        helpLink: 'https://scratch.mit.edu/vernier'
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="TurboWarp Extension Gallery"
                description="Name of extensions.turbowarp.org in extension library"
                id="tw.extensionGallery.name"
            />
        ),
        href: 'https://extensions.turbowarp.org/',
        extensionId: '',
        iconURL: galleryIcon,
        description: (
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="We list many extensions here for convenience. You can find even more on extensions.turbowarp.org."
                description="Description of extensions.turbowarp.org in extension library"
                id="tw.extensionGallery.description"
            />
        ),
        tags: ['tw'],
        incompatibleWithScratch: true,
        featured: true
    },
    {
        name: (
            <FormattedMessage
                defaultMessage="TurboWarp Blocks"
                description="Name of TW extension"
                id="tw.twExtension.name"
            />
        ),
        extensionId: 'tw',
        iconURL: twIcon,
        description: (
            <FormattedMessage
                defaultMessage="Weird new blocks."
                description="Description of TW extension"
                id="tw.twExtension.description"
            />
        ),
        incompatibleWithScratch: true,
        tags: ['tw'],
        featured: true
    },
    // Extensions loaded from URLs do not support localization, so unfortunately we will just leave English names here.
    galleryItem({
        name: 'Animated Text',
        // eslint-disable-next-line max-len
        description: 'An easy way to display and animate text. Compatible with Scratch Lab\'s Animated Text experiment.',
        extensionId: 'text',
        extensionURL: 'https://extensions.turbowarp.org/lab/text.js',
        iconURL: animatedTextIcon
    }),
    galleryItem({
        name: 'Stretch',
        description: 'Stretch sprites horizontally or vertically.',
        extensionId: 'stretch',
        extensionURL: 'https://extensions.turbowarp.org/stretch.js',
        iconURL: stretchIcon
    }),
    galleryItem({
        name: 'Gamepad',
        description: 'Directly access gamepads instead of just mapping buttons to keys.',
        extensionId: 'Gamepad',
        extensionURL: 'https://extensions.turbowarp.org/gamepad.js',
        iconURL: gamepadIcon
    }),
    galleryItem({
        name: 'Files',
        description: 'Read and download files.',
        extensionId: 'files',
        extensionURL: 'https://extensions.turbowarp.org/files.js',
        iconURL: fileIcon
    }),
    galleryItem({
        name: 'Pointerlock',
        // eslint-disable-next-line max-len
        description: 'Adds blocks for mouse locking. Mouse x & y blocks will report the change since the previous frame while the pointer is locked.',
        extensionId: 'pointerlock',
        extensionURL: 'https://extensions.turbowarp.org/pointerlock.js',
        iconURL: pointerlockIcon
    }),
    galleryItem({
        name: 'Mouse Cursor',
        description: 'Use custom cursors or hide the cursor. Also allows replacing the cursor with any costume image.',
        extensionId: 'MouseCursor',
        extensionURL: 'https://extensions.turbowarp.org/cursor.js',
        iconURL: cursorIcon
    }),
    galleryItem({
        name: 'Runtime Options',
        description: 'Get and modify turbo mode, framerate, interpolation, clone limit, stage size, and more.',
        extensionId: 'runtimeoptions',
        extensionURL: 'https://extensions.turbowarp.org/runtime-options.js',
        iconURL: runtimeOptionsIcon
    }),
    galleryItem({
        name: 'Clones Plus',
        description: 'Expansion of Scratch\'s clone features. Created by LukeManiaStudios.',
        extensionId: 'lmsclonesplus',
        extensionURL: 'https://extensions.turbowarp.org/LukeManiaStudios/ClonesPlus.js',
        iconURL: clonesPlusIcon
    }),
    galleryItem({
        name: 'Clipping & Blending',
        description: 'Clipping outside of a specified rectangular area and additive color blending. Created by Vadik1.',
        extensionId: 'xeltallivclipblend',
        extensionURL: 'https://extensions.turbowarp.org/Xeltalliv/clippingblending.js',
        iconURL: clippingBlendingIcon
    }),
    galleryItem({
        name: 'Text',
        description: 'Manipulate characters and text. Originally created by CST1229.',
        extensionId: 'strings',
        extensionURL: 'https://extensions.turbowarp.org/text.js',
        iconURL: textIcon
    }),
    galleryItem({
        name: 'Bitwise',
        description: 'Blocks that operate on the binary representation of numbers in computers.',
        extensionId: 'Bitwise',
        extensionURL: 'https://extensions.turbowarp.org/bitwise.js',
        iconURL: bitwiseIcon
    }),
    galleryItem({
        name: 'RegExp',
        description: 'Full interface for working with Regular Expressions. Created by TrueFantom.',
        extensionId: 'truefantomregexp',
        extensionURL: 'https://extensions.turbowarp.org/true-fantom/regexp.js',
        iconURL: regexIcon
    }),
    galleryItem({
        name: 'Box2D Physics',
        description: 'Two dimensional physics. Originally created by griffpatch.',
        extensionId: 'griffpatch',
        extensionURL: 'https://extensions.turbowarp.org/box2d.js',
        iconURL: box2dIcon
    }),
    galleryItem({
        name: 'Fetch',
        description: 'Make requests to the broader internet.',
        extensionId: 'fetch',
        extensionURL: 'https://extensions.turbowarp.org/fetch.js',
        iconURL: fetchIcon
    }),
    galleryItem({
        name: 'Local Storage',
        description: 'Store data persistently.',
        extensionId: 'localstorage',
        extensionURL: 'https://extensions.turbowarp.org/local-storage.js',
        iconURL: unknownIcon
    }),
    galleryItem({
        name: 'Utilities',
        description: 'A bunch of interesting blocks. Originally created by Sheep_maker.',
        extensionId: 'utilities',
        extensionURL: 'https://extensions.turbowarp.org/utilities.js',
        iconURL: utilitiesIcon
    }),
    {
        name: (
            <FormattedMessage
                defaultMessage="Custom Extension"
                description="Name of library item to load a custom extension from a remote source"
                id="tw.customExtension.name"
            />
        ),
        extensionId: '',
        iconURL: customExtensionIcon,
        description: (
            <FormattedMessage
                defaultMessage="Load custom extensions from URLs, files, or JavaScript source code."
                description="Description of library item to load a custom extension from a custom source"
                id="tw.customExtension.description"
            />
        ),
        tags: ['tw'],
        incompatibleWithScratch: true,
        featured: true
    }
];
