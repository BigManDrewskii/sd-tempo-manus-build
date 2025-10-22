CREATE INDEX `idx_proposals_user_id` ON `proposals` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_proposals_status` ON `proposals` (`status`);--> statement-breakpoint
CREATE INDEX `idx_proposals_valid_until` ON `proposals` (`validUntil`);--> statement-breakpoint
CREATE INDEX `idx_proposals_deleted_at` ON `proposals` (`deletedAt`);--> statement-breakpoint
CREATE INDEX `idx_proposals_client_name` ON `proposals` (`clientName`);