-- Extend banner placements and ad tracking fields
ALTER TABLE `banners`
  MODIFY `placement` ENUM('HERO', 'HOME_MID', 'SEARCH_TOP', 'CATEGORY_TOP', 'PRODUCT_INLINE') NOT NULL DEFAULT 'HERO',
  ADD COLUMN `sponsor_name` VARCHAR(191) NULL,
  ADD COLUMN `starts_at` DATETIME(3) NULL,
  ADD COLUMN `ends_at` DATETIME(3) NULL,
  ADD COLUMN `impressions` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `clicks` INTEGER NOT NULL DEFAULT 0;
