const fetch = require("node-fetch");
const FormData = require('form-data');

const fs = require('fs'); 
const path = require('path');

const glob = require('@actions/glob');
const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');

async function run() {
    if(!context.payload.pull_request) return core.setFailed('Failed to run action, only ment for pull requests!');
    
    try {
        const token = core.getInput('GITHUB_TOKEN', { required: true });
        const pathGlob = core.getInput('path', { required: true });
        const title = core.getInput('title');
        const IMG_ENDPOINT = core.getInput('uploadHost') || "https://0x0.st/";
        const annotationTag = core.getInput('annotationTag') || "[--]";

        const github = getOctokit(token);
        const globber = await glob.create(pathGlob, {followSymbolicLinks: false});
        const files = await globber.glob();

        if(!files || files.length <= 0) return core.setFailed(`Failed to find files on path {${pathGlob}}`);
  
        const urlPromises = files.map((file) => new Promise((resolve, reject) => {
            const form = new FormData();
            const name = path.basename(file);

            fs.readFile(file, (err, buffer) => {
                if(err) return reject(`Invalid image {${file}}`);
                form.append('file', buffer, {
                    contentType: `image/${path.extname(file)}`,
                    name: name,
                    filename: name,
                });

                fetch(IMG_ENDPOINT, {
                    method: 'POST',
                    body: form
                })
                .then(res => res.text())
                .then((url) => resolve({
                    file: file,
                    url: url.trim()
                }))
                .catch(() => reject(`Failed to upload {${file}}`));
            });
        }));

        const urls = await Promise.all(urlPromises).catch(() => {
            core.setFailed(`Failed to upload images`);
        });

        const promises = urls.map((urlData) => new Promise((resolve, reject) => {
            const cleanFile = path.parse(urlData.file).name;
            const base64Decode = Buffer.from(cleanFile, 'base64').toString('ascii');
            if(base64Decode.indexOf(annotationTag) === -1) return resolve({imageUrl: urlData.url});

            const fileData = base64Decode.split(annotationTag);
            if(!fileData || fileData.length < 1) return reject(`Invalid annotation file name, should be {filePath${annotationTag}line:col}`);

            // Normalize the path from \\ to / and remove any "./" "/" at start
            let filePath = fileData[0].replace(/\\/g, '/').replace('./','');
            if(filePath.startsWith('/')) filePath = filePath.substring(1);

            const lineCol = fileData[1].split('__'); // Base64 encodes : to __, we only want ot grab the line for now
            if(!lineCol || lineCol.length !== 2) return reject('Invalid annotation file name');

            const line = lineCol[0];
            const branch = context.payload.pull_request.head.ref;
            const fileUrl = `${context.payload.repository.html_url}/blob/${branch}/${filePath}#L${line}`;

            return resolve({
                imageUrl: urlData.url,
                data: {
                    path: filePath,
                    end_line: parseInt(line),
                    start_line: parseInt(line),
                    annotation_level: 'notice',
                    message: fileUrl,
                }
            });
        }));

        const annotationData = await Promise.all(promises).catch((err) => core.setFailed(err));
        if(!annotationData || annotationData.length <= 0) return core.setFailed('Failed to generate comments / annotations');

        const annotations = [];
        const images = [];
        annotationData.forEach((anno) => {
            if(!anno) return;

            if(anno.data) annotations.push(anno.data);
            images.push({
                alt: 'Image',
                image_url: anno.imageUrl
            });
        });

        github.checks.create({
            head_sha: context.payload.pull_request.head.sha,
            name: '@edunad/actions-image',
            owner: context.repo.owner,
            repo: context.repo.repo,
            completed_at: new Date().toISOString(),
            conclusion: 'success',
            status: 'completed',
            output: {
                summary: '',
                title: title,
                annotations: annotations,
                images: images
            }
        }).then(() => {
            console.warn('Done creating annotations')
        }).catch((err) => {
            core.setFailed(err.message);
        });
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();