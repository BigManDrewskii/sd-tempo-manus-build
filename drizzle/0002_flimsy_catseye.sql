CREATE TABLE `templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`industry` enum('web-design','consulting','saas','marketing','mobile-app','ecommerce') NOT NULL,
	`thumbnail` varchar(500),
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdBy` int,
	`problems` json NOT NULL,
	`solutionPhases` json NOT NULL,
	`deliverables` json NOT NULL,
	`caseStudies` json NOT NULL,
	`pricingTiers` json NOT NULL,
	`addOns` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
