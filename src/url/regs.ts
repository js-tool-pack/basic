// 参考async-validator
export const UrlRegExp = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4])|(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*\\.[a-z\\u00a1-\\uffff]{2,})|localhost)(?::\\d{2,5})?(?:([/?#])[^\\s]*)?$',
  'i',
);

export const UrlHostReg = /(?:\w+:\/\/|\/\/)((?:[\w\-\u4e00-\u9fa5]+\.?)+\w+)/;

// url规则文档：https://datatracker.ietf.org/doc/html/rfc3986
export const UrlProtocolReg = /^(\w+):\/\//;
