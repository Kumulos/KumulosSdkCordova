const fs = require('fs');
const xcode = require('xcode');
const path = require('path');

module.exports = function(context) {
    const cordovaCommon = context.requireCordovaModule('cordova-common');
    const appConfig = new cordovaCommon.ConfigParser('config.xml');
    const appName = appConfig.name();

    overwritePodfile(appName);

    addNotificationExtension(appName);
};

function overwritePodfile(appName) {
    const sourcePodfile = path.join(__dirname, 'Podfile');
    const targetPodfile = 'platforms/ios/Podfile';

    const podfileTemplate = fs.readFileSync(sourcePodfile, {
        encoding: 'utf-8'
    });
    const podfileStr = podfileTemplate.split('{{APP_NAME}}').join(appName);

    //this should be async
    fs.writeFile(targetPodfile, podfileStr, err => {
        if (err) {
            console.log(err);
        }
    });
}

function addNotificationExtension(appName) {
    const iosPath = 'platforms/ios/';
    const projPath = `${iosPath}${appName}.xcodeproj/project.pbxproj`;
    const extName = 'KumulosNotificationServiceExtension';
    const extFiles = [
        'NotificationService.h',
        'NotificationService.m',
        `${extName}-Info.plist`
    ];
    const sourceDir = `extensions/${extName}/`;

    console.log(`Adding ${extName} notification extension to ${appName}`);
    let proj = xcode.project(projPath);
    proj.parse(function(err) {
        if (err) {
            console.log(`Error parsing iOS project: ${err}`);
        }

        fs.mkdirSync(`${iosPath}${extName}`);
        extFiles.forEach(function(extFile) {
            const filePath = path.join(
                __dirname,
                '..',
                `${sourceDir}${extFile}`
            );

            copyFile(filePath, `${iosPath}${extName}/${extFile}`);
        });

        let extGroup = proj.addPbxGroup(extFiles, extName, extName);
        let groups = proj.hash.project.objects['PBXGroup'];
        Object.keys(groups).forEach(function(key) {
            if (groups[key].name === 'CustomTemplate') {
                proj.addToPbxGroup(extGroup.uuid, key);
            }
        });

        let target = proj.addTarget(extName, 'app_extension');

        proj.addBuildPhase(
            ['NotificationService.m'],
            'PBXSourcesBuildPhase',
            'Sources',
            target.uuid
        );
        proj.addBuildPhase(
            [],
            'PBXResourcesBuildPhase',
            'Resources',
            target.uuid
        );
        proj.addBuildPhase(
            [],
            'PBXFrameworksBuildPhase',
            'Frameworks',
            target.uuid
        );

        // var config = proj.hash.project.objects['XCBuildConfiguration'];
        // var buildSettingsForApp = null;
        // for (var ref in config) {
        //     if (
        //         config[ref].buildSettings !== undefined &&
        //         config[ref].buildSettings.PRODUCT_NAME !== undefined
        //     ) {
        //         console.log(config[ref].buildSettings.PRODUCT_NAME);
        //         if (config[ref].buildSettings.PRODUCT_NAME.includes(appName)) {
        //             buildSettingsForApp =
        //                 proj.hash.project.objects['XCBuildConfiguration'][ref]
        //                     .buildSettings;
        //         }
        //     }
        // }
        // if (buildSettingsForApp == null) {
        //     console.log('proval');
        // } else {
        //     console.log(buildSettingsForApp);
        // }
        // for (var ref in config) {
        //     if (
        //         config[ref].buildSettings !== undefined &&
        //         config[ref].buildSettings.PRODUCT_NAME !== undefined &&
        //         config[ref].buildSettings.PRODUCT_NAME.includes(extName)
        //     ) {
        //         // setup bundle id and team correctly
        //         proj.hash.project.objects['XCBuildConfiguration'][
        //             ref
        //         ].buildSettings['DEVELOPMENT_TEAM'] = 'AY85FBK9Q6';
        //         //buildSettingsForApp['DEVELOPMENT_TEAM']; //'AY85FBK9Q6'; //TODO: take value
        //         proj.hash.project.objects['XCBuildConfiguration'][
        //             ref
        //         ].buildSettings['PRODUCT_BUNDLE_IDENTIFIER'] =
        //             'com.kumulos.dev.inappmessaging.KumulosNotificationServiceExtension';
        //         // buildSettingsForApp['PRODUCT_BUNDLE_IDENTIFIER'] +
        //         // '.KumulosNotificationServiceExtension';
        //     }
        // }

        fs.writeFileSync(projPath, proj.writeSync());
        console.log(`Added ${extName} notification extension to project`);
    });
}

function copyFile(src, dest) {
    let rd = fs.createReadStream(src);
    rd.on('error', function(err) {
        console.log(err);
    });

    let wr = fs.createWriteStream(dest);
    wr.on('error', function(err) {
        console.log(err);
    });
    rd.pipe(wr);
}
