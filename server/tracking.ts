import { Router } from 'express';
import * as db from './db';
import { notifyOwner } from './_core/notification';

const router = Router();

/**
 * Tracking pixel endpoint - tracks email opens
 * GET /api/track/open/:trackingToken
 */
router.get('/open/:trackingToken', async (req, res) => {
  try {
    const { trackingToken } = req.params;
    
    // Get delivery record
    const delivery = await db.getEmailDeliveryByToken(trackingToken);
    
    if (delivery) {
      // Mark as opened (only updates if not already opened)
      const wasNotOpened = !delivery.openedAt;
      await db.markEmailAsOpened(trackingToken);
      
      // Track event
      await db.createEmailTrackingEvent({
        deliveryId: delivery.id,
        eventType: 'open',
        eventData: {},
        ipAddress: req.ip || req.connection.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      });
      
      // Send notification to owner (only on first open)
      if (wasNotOpened) {
        const proposal = await db.getProposalById(delivery.proposalId);
        const user = await db.getUser(String(delivery.userId));
        
        if (proposal && user) {
          await notifyOwner({
            title: 'Proposal Email Opened',
            content: `${delivery.recipientEmail} opened your proposal "${proposal.title}"`,
          });
        }
      }
    }
    
    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    
    res.set({
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    
    res.send(pixel);
  } catch (error) {
    console.error('[Tracking] Error tracking email open:', error);
    
    // Still return pixel even on error
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    res.set('Content-Type', 'image/gif');
    res.send(pixel);
  }
});

/**
 * View tracking endpoint - tracks proposal views from email
 * POST /api/track/view/:trackingToken
 */
router.post('/view/:trackingToken', async (req, res) => {
  try {
    const { trackingToken } = req.params;
    
    // Get delivery record
    const delivery = await db.getEmailDeliveryByToken(trackingToken);
    
    if (delivery) {
      // Mark as viewed
      const wasNotViewed = !delivery.lastViewedAt;
      await db.markEmailAsViewed(trackingToken);
      
      // Track event
      await db.createEmailTrackingEvent({
        deliveryId: delivery.id,
        eventType: 'view',
        eventData: {},
        ipAddress: req.ip || req.connection.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      });
      
      // Send notification to owner (only on first view)
      if (wasNotViewed) {
        const proposal = await db.getProposalById(delivery.proposalId);
        
        if (proposal) {
          await notifyOwner({
            title: 'Proposal Viewed',
            content: `${delivery.recipientEmail} is viewing your proposal "${proposal.title}"`,
          });
        }
      }
      
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Tracking token not found' });
    }
  } catch (error) {
    console.error('[Tracking] Error tracking view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Time tracking endpoint - tracks time spent viewing proposal
 * POST /api/track/time/:trackingToken
 */
router.post('/time/:trackingToken', async (req, res) => {
  try {
    const { trackingToken } = req.params;
    const { timeSpent } = req.body; // in seconds
    
    if (!timeSpent || typeof timeSpent !== 'number') {
      return res.status(400).json({ error: 'Invalid timeSpent value' });
    }
    
    // Get delivery record
    const delivery = await db.getEmailDeliveryByToken(trackingToken);
    
    if (delivery) {
      // Update time spent
      await db.updateEmailTimeSpent(trackingToken, timeSpent);
      
      // Track event
      await db.createEmailTrackingEvent({
        deliveryId: delivery.id,
        eventType: 'time_update',
        eventData: { timeSpent },
        ipAddress: req.ip || req.connection.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      });
      
      // Send notification if spent >5 minutes (300 seconds)
      const totalTime = delivery.totalTimeSpent + timeSpent;
      if (delivery.totalTimeSpent < 300 && totalTime >= 300) {
        const proposal = await db.getProposalById(delivery.proposalId);
        
        if (proposal) {
          await notifyOwner({
            title: 'High Engagement Alert',
            content: `${delivery.recipientEmail} has spent over 5 minutes viewing "${proposal.title}"`,
          });
        }
      }
      
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Tracking token not found' });
    }
  } catch (error) {
    console.error('[Tracking] Error tracking time:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Scroll tracking endpoint - tracks scroll depth
 * POST /api/track/scroll/:trackingToken
 */
router.post('/scroll/:trackingToken', async (req, res) => {
  try {
    const { trackingToken } = req.params;
    const { scrollDepth } = req.body; // percentage 0-100
    
    // Get delivery record
    const delivery = await db.getEmailDeliveryByToken(trackingToken);
    
    if (delivery) {
      // Track event
      await db.createEmailTrackingEvent({
        deliveryId: delivery.id,
        eventType: 'scroll',
        eventData: { scrollDepth },
        ipAddress: req.ip || req.connection.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      });
      
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Tracking token not found' });
    }
  } catch (error) {
    console.error('[Tracking] Error tracking scroll:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

