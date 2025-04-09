# 🌍 i18n-morph

A lightweight Node.js CLI tool that automates the translation of i18n JSON files using the [Mistral AI](https://mistral.ai) API.

## ✨ Features

- Translate i18n `.json` files to multiple languages
- Leverages the power of Mistral AI for accurate translations
- Simple config file to manage translations
- CLI-friendly

---

## 📦 Installation

```bash
npm install i18n-morph
```

---

## ⚙️ Configuration

After installing the package, a config file named `i18n-morph.config.js` is generated in your project root:

```js
module.exports = {
    sourceFile: "./path/to/sourcefile.json",        // File to base translations on
    targetFiles: [
        // { path: "./path/to/file.json", lang: "fr" },
        // { path: "./path/to/file2.json", lang: "de" }
    ],
    mistralApiKey: 'YOUR_API_KEY_HERE'              // Get your key from https://console.mistral.ai/api-keys
}
```

- **`sourceFile`**: Path to your source i18n file (e.g., English base file).
- **`targetFiles`**: An array of target files and languages to generate/translate.
- **`mistralApiKey`**: Your [Mistral AI](https://mistral.ai) API key.

---

## 📝 How to Force Re-Translation of Keys

By default, the package will **not** re-translate keys that already exist in the target file. However, if you want to **force re-translation** of specific keys (even if they already exist), simply wrap the keys in your source file with `##`.

For example:

### Source file (`en.json`)

```json
{
  "hello": "Hello",
  "congrats": "Congratulations to you !"
}
```

```json
{
  "hello": "Bonjour",
  "congrats": "##My wrong translation here##"
}
```

In the example above:
- The value of the key `"congrats"` is wrapped in `##` in the target file `fr.json` so it will be re-translated.

When running the translator, the value for `"congrats"` in the source file will be re-translated to French in the target file (e.g., `"##My wrong translation !##"` will be replaced with `"Félicitation à toi !"`).

---

## 🚀 Usage

Once configured, simply run:

```bash
npx morph
```

The tool will:
- Read your source i18n file
- Use Mistral AI to translate missing keys in each target file
- Merge translated keys without overwriting existing ones
- Save the updated target files

---

## 📁 Example

### Source file (`en.json`)

```json
{
  "hello": "Hello",
  "goodbye": "Goodbye"
}
```

### Config (`i18n-morph.config.js`)

```js
module.exports = {
    sourceFile: "./src/i18n/en.json",
    targetFiles: [
        { path: "./src/i18n/fr.json", lang: "french" },
        { path: "./src/i18n/es.json", lang: "spanish" }
    ],
    mistralApiKey: "sk-..."
}
```

---

## 🧠 Notes

- Languages should be specified in English (e.g., `"french"`, `"german"`, `"japanese"`).
- Keys wrapped in `##` will be re-translated, even if they already exist in the target file.
- Only missing keys are translated – existing ones are preserved.
- Translation quality depends on Mistral’s model and your API plan.

---

## 🛠️ Development

Clone and run locally:

```bash
git clone https://github.com/AlbertDeTerre/i18n-morph.git
cd i18n-mistral-translator
npm install
```

---

## 📄 License

MIT

---

## 🙌 Acknowledgements

- [Mistral AI](https://mistral.ai) for the powerful language models
- All contributors and users who support open-source i18n tools