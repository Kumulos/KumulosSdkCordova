const fs = require('fs');
const xcode = require('xcode');
const path = require('path');

module.exports = function(context) {
    //MODIFY PODFILE

    console.log('--------- modify podfile ---------');

    const sourcePodfile = path.join(__dirname, 'Podfile');

    const targetPodfile = 'platforms/ios/Podfile';

    let rd = fs.createReadStream(sourcePodfile);
    rd.on('error', function(err) {
        console.log(err);
    });

    let wr = fs.createWriteStream(targetPodfile);
    wr.on('error', function(err) {
        console.log(err);
    });
    rd.pipe(wr);

    //ADD EXTENSION

    console.log('--------- add notification extension ---------');

    const cordovaCommon = context.requireCordovaModule('cordova-common');
    const appConfig = new cordovaCommon.ConfigParser('config.xml');
    const appName = appConfig.name();
    const iosPath = 'platforms/ios/';
    const projPath = `${iosPath}${appName}.xcodeproj/project.pbxproj`;
    const extName = 'KumulosNotificationServiceExtension';
    const extFiles = [
        'NotificationService.h',
        'NotificationService.m',
        `${extName}-Info.plist`
    ];
    // The directory where the source extension files are stored
    const sourceDir = `extensions/${extName}/`;

    // Wait a few seconds before parsing the project to let some other
    // asynchronous project file changes complete. Maybe there is a way to get
    // a promise?
    console.log(
        'Waiting a few seconds for other project file changes to finish'
    );
    //setTimeout(function() {
    console.log(`Adding ${extName} notification extension to ${appName}`);
    let proj = xcode.project(projPath);
    proj.parse(function(err) {
        if (err) {
            console.log(`Error parsing iOS project: ${err}`);
        }
        // Copy in the extension files
        console.log('Copying in the extension files to the iOS project');
        fs.mkdirSync(`${iosPath}${extName}`);
        extFiles.forEach(function(extFile) {
            const filePath = path.join(
                __dirname,
                '..',
                `${sourceDir}${extFile}`
            );
            let rd = fs.createReadStream(filePath);
            rd.on('error', function(err) {
                console.log(err);
            });

            let wr = fs.createWriteStream(`${iosPath}${extName}/${extFile}`);
            wr.on('error', function(err) {
                console.log(err);
            });

            rd.pipe(wr);
        });
        // Create new PBXGroup for the extension
        console.log('Creating new PBXGroup for the extension');
        let extGroup = proj.addPbxGroup(extFiles, extName, extName);
        // Add the new PBXGroup to the CustomTemplate group. This makes the
        // files appear in the file explorer in Xcode.
        console.log('Adding new PBXGroup to CustomTemplate PBXGroup');
        let groups = proj.hash.project.objects['PBXGroup'];
        Object.keys(groups).forEach(function(key) {
            if (groups[key].name === 'CustomTemplate') {
                proj.addToPbxGroup(extGroup.uuid, key);
            }
        });
        // Add a target for the extension
        console.log('Adding the new target');
        let target = proj.addTarget(extName, 'app_extension');
        // Add build phases to the new target
        console.log('Adding build phases to the new target');
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
        console.log('Write the changes to the iOS project file');
        fs.writeFileSync(projPath, proj.writeSync());
        console.log(`Added ${extName} notification extension to project`);
    });
    //}, 3000);
};
