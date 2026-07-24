import React from 'react';
import styles from './sidebar-notice.css';

const SidebarNotice = ({message}) => (
    <div className={styles.sidebarNotice}>
        {message}
    </div>
);

export default SidebarNotice;
