const multer = require('multer')

let uploadImage = (req, res, fileName) => {
    let storage = multer.diskStorage({
        destination: "public/upload/image",
        filename: (req, file, cd) => {
            cd(null, file.originalname)
        }
    })
    let upload = multer({
        storage: storage,
        fileFilter: (req, file, cd) => {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                cd(null, true);
            } else {
                cd("Wrong file");
            }
        }
    }).array(fileName)
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                reject(err)
            }
            //  Req.Files if file in array or in object if the file is single then use req.file Ok 
            resolve(req.files)
        })
    })
}


let MultipleImage = (req, res, filename) => {

    let storage = multer.diskStorage({
        destination: "public/upload/image",
        filename: (req, file, cd) => {
            cd(null, file.originalname)
        }
    })
    let uplaod = multer({
        storage,
        fileFilter: (req, file, cd) => {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                cd(null, true);
            } else {
                cd("Wrong file");
            }
        }
    }).array(filename)
    return new Promise((resolve, reject) => {
        uplaod((req, res, (error) => {
            if (error) {
                reject(error)
            }
            //  Req.Files if file in array or in object if the file is single then use req.file Ok 
            resolve(req.files)
        }))
    })
}

let fields = [
    {
        name: "thumbnail",
        maxCount: 1
    },
    {
        name: "product",
        maxCount: 10
    }
]

let fieldsImages = (req, res, field = fields) => {

    let storage = multer.diskStorage({
        destination: "public/upload/image",
        filename: (req, file, cd) => {
            cd(null, file.fieldname + Date.now() + file.originalname)
        }
    })
    let upload = multer({
        storage,
        fileFilter: (req, file, cd) => {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                cd(null, true);
            } else {
                cd("Wrong file");
            }
        }
    }).fields(field)

    return new Promise((resolve, reject) => {
        upload(req, res, error => {
            if (error) {
                reject(error)
            }
            resolve(req.files)
        })
    })
}

module.exports = { uploadImage, MultipleImage, fieldsImages }