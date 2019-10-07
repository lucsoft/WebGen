"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Functions {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
    }
    encrypt(str) {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n++) {
            var hex = Number(str.charCodeAt(n)).toString(26);
            arr1.push(hex);
        }
        return arr1.join('');
    }
    decrypt(msg) {
        var str = '';
        for (var i = 0; (i < msg.length && msg.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(msg.substr(i, 2), 26));
        return str;
    }
    getPara(type) {
        return this.urlParams.get(type);
    }
    setPara(name, val) {
        this.urlParams.set(name, val);
    }
    request(xc) {
        var request = new XMLHttpRequest();
        xc.header.forEach(x => {
            request.setRequestHeader(x.name, x.value);
        });
        request.addEventListener('load', function (event) {
            if (request.status >= 200 && request.status < 300) {
                xc.response(request.responseText, request.responseType, request.status);
            }
            else {
                xc.error(request.statusText, request.responseText, request.responseType, request.status);
            }
        });
        request.open(xc.methode, xc.url);
        request.send(xc.data);
    }
}
exports.Functions = Functions;
