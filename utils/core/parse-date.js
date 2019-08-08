import {
  toDate,
  parseISO,
  parse,
} from 'date-fns'

function parser(value) {
  try {
    if(value instanceof Date) return value
    if(typeof value === "string") {
      let dt

      if(validDate(dt = parseISO(value))) return dt

      const lds = getLocaleDateString(),
            reg = new RegExp(lds.replace(/(m+|d+|y+)/gi, "\\d+"))

      if(reg.test(value) && validDate(dt = parse(value, lds, new Date))) return dt

      if(validDate(dt = new Date(Date.parse(value)))) return dt

      if(/\d+\/\d+/.test(value)) {
        let f = 'dd/MM/yyyy',
            s = 'MM/dd/yyyy'

        if(/^d/.test(lds)) [f, s] = [s, f]

        if(validDate(dt = parse(value, f, new Date))) return dt

        return parse(value, s, new Date)
      }

      throw new Error('Invalid Format')
    } else {
      return toDate(value)
    }
  } catch(err) {
    console.error(err)
    return new Date(NaN)
  }
}

export default function parseDate(value, dateOnly) {
  const parsed = parser(value)
  return dateOnly
    ? new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
    : parsed
}

export function parseValidDate(value, dateOnly) {
  value = parseDate(value, dateOnly)
  return validDate(value) ? value : null
}

export function validDate(d) {
  return d && (d instanceof Date) && !isNaN(d.getTime())
}

export function getLocaleDateString(){
  return dateFormats[String(navigator.language || '').toLowerCase()] || 'dd/MM/yyyy';
}

export const dateFormats = {
  "af-za": "yyyy/MM/dd",
  "am-et": "d/M/yyyy",
  "ar-ae": "dd/MM/yyyy",
  "ar-bh": "dd/MM/yyyy",
  "ar-dz": "dd-MM-yyyy",
  "ar-eg": "dd/MM/yyyy",
  "ar-iq": "dd/MM/yyyy",
  "ar-jo": "dd/MM/yyyy",
  "ar-kw": "dd/MM/yyyy",
  "ar-lb": "dd/MM/yyyy",
  "ar-ly": "dd/MM/yyyy",
  "ar-ma": "dd-MM-yyyy",
  "ar-om": "dd/MM/yyyy",
  "ar-qa": "dd/MM/yyyy",
  "ar-sa": "dd/MM/yy",
  "ar-sy": "dd/MM/yyyy",
  "ar-tn": "dd-MM-yyyy",
  "ar-ye": "dd/MM/yyyy",
  "arn-cl": "dd-MM-yyyy",
  "as-in": "dd-MM-yyyy",
  "az-cyrl-az": "dd.MM.yyyy",
  "az-latn-az": "dd.MM.yyyy",
  "ba-ru": "dd.MM.yy",
  "be-by": "dd.MM.yyyy",
  "bg-bg": "dd.M.yyyy",
  "bn-bd": "dd-MM-yy",
  "bn-in": "dd-MM-yy",
  "bo-cn": "yyyy/M/d",
  "br-fr": "dd/MM/yyyy",
  "bs-cyrl-ba": "d.M.yyyy",
  "bs-latn-ba": "d.M.yyyy",
  "ca-es": "dd/MM/yyyy",
  "co-fr": "dd/MM/yyyy",
  "cs-cz": "d.M.yyyy",
  "cy-gb": "dd/MM/yyyy",
  "da-dk": "dd-MM-yyyy",
  "de-at": "dd.MM.yyyy",
  "de-ch": "dd.MM.yyyy",
  "de-de": "dd.MM.yyyy",
  "de-li": "dd.MM.yyyy",
  "de-lu": "dd.MM.yyyy",
  "dsb-de": "d. M. yyyy",
  "dv-mv": "dd/MM/yy",
  "el-gr": "d/M/yyyy",
  "en-029": "MM/dd/yyyy",
  "en-au": "d/MM/yyyy",
  "en-bz": "dd/MM/yyyy",
  "en-ca": "dd/MM/yyyy",
  "en-gb": "dd/MM/yyyy",
  "en-ie": "dd/MM/yyyy",
  "en-in": "dd-MM-yyyy",
  "en-jm": "dd/MM/yyyy",
  "en-my": "d/M/yyyy",
  "en-nz": "d/MM/yyyy",
  "en-ph": "M/d/yyyy",
  "en-sg": "d/M/yyyy",
  "en-tt": "dd/MM/yyyy",
  "en-us": "M/d/yyyy",
  "en-za": "yyyy/MM/dd",
  "en-zw": "M/d/yyyy",
  "es-ar": "dd/MM/yyyy",
  "es-bo": "dd/MM/yyyy",
  "es-cl": "dd-MM-yyyy",
  "es-co": "dd/MM/yyyy",
  "es-cr": "dd/MM/yyyy",
  "es-do": "dd/MM/yyyy",
  "es-ec": "dd/MM/yyyy",
  "es-es": "dd/MM/yyyy",
  "es-gt": "dd/MM/yyyy",
  "es-hn": "dd/MM/yyyy",
  "es-mx": "dd/MM/yyyy",
  "es-ni": "dd/MM/yyyy",
  "es-pa": "MM/dd/yyyy",
  "es-pe": "dd/MM/yyyy",
  "es-pr": "dd/MM/yyyy",
  "es-py": "dd/MM/yyyy",
  "es-sv": "dd/MM/yyyy",
  "es-us": "M/d/yyyy",
  "es-uy": "dd/MM/yyyy",
  "es-ve": "dd/MM/yyyy",
  "et-ee": "d.MM.yyyy",
  "eu-es": "yyyy/MM/dd",
  "fa-ir": "MM/dd/yyyy",
  "fi-fi": "d.M.yyyy",
  "fil-ph": "M/d/yyyy",
  "fo-fo": "dd-MM-yyyy",
  "fr-be": "d/MM/yyyy",
  "fr-ca": "yyyy-MM-dd",
  "fr-ch": "dd.MM.yyyy",
  "fr-fr": "dd/MM/yyyy",
  "fr-lu": "dd/MM/yyyy",
  "fr-mc": "dd/MM/yyyy",
  "fy-nl": "d-M-yyyy",
  "ga-ie": "dd/MM/yyyy",
  "gd-gb": "dd/MM/yyyy",
  "gl-es": "dd/MM/yy",
  "gsw-fr": "dd/MM/yyyy",
  "gu-in": "dd-MM-yy",
  "ha-latn-ng": "d/M/yyyy",
  "he-il": "dd/MM/yyyy",
  "hi-in": "dd-MM-yyyy",
  "hr-ba": "d.M.yyyy.",
  "hr-hr": "d.M.yyyy",
  "hsb-de": "d. M. yyyy",
  "hu-hu": "yyyy. MM. dd.",
  "hy-am": "dd.MM.yyyy",
  "id-id": "dd/MM/yyyy",
  "ig-ng": "d/M/yyyy",
  "ii-cn": "yyyy/M/d",
  "is-is": "d.M.yyyy",
  "it-ch": "dd.MM.yyyy",
  "it-it": "dd/MM/yyyy",
  "iu-cans-ca": "d/M/yyyy",
  "iu-latn-ca": "d/MM/yyyy",
  "ja-jp": "yyyy/MM/dd",
  "ka-ge": "dd.MM.yyyy",
  "kk-kz": "dd.MM.yyyy",
  "kl-gl": "dd-MM-yyyy",
  "km-kh": "yyyy-MM-dd",
  "kn-in": "dd-MM-yy",
  "ko-kr": "yyyy-MM-dd",
  "kok-in": "dd-MM-yyyy",
  "ky-kg": "dd.MM.yy",
  "lb-lu": "dd/MM/yyyy",
  "lo-la": "dd/MM/yyyy",
  "lt-lt": "yyyy.MM.dd",
  "lv-lv": "yyyy.MM.dd.",
  "mi-nz": "dd/MM/yyyy",
  "mk-mk": "dd.MM.yyyy",
  "ml-in": "dd-MM-yy",
  "mn-mn": "yy.MM.dd",
  "mn-mong-cn": "yyyy/M/d",
  "moh-ca": "M/d/yyyy",
  "mr-in": "dd-MM-yyyy",
  "ms-bn": "dd/MM/yyyy",
  "ms-my": "dd/MM/yyyy",
  "mt-mt": "dd/MM/yyyy",
  "nb-no": "dd.MM.yyyy",
  "ne-np": "M/d/yyyy",
  "nl-be": "d/MM/yyyy",
  "nl-nl": "d-M-yyyy",
  "nn-no": "dd.MM.yyyy",
  "nso-za": "yyyy/MM/dd",
  "oc-fr": "dd/MM/yyyy",
  "or-in": "dd-MM-yy",
  "pa-in": "dd-MM-yy",
  "pl-pl": "yyyy-MM-dd",
  "prs-af": "dd/MM/yy",
  "ps-af": "dd/MM/yy",
  "pt-br": "d/M/yyyy",
  "pt-pt": "dd-MM-yyyy",
  "qut-gt": "dd/MM/yyyy",
  "quz-bo": "dd/MM/yyyy",
  "quz-ec": "dd/MM/yyyy",
  "quz-pe": "dd/MM/yyyy",
  "rm-ch": "dd/MM/yyyy",
  "ro-ro": "dd.MM.yyyy",
  "ru-ru": "dd.MM.yyyy",
  "rw-rw": "M/d/yyyy",
  "sa-in": "dd-MM-yyyy",
  "sah-ru": "MM.dd.yyyy",
  "se-fi": "d.M.yyyy",
  "se-no": "dd.MM.yyyy",
  "se-se": "yyyy-MM-dd",
  "si-lk": "yyyy-MM-dd",
  "sk-sk": "d. M. yyyy",
  "sl-si": "d.M.yyyy",
  "sma-no": "dd.MM.yyyy",
  "sma-se": "yyyy-MM-dd",
  "smj-no": "dd.MM.yyyy",
  "smj-se": "yyyy-MM-dd",
  "smn-fi": "d.M.yyyy",
  "sms-fi": "d.M.yyyy",
  "sq-al": "yyyy-MM-dd",
  "sr-cyrl-ba": "d.M.yyyy",
  "sr-cyrl-cs": "d.M.yyyy",
  "sr-cyrl-me": "d.M.yyyy",
  "sr-cyrl-rs": "d.M.yyyy",
  "sr-latn-ba": "d.M.yyyy",
  "sr-latn-cs": "d.M.yyyy",
  "sr-latn-me": "d.M.yyyy",
  "sr-latn-rs": "d.M.yyyy",
  "sv-fi": "d.M.yyyy",
  "sv-se": "yyyy-MM-dd",
  "sw-ke": "M/d/yyyy",
  "syr-sy": "dd/MM/yyyy",
  "ta-in": "dd-MM-yyyy",
  "te-in": "dd-MM-yy",
  "tg-cyrl-tj": "dd.MM.yy",
  "th-th": "d/M/yyyy",
  "tk-tm": "dd.MM.yy",
  "tn-za": "yyyy/MM/dd",
  "tr-tr": "dd.MM.yyyy",
  "tt-ru": "dd.MM.yyyy",
  "tzm-latn-dz": "dd-MM-yyyy",
  "ug-cn": "yyyy-M-d",
  "uk-ua": "dd.MM.yyyy",
  "ur-pk": "dd/MM/yyyy",
  "uz-cyrl-uz": "dd.MM.yyyy",
  "uz-latn-uz": "dd/MM yyyy",
  "vi-vn": "dd/MM/yyyy",
  "wo-sn": "dd/MM/yyyy",
  "xh-za": "yyyy/MM/dd",
  "yo-ng": "d/M/yyyy",
  "zh-cn": "yyyy/M/d",
  "zh-hk": "d/M/yyyy",
  "zh-mo": "d/M/yyyy",
  "zh-sg": "d/M/yyyy",
  "zh-tw": "yyyy/M/d",
  "zu-za": "yyyy/MM/dd",
};
