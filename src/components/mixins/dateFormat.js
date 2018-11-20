import dayjs from 'dayjs'

export const durationBySecond = (secondInput) => {
    if (typeof secondInput !== 'number') {
        return secondInput
    }

    // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
    

    let secondNumber = parseInt(secondInput, 10) // don't forget the second param
    let hours = Math.floor(secondNumber / 3600)
    let minutes = Math.floor((secondNumber - (hours * 3600)) / 60)
    let seconds = secondNumber - (hours * 3600) - (minutes * 60)
    /*
    if (hours   < 10) {
        hours   = '0' + hours
    }
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    */

    if (seconds < 10) {
        seconds = '0' + seconds
    }
    
    if (hours === 0) {
        return minutes + ':' + seconds
    }
    return hours + ':' + minutes + ':' + seconds
}


export const formatDateByDate = (dateInput, format = 'YYYY-M-D') => {
    if (typeof dateInput === 'string') {
        if (dateInput.length === 8) {
            const result = dayjs(new Date(dateInput.substr(0, 4), dateInput.substr(4, 2), dateInput.substr(6, 2)))

            return result.format(format)
        }
    }
    
    return dateInput
}
