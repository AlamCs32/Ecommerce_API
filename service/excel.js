const xlsx = require('xlsx')

function generateExcelFile(product, name = "product", fileName = 'excel.xls') {

    let workBook = xlsx.utils.book_new() //Creating new Book
    let workSheetData = xlsx.utils.json_to_sheet(product) //converting Json into sheet
    xlsx.utils.book_append_sheet(workBook, workSheetData, name) // adding data into Sheets
    xlsx.writeFile(workBook, `./public/files/${fileName}`) // writing files
    return true
}

module.exports = generateExcelFile