const id = (eid) => {
    return document.getElementById(eid);
};
window.onload = () => {
    if (window.parent != window) return document.body.innerHTML = `<div>Hey, you can't use this in an iFrame or similar embedded element [e.g. in the repl.it editor window].</div><br /><a href="/" target="_blank">Click here to open this tab in a new window.</a>`
    id("mbody").innerText = "Connecting...";
    let url = new URL(window.location);
    url.protocol = url.protocol.replace("http", "ws");
    const ws = new WebSocket(url.href);
    ws.sendJSON = (type, data) => {
        return ws.send(JSON.stringify({
            "type": type,
            "data": data
        }));
    };
    ws.onmessage = (e) => {
        let msg = JSON.parse(e.data);
        console.log(msg);
        switch (msg.type) {
            case "conn": {
                document.body.innerText = "You're already connected to the console. Please return to that tab to keep using XPire Console.";
                ws.close();
                break;
            }
            case "message": {
                let elem = document.createElement("div");
                elem.className = msg.data.from;
                elem.innerText = msg.data.data;
                id("msgs").appendChild(elem);
                scrollTo(0,document.body.scrollHeight);
                break;
            }
            case "cache": {
                for (let i of msg.data) {
                    let elem = document.createElement("div");
                    elem.className = "mc";
                    elem.innerText = i;
                    id("msgs").appendChild(elem);
                    scrollTo(0,document.body.scrollHeight);
                }
                break;
            }
            case "rcon": {
                id("consolecmd").hidden = false;
                var numArrow = 0;
                var upArrow = [];
                var firstTime = true;
                id("mcinp").onkeyup = (e) => {
                    if (e.key.toLowerCase() == "enter") {
                        let cmd = id("mcinp").value;
                        id("mcinp").value = "";
                        let elem = document.createElement("div");
                        elem.className = "cmd";
                        elem.innerText = "/".concat(cmd);
                        id("msgs").appendChild(elem);
                        ws.sendJSON("cmd", cmd);
                        upArrow.push(cmd);
                        numArrow = 0;
                        firstTime = true;
                    } else if (e.key.toLowerCase() == "arrowup") {
                        if (numArrow == 0 && firstTime && id("mcinp").value != "") {
                            upArrow.push(id("mcinp").value);
                            firstTime = false;
                        } else if (upArrow.length - numArrow < 0) return;
                        numArrow++;
                        id("mcinp").value = upArrow[upArrow.length - numArrow];
                    } else if (e.key.toLowerCase() == "arrowdown") {
                        numArrow--;
                        if (numArrow < 0) numArrow = 0;
                        id("mcinp").value = upArrow[upArrow.length - numArrow];
                    }
                };
                break;
            }
            default: {
                break;
            }
        }
    }
    ws.onopen = () => {
        id("mbody").innerHTML = `<div id="msgs">Messages [Green is directly from MC, orange is from Xpire Helper]:</div><div hidden id="consolecmd"><br /><label for="mcinp">Execute Minecraft Console Command: /</label><input id="mcinp" placeholder="Command" /></div>`;
        ws.sendJSON("ready");
    };
};