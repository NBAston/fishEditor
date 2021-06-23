const electronBuilder = require('electron-builder');
const child_process = require('child_process');
const path = require('path');

//获取git提交数作为版本号
// child_process.execSync('rm -rf OutApp');
// const version = child_process.execSync('git rev-list HEAD | wc -l').toString().trim();
const version = "5";
const baseVersion = require('./package.json').version;
const buildVersion = baseVersion + '.' + version;
const semverVersion = baseVersion + '-' + version;
electronBuilder.argv = 'x64';

const targetDist = path.resolve(__dirname, 'OutApp');

const baseOptions = {
    //应用唯一标识
    appId: 'Amos.fish.editor',
    buildVersion: buildVersion,
    compression: "store",
    //更替根目录下package.json中对应信息
    extraMetadata: {
        //应用产品版本号，用于
        productVerion: buildVersion,
        author: {
            name: 'Amos',
            email: 'Amos',
            url: 'Amos',
        },
        version: semverVersion,
    },
    productName: 'FishEditor',
    copyright: 'Copyright (C) 2020. Amos. All Rights Reserved.',
    directories: {
        buildResources: path.resolve(__dirname, '.'),
        output: targetDist,
    },
    nsis: {
        oneClick: false,
        perMachine: true,
        allowElevation: false,
        allowToChangeInstallationDirectory: true,
        installerIcon: path.resolve(__dirname, 'logo.ico'),
        uninstallerIcon: path.resolve(__dirname, 'logo.ico'),
        installerHeaderIcon: path.resolve(__dirname, 'logo.ico'),
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: '捕鱼编辑器',
        artifactName: 'FISH_EDITOR' + buildVersion + '.${ext}',
        uninstallDisplayName: '捕鱼编辑器',
        // include: path.resolve(__dirname, 'install.nsh'),
    },
    win: {
        icon: path.resolve(__dirname, 'logo.ico'),
        target: {
            target: 'nsis',
            arch: 'x64',
        },
        //需要打包的文件列表
        files: ['!build.js'],
        extraResources: [path.resolve(__dirname, 'logo.ico')],
        publish: {
            provider: 'generic',
            channel: 'winLatest_' + buildVersion,
            url: 'Amos',
        },
        //复制文件
        extraFiles: [
            {
                from: path.resolve(__dirname, 'logo.ico'),
                to: 'logo.ico',
            },
        ],
    },
};

electronBuilder.createTargets(['--win'], null, 'x64');
process.env.BUILD_NUMBER = version;
electronBuilder.build({
    config: baseOptions,
});