import { registerAs } from "@nestjs/config";

export default registerAs('ggogleOauth', () => ({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_REDIRECT_URI
}))