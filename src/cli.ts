#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import ora from 'ora';

// function to create delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getChalk() {
    const chalk = await import('chalk');
    return chalk.default;
}

const program = new Command();

program
    .command('init')
    .description('Initialize qareeb-translator')
    .action(async () => {

        const chalk = await getChalk();

        console.log(chalk.blue('Initializing translation setup...'));
        const translationFolderPath = path.resolve(process.cwd(), 'translations');

      

        const spinner = ora();

        const delayTime = 1000;

        const currentDir = process.cwd();
        const packageJsonPath = path.resolve(process.cwd(), 'package.json');

        // check if package.json exists
        spinner.start('Checking for package.json...');
        await delay(delayTime);
        const packJson = path.resolve(currentDir, 'package.json');
        if (!fs.existsSync(packJson)) {
            spinner.fail('package.json not found');
            console.log(chalk.red("error : make sure you are in the right root"));
            process.exit(1);
        }else {
            spinner.succeed('found package.json');
        }

        // check if react is installed
        spinner.start('checking if react is installed...');
        await delay(delayTime);
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (!packageJson.dependencies || !packageJson.dependencies.react) {
            spinner.fail('react is not installed');
            console.error(chalk.red('error: please install react  before trying again'));
            process.exit(1);
        }else {
            spinner.succeed('react is installed');
        }

        // check if the src folder exists
        spinner.start('checking if src folder exists...');
        await delay(delayTime);
        const srcPath = path.resolve(currentDir, 'src');
        if (!fs.existsSync(srcPath)) {
            spinner.fail('src folder not found');
            console.error(chalk.red('error: src folder not found'));
            process.exit(1);
        } else {
            await delay(delayTime);
            spinner.succeed('found src folder');
        }

        // ask the user whether to use ts or js and ask for the primary language
        const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'primaryLanguage',
              message: 'what is your primary language?',
              default: 'en', // default to english
            },
            {
              type: 'list',
              name: 'fileType',
              message: 'which file type do you want to use for the config?',
              choices: ['.ts', '.js'],
            },
        ]);

        // create the config file
        const configFileName = `config${answers.fileType}`;
        fs.writeFileSync(configFileName, `export const config = { primaryLanguage: '${answers.primaryLanguage}' };`);
        console.log(chalk.green(`config file created: ${configFileName}`));

        // add the run script to package.json
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts['start'] = 'qareeb-translator run --port 3662';
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(chalk.green(`script added to package.json`));

        // create the translations folder
        if (!fs.existsSync(translationFolderPath)) {
            fs.mkdirSync(translationFolderPath);
                await delay(delayTime);
                console.log(chalk.green(`created translations folder at: ${translationFolderPath}`));
        } else {
            await delay(delayTime);
            console.log(chalk.yellow('translations folder already exists'));
        }
  
        console.log(chalk.green('translation setup complete.'));
})   
program.parse(process.argv);