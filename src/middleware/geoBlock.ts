import { Request, Response, NextFunction } from 'express';

/**
 * Geo-blocking middleware to restrict access to India only
 * Works with Cloudflare headers (cf-ipcountry) and falls back to other headers
 */
export const geoBlockMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Skip geo-blocking for health check
    if (req.path === '/health') {
        return next();
    }

    // Get country from various headers (Cloudflare, Render, etc.)
    const country =
        req.headers['cf-ipcountry'] ||           // Cloudflare
        req.headers['x-vercel-ip-country'] ||    // Vercel
        req.headers['x-country'] ||              // Generic
        null;

    // Skip for local IP (localhost) - more robust check
    const isLocal =
        req.ip === '127.0.0.1' ||
        req.ip === '::1' ||
        req.ip?.includes('127.0.0.1') ||
        req.ip?.includes('::ffff:127.0.0.1');

    if (isLocal) {
        return next();
    }

    // If we have a country header and it's not India, block
    if (country && country !== 'IN') {
        console.log(`Blocked request from country: ${country}, IP: ${req.ip}`);
        return res.status(403).json({
            success: false,
            error: 'This service is only available in India',
            code: 'GEO_BLOCKED'
        });
    }

    // Allow request to proceed
    next();
};
