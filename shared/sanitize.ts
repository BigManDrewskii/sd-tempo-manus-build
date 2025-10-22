import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows safe HTML tags but removes scripts and dangerous attributes
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/**
 * Sanitize plain text by removing all HTML tags
 * Use for fields that should never contain HTML
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize an object's string fields recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T, htmlFields: string[] = []): T {
  const sanitized: any = { ...obj };
  
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      // Use HTML sanitization for specified fields, text sanitization for others
      sanitized[key] = htmlFields.includes(key) 
        ? sanitizeHtml(value)
        : sanitizeText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? sanitizeObject(item, htmlFields)
          : typeof item === 'string'
          ? sanitizeText(item)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, htmlFields);
    }
  }
  
  return sanitized as T;
}

