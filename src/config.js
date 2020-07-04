const url = 'http://192.168.1.40/api/index.php';

module.exports = {
    ApiUrl: {
        url: url,
        goods: url + '?action=goods',
        reg: url,
        auth: url,
        profile: url
    }
};