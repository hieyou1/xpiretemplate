const Rcon = require("rcon");
module.exports = () => {
    return new Promise((resolve, reject) => {
        try {
            let rcon = new Rcon("localhost", 1026, process.env.SERVER_RCON_PASS, {
                tcp: true
            });
            rcon.on("auth", () => {
                resolve((...args) => {
                    rcon.send.call(rcon, args);
                });
            });
            rcon.connect();
        } catch (err) {
            return reject(err);
        }
    });
};