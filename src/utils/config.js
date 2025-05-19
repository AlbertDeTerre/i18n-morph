import fs from "fs"
import path from 'path';
import { targetFiles, sourceFile, mistralApiKey } from '../../i18n-morph.config';

export function getConfig() {
    const appDir = findAppRoot();
    const configPath = path.join(appDir, 'i18n-morph.config.js');

    try {
        if (fs.existsSync(configPath)) {
            const userConfig = require(configPath);
            return userConfig;
        } else {
            console.warn(`Can't find any configuration at ${configPath}, will be using the default config.`);
            return getDefaultConfig();
        }
    } catch (error) {
        console.error(`Error while loading configuration, default configuration will be used: ${error.message}.`);
        return getDefaultConfig();
    }
}

export function findAppRoot() {
    let currentDir = process.cwd();

    // If current dir is node_modules => go to root
    if (currentDir.includes('node_modules')) {
        // Go up 2 levels (node_modules/i18n-morph -> project root)
        return path.resolve(currentDir, '..', '..');
    }

    return currentDir;
}

function getDefaultConfig() {
    const defaultConfig = {
        i18nDir: './src/i18n',
        sourceFile: "fr.json",
        targetFiles: [
            { filename: 'nl.json', language: 'nl' },
            { filename: 'en.json', language: 'en' }
        ],
        mistralApiKey: 'YOUR_API_KEY'
    }

    return defaultConfig;
}

export function generateDefaultConfig() {
    const destinationPath = `${findAppRoot()}/i18n-morph.config.js`;
    const configContent = fs.readFileSync(`${process.cwd()}/src/utils/i18n-morph-default.config.js`, "utf-8");

    // Create config file if it doesn't exists
    if (!fs.existsSync(destinationPath)) fs.writeFileSync(destinationPath, configContent);
}

export function validateConfig() {
    if (!getConfig().sourceFile) throw new Error("Property 'sourceFile' is missing in the 'i18n-morph.config.js' file.");
    if (!fs.existsSync(path.join(findAppRoot(), getConfig().sourceFile)))
        throw new Error(`Can't find the source file ${path.join(findAppRoot(), getConfig().sourceFile)} in your project.`);
    if (!getConfig().targetFiles) throw new Error("Property 'targetFiles' is missing in the 'i18n-morph.config.js' file.");
    if (getConfig().targetFiles.length === 0) throw new Error("You must specify at least one target file in the 'targetFiles' array of the 'i18n-morph.config.js' file.");
    for (const file of getConfig().targetFiles) {
        if (!fs.existsSync(path.join(findAppRoot(), file.path))) {
            throw new Error(`Can't file the target file ${path.join(findAppRoot(), file.path)} in your project.`);
        }
        if (!file.lang || file.lang === ""){
            throw new Error(`You must specify a value for the 'lang' property of the target file '${file.path}' in the 'i18n-morph.config.js' file.`);
        }
    }
    if (!getConfig().mistralApiKey) throw new Error(`Property 'mistralApiKey' is missing in the 'i18n-morph.config.js' file.`);
}