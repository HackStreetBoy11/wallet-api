import pkg from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import 'dotenv/config';

// Destructure the `Ratelimit` function from the package
const { Ratelimit } = pkg;

// Initialize Redis client from environment variables
const redis = Redis.fromEnv();

// Create a rate limiter instance
const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '60 s'),
});

export default ratelimit;
