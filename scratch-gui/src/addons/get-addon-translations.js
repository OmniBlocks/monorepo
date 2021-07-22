/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import english from './addons-l10n/en.json';
import entries from './generated/l10n-entries';
import log from '../lib/log';

/**
 * Get addon translations.
 * @param {string} lang The locale code
 * @returns {Promise<object>} Object of translation ID to localized string or English fallback
 */
export default async function getTranslations (lang) {
    const result = {};
    Object.assign(result, english);
    if (entries[lang]) {
        try {
            const translations = await entries[lang]();
            Object.assign(result, translations);
        } catch (e) {
            log.error(e);
        }
    }
    return result;
}
