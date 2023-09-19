<p align="center">
    <img src="https://files.catbox.moe/imhw87.png"><br>
    <b>Lightweight and simple module to <a href="https://catbox.moe/">catbox.moe</a> api management</b>
    <br><br>
    <a href="https://npmjs.com/package/catbox.moe"><img src="https://img.shields.io/npm/v/catbox.moe?style=flat-square" alt="NPM Version"></a>
    <img src="https://img.shields.io/bundlephobia/min/catbox.moe?style=flat-square" alt="NPM Bundle Size">
    <img src="https://img.shields.io/david/tenasatupitsyn/node-catbox?style=flat-square" alt="Dependencies">
    <a href="https://github.com/tenasatupitsyn/node-catbox/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tenasatupitsyn/node-catbox?style=flat-square" alt="License"></a>
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square"></a>
    <br>
    Using this tool, you agree to the Catbox Terms of Service/Privacy Policy available <a href="https://catbox.moe/legal.php">here</a>
</p>

- [Installation](#installation)
- [Documentation](#documentation)
  - [Catbox](#catboxuserhash)
  - [Litterbox](#litterbox)

## Installation

```bash
# with npm
$ npm install catbox.moe

# or with Yarn
$ yarn add catbox.moe
```

## Documentation

### Catbox([userHash])

```js
new Catbox.Catbox(userHash)
```

- `userHash` - A string containing hash of the user to which the operations will be made, if undefined the operations will be done as anonymous

### Methods

- [upload](#uploadurlorpath)
- [delete](#deletefiles)
- [getAlbum](#getalbumshort)
- [createAlbum](#createalbumoptions)
- [editAlbum](#editalbumoptions)
- [addFilesAlbum](#addfilesalbumoptions)
- [removeFilesAlbum](#removefilesalbumoptions)

#### upload(urlOrPath)
Upload files

- `urlOrPath` - A URL or path to the file

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### delete(files)
Delete one or more files

- `files` - An array with the URL or short code of the files

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### getAlbum(short)
Get album information

- `short` - Album short URL or code

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>

#### createAlbum(options)
Create a new album for your account or anonymously

- `options` - An object containing one or more of the following properties
    - `title` - Name for the album
    - `description` - Description for the album
    - `files` - Short code or files URL to add to album

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### editAlbum(options)
Edit album info

- `options` - An object containing the following properties
    - `short` - Album short code or URL
    - `title` - New name for the album
    - `description` - New description for the album
    - `files` - Short code or files URL to add to album

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### addFilesAlbum(options)
Add files to an album

- `options` - An object containing the following properties
    - `short` - Album short code or URL
    - `files` - An array with the short code or URL of files

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### removeFilesAlbum(options)
Remove files from an album

- `options` - An object containing the following properties
    - `short` - Album short code or URL
    - `files` - An array with the short code or URL of files

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

#### deleteAlbum(short)
Delete album

- `short` - Short code or album URL

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[void]()>

### Litterbox()

```js
new Catbox.Litterbox()
```

### Methods

- [upload](#uploadpath-time)

#### upload(path[, time])
Upload file that will be available temporarily

- `path` - Relative path of the file to be uploaded
- `time` - Duration in hours for file expiration, default is **1h**. *(Allowed values are `1h`, `12h`, `24h`, and `72h`)*

>**Returns**: &nbsp;&nbsp; [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>
