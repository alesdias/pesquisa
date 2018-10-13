

document.addEventListener('deviceready', onDeviceReady, false);  
function onDeviceReady() {  

    function onInitFs(fs) {  
        console.log('Opened file system: ' + fs.name);
    }

    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;  
    window.requestFileSystem(window.PERSISTENT, 50*1024*1024 /*50MB*/, onInitFs, errorHandler);

    window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function (grantedBytes) {  
        window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, errorHandler);
    }, function (e) {
        console.log('Error', e);
    });

    var errorHandler = function (fileName, e) {  
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'Storage quota exceeded';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'File not found';
                break;
            case FileError.SECURITY_ERR:
                msg = 'Security error';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'Invalid modification';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'Invalid state';
                break;
            default:
                msg = 'Unknown error';
                break;
        };

        console.log('Error (' + fileName + '): ' + msg);
    }

    function readFromFile(fileName, cb) {
        var pathToFile = cordova.file.dataDirectory + fileName;
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    cb(JSON.parse(this.result));
                };

                reader.readAsText(file);
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }

    function writeToFile(fileName, data) {
        data = JSON.stringify(data, null, '\t');
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        log('Write of file "' + fileName + '"" completed.');
                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        log('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(blob);
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }

    //GRAVAR ARQUIVO
    writeToFile('example.json', { foo: 'bar' });
    console.log('iniciado cordova-plugin-file');

}

/*

    //LEER ARQUIVO
    var fileData;
    readFromFile('data.json', function (data) {
        fileData = data;
    });

    //GRAVAR ARQUIVO
    writeToFile('example.json', { foo: 'bar' });
*/





