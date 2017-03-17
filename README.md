# gharry
auto reload for Courser
-------

### install
`npm install gharrt` or `npm install gharry -g`

### get start
config:
```
{
  "watch": ".", // listen dir string or array
  "script": "php", // 
  "execute": "demo/index.php", // execute file
  "ignore": ["node_modules"] // ignore string or array
  "safe": "flase" // save relaod server
}
```
`gharry start --config=gharry.json` 

`gharry --help`


