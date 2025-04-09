#!/usr/bin/env node
const { getConfig, findAppRoot, validateConfig } = require('./utils/config');
const Mistral = require("@mistralai/mistralai").Mistral
const fs = require('fs')
const path = require('path')

// Create Mistral object
const mistral = new Mistral({
    apiKey: getConfig().mistralApiKey
});


const targetFiles = getConfig().targetFiles;
const sourceFile = path.join(findAppRoot(), getConfig().sourceFile);
const sourceObject = JSON.parse(fs.readFileSync(sourceFile, "utf-8"));

validateConfig();

// Run the program
run();

async function run() {
    for (const targetFile of targetFiles) {
        const targetFilePath = targetFile.path;

        if (!fs.existsSync(targetFilePath)) {
            fs.writeFileSync(targetFilePath, "{}");
        }

        let targetObject
        try {
            targetObject = JSON.parse(fs.readFileSync(targetFilePath, "utf-8"));
        } catch (e) {
            fs.writeFileSync(targetFilePath, "{}");
            targetObject = {}
        }

        // Find missing keys
        const jsonToTranslate = findMissingKeys(sourceObject, targetObject);
        if (Object.keys(jsonToTranslate).length === 0) {
            console.log(`No missing keys found in '${path.basename(targetFile.path)}'. This file won't be translated.`);
            continue;
        };
        console.log(`Translating '${path.basename(targetFile.path)}' in '${targetFile.lang}'...`);

        // Translate missing keys
        let translatedJSON = await translate(jsonToTranslate, targetFile.lang);
        translatedJSON = translatedJSON.replace("json```", "").replace("```", "");

        // Merge objects
        const result = mergeMissingKeys(JSON.parse(translatedJSON), targetObject);
        fs.writeFileSync(targetFilePath, JSON.stringify(result))
        console.log(`File '${path.basename(targetFile.path)}' has been translated successfully in '${targetFile.lang}' !`);
        await sleep(2000);
    }
}

/**
 * Translate a json structure to a specified language.
 * @param {object} jsonToTranslate json object to translate
 * @param {string} targetLanguage language of translation
 * @returns 
 */
async function translate(jsonToTranslate, targetLanguage) {

    const prompt = `
    Translate the following JSON object from its original language to ${targetLanguage}.\n
    Answer only with the object. Don't wrap it into markdown.
    Keep the keys unchanged and return a valid JSON object:\n\n${JSON.stringify(jsonToTranslate, null, 2)}
    `;

    const result = await mistral.chat.complete({
        model: "mistral-small-latest",
        messages: [
            {
                content: prompt,
                role: "user",
            },
            {
                content: "You are a professional translator for a logistic company",
                role: 'system'
            }
        ],
        apiKey: getConfig().mistralApiKey
    });

    return result.choices[0].message.content;
}

/**
 * Find the keys of the file1 that are missing in the file2
 * @param {object} file1 
 * @param {object} file2 
 * @returns {Array} missing keys
 */
function findMissingKeys(file1, file2) {

    const missingKeys = {};

    for (const key in file1) {
        if (key in file2) {
            if (typeof file1[key] === 'object') {
                const findedKeys = findMissingKeys(file1[key], file2[key]);
                if (Object.keys(findedKeys).length > 0) {
                    missingKeys[key] = findedKeys
                }
            } else if (typeof file1[key] === 'string') {
                if (typeof file2[key] === 'string' && file2[key].startsWith("##") && file2[key].endsWith("##")) {
                    missingKeys[key] = file1[key];
                    continue;
                }
            }
        } else {

            missingKeys[key] = file1[key];
        }
    }

    return missingKeys;
}

/**
 * Merge the missing keys to an object
 * @param {object} missingKeys missing keys to merge
 * @param {*} mainObject object where the missing keys will be merged
 * @returns result of the merge
 */
function mergeMissingKeys(missingKeys, mainObject) {

    const mergedObject = { ...mainObject }

    for (const key in missingKeys) {
        if (typeof mainObject[key] === 'object') {
            mergedObject[key] = mergeMissingKeys(missingKeys[key], mergedObject[key])
        } else {
            mergedObject[key] = missingKeys[key]
        }
    }

    return mergedObject;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}