// OmniBlocks Versioning System (OVS)
// Implemented as according to https://github.com/OmniBlocks/monorepo/issues/864 , OmniBlocks RFC 1

import {execSync} from 'child_process';

export function getOVSVersion(version) {   
    // Let's start by getting a date, something most of us reading this aren't familiar with
    const date = new Date();
    // It must be UTC
    const shortMonth = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    let year = date.getUTCFullYear();
    let day = date.getUTCDate();
     if (year >= 2000 && year <= 2099) {
        // Truncate the year to the last two digits
        // as the RFC says in DDMonthYY(YY) format
         year = year.toString().slice(-2);
     }
    // Make sure the day is two digits as well
    day = day < 10 ? `0${day}` : day;
    
   
    const finalDate = `${day}${shortMonth}${year}`;

    // Now for the timestamp, which is in HHMM format 
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let timestamp = `${finalDate}-${hours}${minutes}`;

    /* Now we need to read the env var "DATE_OVERRIDE" to see if we need to override the date
    once again as per the RFC, since folks that want to override the date to hash the program
    and prove that the things we distribute are the same as the code and we aren't some big
    corpo that injects garbage into the codebase like certain other companies that I will not name */

    const dateOverride = process.env.DATE_OVERRIDE;
    // PLEASE just input the date as a string because I don't want to parse more dates
    if (dateOverride) {
        timestamp = dateOverride;
    }

    // That was only the easy part, now we need to get the git commit hash
    const gitBranch = execSync('git branch --show-current').toString().trim();
    let gitCommitShortHash = execSync('git rev-parse --short HEAD').toString().trim();
    let displayVersion = version || '0.6.0a';
    if (displayVersion.includes('alpha') || displayVersion.includes('beta')) {
        // if it's alpha or beta, shorten it to just a or b so it's e.g. 0.6.0a
        displayVersion = displayVersion.replace('-alpha', 'a').replace('-beta', 'b');
    }
    const target = process.env.TARGET || 'browser';
    const dev = process.env.NODE_ENV !== 'production';
    // If it's a dev build we slime out the commit sha because we can't be sure if its dirty or not
    // (Now that I think about it we could check but the RFC is done and I'm tired)
    if (dev) {
        gitCommitShortHash = 'dev';
    }

    // Finally the Full Version string!

    const fullVersion = `${displayVersion}+${gitCommitShortHash}+${timestamp}+${gitBranch}+${target}`;

    return fullVersion;

}
