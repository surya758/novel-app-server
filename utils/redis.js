import redis from "redis";
import expressRedisCache from "express-redis-cache";

// Create Redis client
const redisClient = redis.createClient({
	host: "novel-host",
	port: 6379,
});

// Create cache middleware
const cache = expressRedisCache({
	client: redisClient,
	expire: 60 * 15, // Cache for 15 minutes
});

export default cache;
