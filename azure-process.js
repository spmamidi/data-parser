const azureStorage = require('azure-storage');
let fileService = azureStorage.createFileService('', '<key>');
let chunks = [];

//https://social.msdn.microsoft.com/Forums/azure/en-US/da80bd84-6a6d-4d48-bf4f-3c4952f543f1/nodejs-reading-an-azure-storage-file-into-a-node-buffer?forum=windowsazuredata
let fileStream = fileService.createReadStream('taskshare','taskdirectory','<file>',(err,result,res)=>{
    console.log(err)
    console.log(result)
    console.log(res)
    console.log(chunks.toString())
});
fileStream.on('data',(chunk)=>{
    chunks.push(chunk)
    console.log('get data: '+ chunk)
})

fileStream.on('end',()=>{
    console.log('stream finish')
})

fileStream.on('error',(error)=>{
    console.log(error)
});

fileService.createReadStream(shareName, directoryName, fileName).pipe(writable);