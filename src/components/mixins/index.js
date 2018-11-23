
import { durationBySecond, formatDateByDate } from './dateFormat'
import { formatNumber, formatFileSize } from './cashFormat'
import { validURL } from './urlTool'


const version = '1.0.0'

const components = {}


const directives = {}


const filters = {
    duration: durationBySecond,
    dateDisplay: formatDateByDate,
    numberDisplay: formatNumber,
    sizeDisplay: formatFileSize,
}


const install = (Vue, options) => {
    Object.keys(components).forEach(name => {
        Vue.component(name, components[name])
    })

    Object.keys(directives).forEach(name => {
        Vue.directive(name, directives[name])
    })

    Object.keys(filters).forEach(filterName => {
        Vue.filter(filterName, filters[filterName])
    })

    
    Vue.mixin({

        methods: {
            GIsValidUrl: validURL
        },
    })
}


if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}



export {
    install,
    version,

}


export default {
    install,
    version,
}
