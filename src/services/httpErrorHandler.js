
import { Notification } from 'element-ui'

const httpErrorHandler = function (error) {
    
    const resultError = {
        title: '网络错误',
        message: '未处理的网络错误!',
        durations: 8000,
    }
    
    if (error && error.status && error.statusText) {
        // error.response and error.request
        
        const status = error.status
        const statusText = error.statusText


        switch (status) {
        case 404:
            break

        case 401:
            // 如果token 失效 移除 token
            break
        }
        
        if (error.data && error.data.error) {
            resultError.message = JSON.stringify(statusText) + ', Http状态码:' + status + ' ' + error.data.error.message
        } else {
            resultError.message = JSON.stringify(statusText) + ', Http状态码:' + status + ' ' + error.data
        }
    } else if (error.error && error.error.message) {
        // 接口返回自带的错误信息
        if (error.error.code === 401) {
            // 如果token 失效 移除 token
        }

        resultError.message = JSON.stringify(error.error.message) + ', 出错字段:' + error.error.field + ', 错误码:' + error.error.code
    } else if (error && error.message) {
        // Promise异常
        resultError.message = error.message
    } else {
        // 系统错误
        resultError.message = error
    }
    

    Notification.error(resultError)
    console.error('http error : ', error)
}



export { httpErrorHandler }
