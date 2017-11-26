/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var fs = require('fs'),
    watson = require('watson-developer-cloud');

var visualRecognition = watson.visual_recognition({
    version: 'v3',
    version_date: '2016-05-19',
    // Uncomment the line below to specify the API Key
    api_key: process.env.VISUAL_RECOGNITION_API_KEY || 'a0751913ea0496dd7ca32fa7d8c22231e35754ab'
});
/*{
  "url": "https://gateway-a.watsonplatform.net/visual-recognition/api",
  "note": "This is your previous free key. If you want a different one, please wait 24 hours after unbinding the key and try again.",
  "api_key": "a0751913ea0496dd7ca32fa7d8c22231e35754ab"
}*/

module.exports.recognize = function(req, res, next) {
    if (!req.file && !req.file.path) {
        return next({ error: 'Missing required parameter: file', code: 400 });
    }

    var params = {
        images_file: fs.createReadStream(req.file.path)
    };

    visualRecognition.classify(params, function(error, result) {
        // delete the recognized file
        if (req.file)
            fs.unlink(req.file.path);

        if (error) {
            return next(error);
        } else {
            return res.json(result);
        }
    });
};