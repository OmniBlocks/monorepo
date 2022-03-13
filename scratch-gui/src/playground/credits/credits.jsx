import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import appTarget from '../app-target';
import styles from './credits.css';
import {getInitialDarkMode} from '../../lib/tw-theme-hoc.jsx';

import fosshostLogo from './fosshost-light.png';
import UserData from './users';

/* eslint-disable react/jsx-no-literals */

const User = ({image, text, href}) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={styles.user}
    >
        <img
            className={styles.userImage}
            src={image}
            width="60"
            height="60"
        />
        <div className={styles.userInfo}>
            {text}
        </div>
    </a>
);
User.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    href: PropTypes.string
};

const UserList = ({users}) => (
    <div className={styles.users}>
        {users.map((data, index) => (
            <User
                key={index}
                {...data}
            />
        ))}
    </div>
);
UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object)
};

const Credits = () => (
    <main className={styles.main}>
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                {'TurboWarp Credits'}
            </h1>
        </header>
        <section>
            <p>
                Thank you to everyone that makes this project possible.
            </p>
        </section>
        <section>
            <h2>{'Fosshost'}</h2>
            <p>
                <a href="https://fosshost.org/">Fosshost</a> provides free high quality hosting services to open source projects including TurboWarp.
                {' '}Fosshost <a href="https://fosshost.org/donate">accepts donations</a> to support their work.
            </p>
            <a href="https://fosshost.org/">
                <img
                    src={fosshostLogo}
                    width="250"
                    height="125"
                />
            </a>
        </section>
        <section>
            <h2>{'Scratch'}</h2>
            <p>TurboWarp is based on the work of the <a href="https://scratch.mit.edu/credits">Scratch contributors</a> but is not endorsed by Scratch in any way. Scratch <a href="https://scratch.mit.edu/donate">accepts donations</a> to support their work.</p>
        </section>
        <section>
            <h2>{'Addons'}</h2>
            <UserList users={UserData.addonDevelopers} />
        </section>
        <section>
            <p>Individual contributors are listed in no particular order.</p>
        </section>
    </main>
);

document.body.setAttribute('theme', getInitialDarkMode() ? 'dark' : 'light');

ReactDOM.render((
    <Credits />
), appTarget);
