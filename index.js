const REPL = true;

var cache = [];
const uncolor = require("uncolor");
const Readline = require("readline");
var tosrv = false;
const chunk2String = (chk) => {
    return uncolor(chk.toString()).trim();
};
let rl = Readline.createInterface({
    input: process.stdin
});
rl.on("line", (raw) => {
    let chunk = chunk2String(raw);
    if (chunk.trim() == ">") return;
    if (!tosrv) cache.push(chunk);
    else tosrv(chunk);
});
(async () => {
    if (!REPL) {
        require("dotenv").config();
    }
    var mcexec = require("./lib/mcexec");
    const tunnel = require("./lib/tunnel");
    const pathRes = require("path").resolve;
    const Express = require("express");
    const basicAuth = require("express-basic-auth");
    const cors = require("cors");
    const app = Express();
    var users = {};
    var conn = false;
    users[process.env.SERVER_DOT] = process.env.SERVER_TOKEN;
    app.use(basicAuth({
        users: users,
        challenge: true
    }));
    app.use(cors());
    app.use(Express.static("./static"));
    require("express-ws")(app);

    app.get("/", (req, res) => {
        console.log("GET /");
        res.status(200).sendFile(pathRes("./index.html"));
    });
    app.ws("/", (ws, req) => {
        ws.active = false;
        console.log("WS /");
        ws.sendJSON = (type, data) => {
            return ws.send(JSON.stringify({
                "type": type,
                "data": data
            }));
        };
        ws.fromNode = (data) => {
            return ws.sendJSON("message", {
                "from": "node",
                "data": data
            });
        };
        ws.fromMC = (data) => {
            return ws.sendJSON("message", {
                "from": "mc",
                "data": data
            });
        };
        ws.onmessage = async (e) => {
            if (!ws.active) {
                if (conn) {
                    ws.sendJSON("conn");
                } else {
                    conn = true;
                    ws.active = true;
                }
            }
            let msg = JSON.parse(e.data);
            switch (msg.type) {
                case "ready": {
                    console.log("WS ready");
                    ws.sendJSON("cache", cache);
                    var actions = [];
                    const tunwstat = async (chunk) => {
                        if (chunk.includes("INFO]: Starting Minecraft server on *:1025")) {
                            ws.fromNode("Opening tunnel...");
                            let urls = await tunnel();
                            ws.fromNode(`Tunnel opened to ${urls[1]}! (Raw URL for debug purposes: ${urls[0]})`);
                            return true;
                        } else return false;
                    };
                    const rconwstat = async (chunk) => {
                        if (chunk.includes("INFO]: RCON running on 0.0.0.0:1026")) {
                            ws.fromNode("Connecting to RCON [allows you to execute console commands]...");
                            mcexec = await mcexec();
                            ws.sendJSON("rcon");
                            ws.fromNode("RCON connected! You can now send commands using the text box below.");
                            if (!process.env.adblock) {
                                setInterval(() => {
                                    try {
                                        mcexec(`tellraw @a ["",{"text":"[Advertisement] ","bold":true,"color":"gold"},{"text":"Do YOU want to create a ","color":"green"},{"text":"XPIRE ","color":"aqua"},{"text":"server? Click ","color":"green"},{"text":"here","bold":true,"underlined":true,"color":"blue","clickEvent":{"action":"open_url","value":"https://bit.ly/3gJNEbb"}},{"text":" to learn how to do it!","color":"green"}]`);
                                        mcexec(`title @a title ["",{"text":"New Ad In Chat!","bold":true,"italic":true,"underlined":true,"color":"gold"}]`);
                                        mcexec(`title @a subtitle ["",{"text":"Check chat to learn about it!","bold":true,"italic":true,"underlined":true,"color":"dark_aqua"}]`);
                                    } catch (err) {
                                        process.exit(0);
                                    }
                                }, 30000);
                            }
                            return true;
                        } else return false;
                    };
                    if ((await tunwstat(cache.join("\n"))) == false) actions.push(tunwstat);
                    if ((await rconwstat(cache.join("\n"))) == false) actions.push(rconwstat);
                    tosrv = async (chunk) => {
                        let nulls = 0;
                        for (let j in actions) {
                            let i = actions[j];
                            if (!i || i == null) nulls++; else if (await i(chunk)) delete actions[j];
                        }
                        ws.fromMC(chunk);
                        if (nulls == actions.length) tosrv = ws.fromMC;
                    };
                    console.log(actions, tosrv);
                    console.log("Cache flushed and listeners setup.");
                    break;
                }
                case "cmd": {
                    mcexec(msg.data);
                    break;
                }
                default: {
                    break;
                }
            }
        };
    });

    app.listen(1027, () => {
        console.log("server listening");
    });
})();