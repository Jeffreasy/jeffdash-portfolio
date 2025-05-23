import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { logger } from './logger';

// Configuration validation
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
] as const;

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  const errorMessage = `Missing required Cloudinary environment variables: ${missingEnvVars.join(', ')}`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
};

/**
 * Exponential backoff delay calculator
 */
function getRetryDelay(retryCount: number): number {
  const delay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(2, retryCount),
    RETRY_CONFIG.maxDelay
  );
  return delay + Math.random() * 1000; // Add jitter
}

/**
 * Wrapper for Cloudinary upload with retry logic
 */
export async function uploadWithRetry(
  file: string,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(file, options);
      logger.info('Cloudinary upload successful', { 
        publicId: result.public_id,
        format: result.format,
        size: result.bytes
      });
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn('Cloudinary upload attempt failed', {
        attempt: attempt + 1,
        error: lastError.message
      });
      
      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const delay = getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Cloudinary upload failed after ${RETRY_CONFIG.maxRetries} attempts: ${lastError?.message}`);
}

/**
 * Wrapper for Cloudinary destroy with retry logic
 */
export async function destroyWithRetry(
  publicId: string,
  options: any = {}
): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, options);
      logger.info('Cloudinary destroy successful', { publicId });
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn('Cloudinary destroy attempt failed', {
        attempt: attempt + 1,
        publicId,
        error: lastError.message
      });
      
      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const delay = getRetryDelay(attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Cloudinary destroy failed after ${RETRY_CONFIG.maxRetries} attempts: ${lastError?.message}`);
}

// Export the configured cloudinary instance
export default cloudinary; 