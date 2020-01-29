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

    copyFile(sourcePodfile, targetPodfile);
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
        // Copy in the extension files
        fs.mkdirSync(`${iosPath}${extName}`);
        extFiles.forEach(function(extFile) {
            const filePath = path.join(
                __dirname,
                '..',
                `${sourceDir}${extFile}`
            );

            copyFile(filePath, `${iosPath}${extName}/${extFile}`);
        });
        // Create new PBXGroup for the extension
        let extGroup = proj.addPbxGroup(extFiles, extName, extName);
        // Add the new PBXGroup to the CustomTemplate group. This makes the
        // files appear in the file explorer in Xcode.
        let groups = proj.hash.project.objects['PBXGroup'];
        Object.keys(groups).forEach(function(key) {
            if (groups[key].name === 'CustomTemplate') {
                proj.addToPbxGroup(extGroup.uuid, key);
            }
        });
        // Add a target for the extension
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
