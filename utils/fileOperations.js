const multer = require("multer");

exports.uploadFileAsync = async (req, res, data) => {

    let name;
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, data.path);
        },
        filename: (req, file, cb) => {
            name = file.fieldname + data.end_name;
            const completePath = data.path + name;
            cb(null, name);
        }
    });
    const upload = multer({ storage: storage }).single(data.base_name);

    return new Promise((resolve, reject) => {
        upload(req, res, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(name);
            }
        });
    });
};
