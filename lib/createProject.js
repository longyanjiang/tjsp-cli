const inquirer = require('inquirer');
const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const templates = require('../utils/templates');
const {clone} = require('../lib/download')
const chalk = require('chalk');
const open = require('open');
const fs = require('fs');
const path = require('path');

const log = content => console.log(chalk.green(content));
const spawn = async (...arg) => {
    const { spawn } = require('child_process');
    return new Promise(resolve => {
        const proc = spawn(...arg)
        proc.stdout.pipe(process.stdout)
        proc.stderr.pipe(process.stderr)
        proc.on('close', () => {
            resolve()
        })
    })
}
module.exports = () => {
    for (const key in templates) {
        console.log(`      ${key}: ${templates[key].description}`)
    }
}
module.exports = async (name) => {
    const array = [
        {
            type: "input",
            name: "projectName",
            message: `请输入项目名称 默认${name}`,
        },
        {
            type: "input",
            name: "description",
            message: "请输入项目简介",
        },
        {
            type: "input",
            name: "author",
            message: "请输入作者名称",
        },
        {
            type: "list",
            name: "template",
            message: "请选择您要生成的模板",
            choices: ["ts-vue (vue+ts项目模版)", "umi-hooks (react+ts项目模版)"],
        },
    ]
    inquirer.prompt(array)
        .then(answers => {
            const url = templates[answers.template.split(" ")[0]].downloadUrl;
            initTemplateDefault(answers, url, name)
        })
}


/**
 * @desc create project
 * @param {object} customContent 
 * @param {string} gitUrl 
 * @param {string} name 
 */
async function initTemplateDefault(customContent, gitUrl, name) {
    console.log(
        chalk.bold.cyan(`tjsp-cli: will creating a new project starter`)
    );
    customContent.projectName  = customContent.projectName ? customContent.projectName : name
    const {projectName} = customContent;
    try {
        await printInfo(name)
        await checkName(projectName);
        await downloadTemplate(gitUrl, projectName);
        await changeTemplate(customContent)
        log('安装依赖中......')
        await spawn('cnpm', ['install'], { cwd: `./${name}` })
        console.log(chalk.green("template download completed"));
        console.log(chalk.bold.cyan("CosenCli: ") + "a new project starter is created");
        log(chalk.green(`
        👌安装完成:
        To Get Start:
========================================
            cd <${name}>
            npm run serve
========================================
            `))
        open('http://localhost:9527')
        await spawn('npm', ['run', 'serve'], { cwd: `./${name}` })
    } catch (error) {
        console.log(chalk.red(error));
    }
}

/**
 * @desc print welcome info
 * @param {string} name 
 */
async function printInfo(name){
    const data = await figlet('TJSP WELCOME');
    log(data);
    log(`🚀🚀🚀  创建项目  < ${name} >`);
}

/**
 * @desc 检查这个项目名称是否已经存在冲突
 * @param {string} projectName 
 */
async function checkName(projectName) {
    return new Promise((resolve, reject) => {
        fs.readdir(process.cwd(), (err, data) => {
            if (err) {
                reject(err)
            }
            if (data.includes(projectName)) {
                return reject(new Error(`${projectName} already exists!`))
            }
            resolve();
        })
    })

}

/**
 * @desc download template from git
 * @param {string} gitUrl 
 * @param string projectName 
 */
async function downloadTemplate(gitUrl, projectName){
    await clone(gitUrl,projectName)
}

/**
 * @desc Replace template content
 * @param {object} customContent 
 */
async function changeTemplate(customContent){
    const {projectName = '', description = '',author = ''} = customContent;
    return new Promise( (resolve, reject) => {
        fs.readFile(
            path.resolve(process.cwd(), projectName, "package.json"),
            "utf-8",
            (err, data) => {
                if (err) {
                    return reject(err);
                }
                let packageContent = JSON.parse(data);
                packageContent.name = projectName;
                packageContent.author = author;
                packageContent.description = description;
                fs.writeFile(
                    path.resolve(process.cwd(), projectName, "package.json"),
                    JSON.stringify(packageContent, null, 2),
                    "utf-8",
                    (err, data) => {
                        if(err){
                            return reject(err);
                        }
                        resolve(data);
                    }
                )
            }
        )
    })
}