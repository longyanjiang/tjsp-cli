#!/usr/bin/env node
const program = require("commander");
const version = require('../package.json').version


program.version(version);

program
    .command("create <name>")
    .description(`
    examples: tjsp create <projectName>
    description: create a new project
        `)
    .action(require('../lib/createProject'));

program
    .command("list")
    .description(`
    description:View template list
        `)
    .action(require('../lib/template'))



program.on('--help', function(){
    console.log('')
    console.log('Other:');
    console.log('  $ tjsp --help');
    console.log('  $ tjsp -h');
    console.log('  $ tjsp -v');
    console.log('  $ tjsp --version');
    console.log('  $ tjsp create <name>');
    console.log('  $ tjsp ls');
    console.log('  $ tjsp list');
  });

program.parse(process.argv);