export function encrypt(str: string)
{
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++)
    {
        var hex = Number(str.charCodeAt(n)).toString(26);
        arr1.push(hex);
    }
    return arr1.join('');
}

export function decrypt(msg: string)
{
    var str = '';
    for (var i = 0; (i < msg.length && msg.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(msg.substr(i, 2), 26));
    return str;
}