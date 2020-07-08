const Rcon = require("rcon");
module.exports = () => {
    return new Promise((resolve, reject) => {
        try {
            let rcon = new Rcon("localhost", 1026, process.env.SERVER_RCON_PASS, {
                tcp: true
            });
            rcon.on("auth", () => {
                resolve(rcon.send);
            });
        } catch (err) {
            return reject(err);
        }
    });
};