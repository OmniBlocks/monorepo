import React from 'react';
import {FormattedMessage} from 'react-intl';
import styles from './removed-trademarks.css';

const RemovedTrademarks = () => (
    <div className={styles.removedTrademarks}>
        <FormattedMessage
            // eslint-disable-next-line max-len
            defaultMessage="Some items that contained trademarks have been removed."
            description="Appears in the costume and sprite libraries."
            id="tw.removedTrademarks"
        />
    </div>
);

export default RemovedTrademarks;
