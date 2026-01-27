/* eslint-env node */
/* eslint-disable no-console */

(async () => {
    const fs = require('node:fs');
    const os = require('node:os');

    const Server = require('./server');
    const setupFileSecurity = require('./setup-file-security');

    const {resolvePath} = require('./resolve-path');

    const {default: yargs} = await import('yargs');
    const {hideBin} = await import('yargs/helpers');

    const permissions = {
        fileReadAccess: false,
        fileWriteAccess: false,
        fileScope: [os.homedir()],
        networkAccess: false
    };

    yargs(hideBin(process.argv))
        .command(
            'serve [file] [port]',
            'Runs the project in server mode',
            yarg => (
                yarg
                    .positional('file', {
                        type: 'string',
                        describe: 'The file to run'
                    })
                    .positional('port', {
                        type: 'number',
                        describe: 'The port to bind on',
                        default: 8080
                    })
                    .option('dev', {
                        alias: 'D',
                        type: 'boolean',
                        description: 'Runs with the ability to hot-swap projects'
                    })
                    .option('allow-file-read', {
                        alias: 'D',
                        type: 'boolean',
                        description: 'Allows the project to read any file in your home folder'
                    })
                    .option('allow-file-write', {
                        alias: 'D',
                        type: 'boolean',
                        description: 'Allows the project to write to any file in your home folder'
                    })
                    .option('allow-network-access', {
                        alias: 'D',
                        type: 'boolean',
                        description: 'Allows the project to access anything on the network'
                    })
                    .option('file-scope', {
                        type: 'array',
                        description: 'Allows the project to read from the specified folders only'
                    })
            ), argv => {
                if (!argv.file) {
                    console.log('No project inputted.');
                    process.exitCode = 1;
                    return;
                }

                if (argv.allowFileRead) permissions.fileReadAccess = true;
                if (argv.allowFileWrite) permissions.fileWriteAccess = true;
                if (argv.networkAccess) permissions.networkAccess = true;
                if (argv.allowNonHomeRead) permissions.nonHomeReadAccess = true;
                if (argv.allowNonHomeWrite) permissions.nonHomeWriteAccess = true;

                if (argv.fileScope) {
                    permissions.fileScope = argv.fileScope.map(location => resolvePath(location));
                }

                const server = new Server(!!argv.dev, argv.port);
                setupFileSecurity(server.securityManager, permissions);

                server.runProject(
                    fs.readFileSync(resolvePath(argv.file))
                ).catch(() => {
                    console.log('Failed to load the project. :(');
                    server.halt();
                    process.exitCode = 2;
                    return;
                });
            })
        .demandCommand()
        .parse();
})();
