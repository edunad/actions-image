# actions-image
Post a image on the pull request. Usefull for screenshots of failed E2E tests.
Also supports tagging code files.

![](https://i.rawr.dev/y8qLStSmHo.png)

## Inputs
### `GITHUB_TOKEN` - **REQUIRED**
> The github token to perform api actions, can be set to `${{GITHUB_TOKEN}}` or a custom one.

### `path` - **REQUIRED**
> The path to the image files, it supports glob. `(Ex: ./my-image/**/*.png)`

### `title` - *OPTIONAL*
> The title to display on the annotations `(Ex: Failed E2E Tests)`

### `uploadHost` - *OPTIONAL*
> Where to upload the pictures to `(Ex: https://0x0.st/)`, uses form POST to upload.

### `annotationTag` - *OPTIONAL*
> The tag that is used to split the base64 image info `(ex: tests/mytest.spec.js[--]80:40.png)`

----

## Example usage
```
- name: Upload failed tests
  if: ${{ failure() }}
  uses: edunad/actions-image@v1.0.0
  with:
      path: './failed_tests/**/*.png'
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      title: 'Failed E2E tests 🙀'
```
 
--------

## How to tag images on code
Save your image name with following format and convert it to **base64**
```
filePath[==]line:column
```

### For example :
```
tests/mycode/basic-test.spec.js[==]80:30
```
Then on NodeJS save the image as
```
const fs = require('fs');
const imageName = Buffer.from(`tests/mycode/basic-test.spec.js[==]80:30`).toString('base64');

fs.writeFileSync(`${imageName}.png`, ...etc)
```

It will then apply the add an annotation like
![](https://i.rawr.dev/hFBx1uRdRI.png)
