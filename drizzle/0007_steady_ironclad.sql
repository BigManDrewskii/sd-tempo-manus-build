CREATE TABLE `emailDeliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`userId` int NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`recipientName` varchar(255),
	`subject` text NOT NULL,
	`message` text,
	`trackingToken` varchar(64) NOT NULL,
	`status` enum('pending','sent','opened','viewed','signed','failed') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`openedAt` timestamp,
	`lastViewedAt` timestamp,
	`viewCount` int NOT NULL DEFAULT 0,
	`totalTimeSpent` int NOT NULL DEFAULT 0,
	`reminderSent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailDeliveries_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailDeliveries_trackingToken_unique` UNIQUE(`trackingToken`)
);
--> statement-breakpoint
CREATE TABLE `emailTrackingEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deliveryId` int NOT NULL,
	`eventType` enum('open','view','scroll','interaction','time_update') NOT NULL,
	`eventData` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailTrackingEvents_id` PRIMARY KEY(`id`)
);
