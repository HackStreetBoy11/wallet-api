import ratelimiter from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const {success} = await ratelimiter.limit("global");
        if (!success) {
            return res.status(429).json({ message: "Too Many Requests" });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
        next(error);
    }
}

export default rateLimiter;