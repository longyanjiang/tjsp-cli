const {promisify} = require('util');
const ora = require('ora');
const download = promisify(require('download-git-repo'));

module.exports.clone = async function(url,projectName){
    const process = ora(`🚀🚀  模板正在下载中......`)
    process.start()
    await download(url,projectName)
    process.succeed()
}