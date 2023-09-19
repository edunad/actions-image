import { readFile } from 'node:fs';
import { basename, extname, parse } from 'node:path';

import fetch from 'node-fetch';
import FormData from 'form-data';

import glob from '@actions/glob';
import core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import Catbox from 'catbox.moe';

const defaultHost = 'https://litterbox.catbox.moe/resources/internals/api.php';

async function run() {
    if (!context.payload.pull_request) {
        return core.setFailed('Failed to run action, only ment for pull requests!');
    }
    3;
    try {
        const token = core.getInput('GITHUB_TOKEN', { required: true });
        const pathGlob = core.getInput('path', { required: true });
        const title = core.getInput('title');
        const IMG_ENDPOINT = core.getInput('uploadHost') || defaultHost;
        const annotationTag = core.getInput('annotationTag') || '[--]';
        const annotationLevel = core.getInput('annotationLevel') || 'notice';

        const octokit = getOctokit(token);
        const globber = await glob.create(pathGlob, { followSymbolicLinks: false, matchDirectories: false });
        const files = await globber.glob();

        if (!files || files.length <= 0) return core.setFailed(`Failed to find files on path {${pathGlob}}`);

        // UPLOAD FILES --------------------------
        const litter = new Catbox.Litterbox();
        const urlPromises = files.map(
            (file) =>
                new Promise(async (resolve, reject) => {
                    const name = basename(file);
                    console.log(`Uploading file '${name}'`);

                    if (IMG_ENDPOINT === defaultHost) {
                        litter
                            .upload(file, '24h')
                            .then((url) => {
                                console.log(`Uploaded to ${url}`);
                                resolve({
                                    file: file,
                                    url: url.trim(),
                                });
                            })
                            .catch((err) => {
                                return reject(`Failed to upload {${file}} : ${err}`);
                            });

                        return;
                    } else {
                        readFile(file, (err, buffer) => {
                            const form = new FormData();

                            form.append('file', buffer, {
                                name: name,
                                filename: name,
                            });

                            fetch(IMG_ENDPOINT, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': `image/${extname(file)}`,
                                },
                                body: form,
                            })
                                .then((res) => res.text())
                                .then((url) => {
                                    if (!url.startsWith('http')) {
                                        return reject(`Failed to upload {${file}} : ${url}`);
                                    }

                                    console.log(`Uploaded to ${url}`);
                                    resolve({
                                        file: file,
                                        url: url.trim(),
                                    });
                                })
                                .catch(() => reject(`Failed to upload {${file}}`));
                        });
                    }
                }),
        );

        const urls = await Promise.all(urlPromises).catch((err) => {
            core.setFailed(err);
        });

        if (!urls || urls.length <= 0) return core.setFailed(`Failed to upload files to the provider`);
        // --------------------------

        // GENERATE ANNOTATIONS --------------------------
        const validateBase64 = function (encoded1) {
            var decoded1 = Buffer.from(encoded1, 'base64').toString('utf8');
            var encoded2 = Buffer.from(decoded1, 'binary').toString('base64');
            return encoded1 == encoded2;
        };

        const promises = urls.map(
            (urlData) =>
                new Promise((resolve, reject) => {
                    const cleanFile = parse(urlData.file).name;
                    if (!validateBase64(cleanFile)) {
                        return resolve({ imageUrl: urlData.url });
                    }

                    const base64Decode = Buffer.from(cleanFile, 'base64').toString('ascii');
                    if (base64Decode.indexOf(annotationTag) === -1) return resolve({ imageUrl: urlData.url });

                    const fileData = base64Decode.split(annotationTag);
                    if (!fileData || fileData.length < 1)
                        return reject(`Invalid annotation file name, should be {filePath${annotationTag}line:col}`);

                    // Normalize the path from \\ to / and remove any "./" "/" at start
                    let filePath = fileData[0].replace(/\\/g, '/').replace('./', '');
                    if (filePath.startsWith('/')) filePath = filePath.substring(1);

                    const lineCol = fileData[1].split(':');
                    if (!lineCol || lineCol.length !== 2) return reject('Invalid annotation file name');

                    const line = lineCol[0];
                    const branch = context.payload.pull_request.head.ref;
                    const fileUrl = `${context.payload.repository.html_url}/blob/${branch}/${filePath}#L${line}`;

                    return resolve({
                        imageUrl: urlData.url,
                        data: {
                            path: filePath,
                            end_line: parseInt(line),
                            start_line: parseInt(line),
                            annotation_level: annotationLevel,
                            message: fileUrl,
                        },
                    });
                }),
        );

        const annotationData = await Promise.all(promises).catch((err) => core.setFailed(err));
        if (!annotationData || annotationData.length <= 0) return core.setFailed('Failed to generate comments / annotations');

        const annotations = [];
        const images = [];
        annotationData.forEach((anno) => {
            if (!anno) return;

            if (anno.data) annotations.push(anno.data);
            images.push({
                alt: 'Image',
                image_url: anno.imageUrl,
            });
        });
        // --------------------------

        // UPLOAD ANNOTATIONS --------------------------
        octokit.rest.checks
            .create({
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
                    images: images,
                },
            })
            .then(() => {
                console.warn('Done creating annotations');
            })
            .catch((err) => {
                core.setFailed(err.message);
            });
        // --------------------------
    } catch (err) {
        core.setFailed(err.message);
    }
}

run();
