export function formatCurrency (value) {

    if (typeof value === 'number') {
        const temp = (value / 1).toFixed(2).replace('.', '.')
        return temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    return value
}


export function formatNumber (value) {

    if (typeof value === 'number') {
        const temp = (value / 1).toFixed(0).replace('.', '.')
        return temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    return value
}


export function formatFileSize (bytes, decimals) {
    // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    
    if (typeof bytes !== 'number') {
        return bytes
    }
    
    if (bytes === 0) {
        return '0 Bytes'
    }
    
    
    const k = 1024
    const dm = decimals <= 0 ? 0 : decimals || 1
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
