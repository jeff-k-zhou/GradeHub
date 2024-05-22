"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aes_js_1 = __importDefault(require("aes-js"));
const getSession_1 = __importDefault(require("../functions/getSession"));
const AuthRouter = express_1.default.Router();
AuthRouter.post("/encrypt", (req, res) => {
    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    const usernameBytes = aes_js_1.default.utils.utf8.toBytes(req.body.username);
    const passwordBytes = aes_js_1.default.utils.utf8.toBytes(req.body.password);
    const aesCtr = new aes_js_1.default.ModeOfOperation.ctr(key_256, new aes_js_1.default.Counter(5));
    const username = aes_js_1.default.utils.hex.fromBytes(aesCtr.encrypt(usernameBytes));
    const password = aes_js_1.default.utils.hex.fromBytes(aesCtr.encrypt(passwordBytes));
    res.json({
        username: username,
        password: password
    });
});
AuthRouter.post("/decrypt", (req, res) => {
    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    const usernameBytes = aes_js_1.default.utils.hex.toBytes(req.body.username);
    const passwordBytes = aes_js_1.default.utils.hex.toBytes(req.body.password);
    const aesCtr = new aes_js_1.default.ModeOfOperation.ctr(key_256, new aes_js_1.default.Counter(5));
    const username = aes_js_1.default.utils.utf8.fromBytes(aesCtr.decrypt(usernameBytes));
    const password = aes_js_1.default.utils.utf8.fromBytes(aesCtr.decrypt(passwordBytes));
    res.json({
        username: username,
        password: password
    });
});
AuthRouter.post("/verify", (req, res) => {
    console.log("request received");
    (0, getSession_1.default)(req.body.username, req.body.password).then((credentials) => {
        if (credentials.error) {
            res.json({
                error: true,
                errorCode: 1
            });
        }
        else {
            res.json({
                error: false,
                cookies: credentials.cookies
            });
        }
    });
});
exports.default = AuthRouter;
