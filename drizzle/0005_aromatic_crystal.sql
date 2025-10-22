CREATE TABLE `userBranding` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`logoUrl` varchar(500),
	`primaryColor` varchar(7) NOT NULL DEFAULT '#644a40',
	`secondaryColor` varchar(7) NOT NULL DEFAULT '#ffdfb5',
	`accentColor` varchar(7) NOT NULL DEFAULT '#ffffff',
	`fontFamily` varchar(100) NOT NULL DEFAULT 'Inter',
	`companyName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userBranding_id` PRIMARY KEY(`id`)
);
