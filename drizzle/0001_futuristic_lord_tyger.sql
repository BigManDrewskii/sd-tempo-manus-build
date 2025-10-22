CREATE TABLE `engagementEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`eventType` enum('section_viewed','pricing_changed','addon_toggled','signature_started','form_filled') NOT NULL,
	`eventData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `engagementEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposalViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`viewerEmail` varchar(320),
	`viewerIp` varchar(45),
	`sessionId` varchar(64) NOT NULL,
	`firstViewedAt` timestamp NOT NULL DEFAULT (now()),
	`lastViewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proposalViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`projectName` varchar(255) NOT NULL,
	`validUntil` timestamp NOT NULL,
	`problems` json NOT NULL,
	`solutionPhases` json NOT NULL,
	`deliverables` json NOT NULL,
	`caseStudies` json NOT NULL,
	`pricingTiers` json NOT NULL,
	`addOns` json NOT NULL,
	`status` enum('draft','sent','viewed','signed','expired') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`sentAt` timestamp,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `signatures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`signerName` varchar(255) NOT NULL,
	`signerEmail` varchar(320) NOT NULL,
	`signatureData` text NOT NULL,
	`selectedTier` varchar(100) NOT NULL,
	`selectedAddOns` json NOT NULL,
	`totalPrice` int NOT NULL,
	`ipAddress` varchar(45),
	`signedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `signatures_id` PRIMARY KEY(`id`),
	CONSTRAINT `signatures_proposalId_unique` UNIQUE(`proposalId`)
);
