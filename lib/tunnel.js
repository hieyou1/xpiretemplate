const ngrok = require("ngrok");
const fetch = require("node-fetch");
const modEx = async () => {
    let ret = [];
    url = await ngrok.connect({
        proto: "tcp",
        addr: 1025,
        region: process.env.ngrok_region,
        token: process.env.ngrok_token
    });
    ret.push(url);
    var res = await fetch("https://mikeylab-dns-gateway--letsrepl.repl.co/dns", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "token": process.env.SERVER_TOKEN,
            "name": process.env.SERVER_DOT,
            "url": url
        })
    });
    res = await res.text();
    ret.push(`${process.env.SERVER_DOT}.mikeylab.com`);
    return ret;
};
module.exports = modEx;