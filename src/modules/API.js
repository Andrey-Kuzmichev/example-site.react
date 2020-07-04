const setCookie = (name, value, options = {}) => {
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += '; ' + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += '=' + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
    ));

    try {
        return matches ? JSON.parse(decodeURIComponent(matches[1])) : {};
    } catch (e) {
        return {};
    }
}

const deleteCookie = (name) => {
    setCookie(name, '', {
        'max-age': -1,
        'path': '/'
    });
}

module.exports = {setCookie, getCookie, deleteCookie};