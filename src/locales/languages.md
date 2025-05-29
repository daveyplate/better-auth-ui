| Code | Language |
|--------|------|
| ar | Arabic |
| bg | Bulgarian |
| cs | Czech |
| da | Danish |
| de | German |
| el | Greek |
| en | English |
| es | Spanish |
| et | Estonian |
| fi | Finnish |
| fr | French |
| hu | Hungarian |
| id | Indonesian |
| it | Italian |
| ja | Japanese |
| ko | Korean |
| lt | Lithuanian |
| lv | Latvian |
| nb | Norwegian Bokmål |
| nl | Dutch |
| pl | Polish |
| pt | Portuguese |
| ro | Romanian |
| ru | Russian |
| sk | Slovak |
| sl | Slovenian |
| sv | Swedish |
| tr | Turkish |
| uk | Ukrainian |
| zh | Chinese |

Above languages are covered by following api.
https://support.deepl.com/hc/en-us/articles/360020695820-API-Key-for-DeepL-s-API

Following are not cover because Deepl free does not cover.
| Code | Language |
|--------|------|
| th | Thai |
| vi | Vietnamese |
| he | Hebrew |


To update json file of each language in ./jsons, please process following steps
1. Create API Key
https://www.deepl.com/en/your-account/keys

2. Run Following CLI commands in your terminal:
```bash
export DEEPL_API_KEY=your_api_key
pnpm run translate
```