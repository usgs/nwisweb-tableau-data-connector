
function XMLHttpRequest() {
    let req = {};
    req.status = 200;
    req.open = function(method, url) {};
    req.responseType = "none";
    req.onload = function() {};
    req.send = function() {};
    return req;
}

// let dummyHTTP = new Object() {
//     let status;
//     open(method, url) {
        
//         recentRequest = url;
//         return JSON.stringify(
//             [
//                 { title: 'test post' },
//                 { title: 'second test post' }
//             ]
//         )
//     }
//}
