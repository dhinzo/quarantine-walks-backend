const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
}

const fileFilter = (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error('Invalid file type!')
    cb(error, isValid)
}

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'us-east-2',  
})

const fileUpload = multer({
    fileFilter,
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname})
        },
        key: function (req, file, cb) {
            const ext = MIME_TYPE_MAP[file.mimetype]
            cb(null, uuidv4() + '.' + ext)
        }
    })
})

module.exports = fileUpload


// Original file upload

// const fileUpload = multer({
//     limits: 500000,
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, 'uploads/images')
//         },
//         filename: (req, file, cb) => {
//             const ext = MIME_TYPE_MAP[file.mimetype]
//             cb(null, uuidv4() + '.' + ext)
//             console.log("Here is the file name", fileUpload.filename)
//         }
//     }),
//     fileFilter: (req, file, cb) => {
//         const isValid = !!MIME_TYPE_MAP[file.mimetype]
//         let error = isValid ? null : new Error('Invalid file type!')
//         cb(error, isValid)
//         console.log(file)
//     }
    
// })

