-- AlterTable
ALTER TABLE `users` ADD COLUMN `username` VARCHAR(191) NULL,
    ADD COLUMN `nickname` VARCHAR(191) NULL,
    ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `deal_score` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tier` ENUM('DEAL_HUNTER', 'DEAL_SCOUT', 'DEAL_MASTER', 'DEAL_LEGEND') NOT NULL DEFAULT 'DEAL_HUNTER',
    ADD COLUMN `expertise_tags` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_username_key` ON `users`(`username`);
CREATE INDEX `users_deal_score_idx` ON `users`(`deal_score`);
CREATE INDEX `users_tier_idx` ON `users`(`tier`);

-- AlterTable
ALTER TABLE `board_posts` ADD COLUMN `post_type` ENUM('DISCUSSION', 'DEAL', 'REVIEW', 'POLL', 'FLASH_ALERT') NOT NULL DEFAULT 'DISCUSSION',
    ADD COLUMN `deal_price` DECIMAL(12, 2) NULL,
    ADD COLUMN `affiliate_url` TEXT NULL,
    ADD COLUMN `platform` VARCHAR(191) NULL;
