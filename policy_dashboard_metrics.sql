CREATE ALGORITHM=UNDEFINED 
DEFINER=`root`@`localhost` 
SQL SECURITY DEFINER 
VIEW `policy_dashboard_metrics` AS

WITH 
  `date_ref` AS (
    SELECT 
      CURDATE() AS `today`,
      DATE_FORMAT(CURDATE(), '%Y-%m-01') AS `month_start`,
      LAST_DAY(CURDATE() - INTERVAL 1 MONTH) AS `last_month_end`,
      DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') AS `last_month_start`,
      CURDATE() + INTERVAL 30 DAY AS `next_30_days`
  ),

  `total_policies` AS (
    SELECT 
      'total_policies' AS `type`,
      COUNT(0) AS `current_count`,
      COUNT(CASE WHEN `policies`.`created_at` >= `dr`.`month_start` THEN 1 END) AS `this_month_count`,
      COUNT(CASE WHEN `policies`.`created_at` BETWEEN `dr`.`last_month_start` AND `dr`.`last_month_end` THEN 1 END) AS `last_month_count`
    FROM `policies`
    JOIN `date_ref` `dr`
  ),

  `active_policies` AS (
    SELECT 
      'active_policies' AS `type`,
      COUNT(0) AS `current_count`,
      COUNT(CASE WHEN `policies`.`created_at` >= `dr`.`month_start` AND `policies`.`status` = 'active' THEN 1 END) AS `this_month_count`,
      COUNT(CASE WHEN `policies`.`created_at` BETWEEN `dr`.`last_month_start` AND `dr`.`last_month_end` AND `policies`.`status` = 'active' THEN 1 END) AS `last_month_count`
    FROM `policies`
    JOIN `date_ref` `dr`
    WHERE `policies`.`status` = 'active'
  ),

  `for_renewal` AS (
    SELECT 
      'for_renewal' AS `type`,
      COUNT(CASE 
        WHEN `policies`.`status` = 'active' AND `policies`.`auto_renewal` = 0 AND `policies`.`expiration_date` BETWEEN `dr`.`today` AND `dr`.`next_30_days` 
        THEN 1 
      END) AS `current_count`,
      COUNT(CASE 
        WHEN `policies`.`status` = 'active' AND `policies`.`auto_renewal` = 0 AND `policies`.`expiration_date` BETWEEN `dr`.`month_start` AND LAST_DAY(`dr`.`month_start`) 
        THEN 1 
      END) AS `this_month_count`,
      COUNT(CASE 
        WHEN `policies`.`status` = 'active' AND `policies`.`auto_renewal` = 0 AND `policies`.`expiration_date` BETWEEN `dr`.`last_month_start` AND `dr`.`last_month_end` 
        THEN 1 
      END) AS `last_month_count`
    FROM `policies`
    JOIN `date_ref` `dr`
  ),

  `premium_month` AS (
    SELECT 
      'premium_month' AS `type`,
      ROUND(SUM(CASE 
        WHEN `policies`.`status` = 'active' AND `policies`.`created_at` >= `dr`.`month_start` 
        THEN `policies`.`premium_amount` 
        ELSE 0 
      END), 2) AS `current_count`,
      ROUND(SUM(CASE 
        WHEN `policies`.`status` = 'active' AND `policies`.`created_at` >= `dr`.`month_start` 
        THEN `policies`.`premium_amount` 
        ELSE 0 
      END), 2) AS `this_month_count`,
      ROUND(SUM(CASE 
        WHEN `policies`.`status` = 'active' AND `policies`.`created_at` BETWEEN `dr`.`last_month_start` AND `dr`.`last_month_end` 
        THEN `policies`.`premium_amount` 
        ELSE 0 
      END), 2) AS `last_month_count`
    FROM `policies`
    JOIN `date_ref` `dr`
  ),

  `combined` AS (
    SELECT `type`, `current_count`, `this_month_count`, `last_month_count` FROM `total_policies`
    UNION ALL
    SELECT `type`, `current_count`, `this_month_count`, `last_month_count` FROM `active_policies`
    UNION ALL
    SELECT `type`, `current_count`, `this_month_count`, `last_month_count` FROM `for_renewal`
    UNION ALL
    SELECT `type`, `current_count`, `this_month_count`, `last_month_count` FROM `premium_month`
  )

SELECT 
  `combined`.`type` AS `type`,
  CASE 
    WHEN `combined`.`type` = 'premium_month' THEN `combined`.`current_count`
    ELSE CAST(`combined`.`current_count` AS UNSIGNED)
  END AS `value`,
  CASE 
    WHEN COALESCE(`combined`.`last_month_count`, 0) = 0 AND COALESCE(`combined`.`this_month_count`, 0) > 0 THEN 100.00
    WHEN COALESCE(`combined`.`last_month_count`, 0) = 0 THEN NULL
    ELSE ROUND(((`combined`.`this_month_count` - `combined`.`last_month_count`) / `combined`.`last_month_count`) * 100, 2)
  END AS `percent_change`
FROM `combined`;
