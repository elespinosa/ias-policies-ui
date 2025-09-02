CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `policy_listing_v` AS
    SELECT 
        `a`.`id` AS `id`,
        `a`.`client_id` AS `client_id`,
        `a`.`policy_number` AS `policy_number`,
        `a`.`ref_policy_number` AS `ref_policy_number`,
        `a`.`currency_code` AS `currency_code`,
        `a`.`currency_rate` AS `currency_rate`,
        `a`.`product_id` AS `product_id`,
        `b`.`type` AS `type`,
        `c`.`client_type` AS `client_type`,
        `c`.`first_name` AS `first_name`,
        `c`.`last_name` AS `last_name`,
        `c`.`company_name` AS `company_name`,
        (CASE
            WHEN (`c`.`client_type` = 'individual') THEN CONCAT(`c`.`first_name`, ' ', `c`.`last_name`)
            ELSE `c`.`company_name`
        END) AS `client_name`,
        `a`.`status` AS `status`,
        `a`.`effective_date` AS `effective_date`,
        `a`.`expiration_date` AS `expiration_date`,
        `a`.`premium_amount` AS `premium`,
        `a`.`coverage_amount` AS `coverage`,
        `a`.`deductible_amount` AS `deductible`,
        `a`.`insured_properties` AS `insured_properties`,
        `a`.`cancellation_date` AS `cancellation_date`,
        `a`.`cancellation_reason` AS `cancellation_reason`,
        `a`.`payment_frequency` AS `payment_frequency`,
        `a`.`payment_method_id` AS `payment_method_id`,
        `a`.`auto_renewal` AS `auto_renewal`,
        `a`.`agent_id` AS `agent_id`,
        `a`.`commission_rate` AS `commission_rate`,
        `a`.`underwriting_notes` AS `underwriting_notes`,
        `a`.`created_at` AS `date_created`,
        `a`.`updated_at` AS `updated_at`,
        `c`.`preferred_communication` AS `preferred_communication`,
        `c`.`billing_address` AS `billing_address`,
        `c`.`mobile_phone` AS `mobile_phone`,
        `c`.`landline_phone` AS `landline_phone`,
        `c`.`email` AS `email`,
        `d`.`partner_name` AS `partner_name`,
        `d`.`id` AS `partner_id`,
        `b`.`name` AS `product_name`
    FROM
        (((`policies` `a`
        LEFT JOIN `insurance_products` `b` ON ((`a`.`product_id` = `b`.`id`)))
        LEFT JOIN `clients` `c` ON ((`a`.`client_id` = `c`.`id`)))
        LEFT JOIN `partners` `d` ON ((`a`.`partner_id` = `d`.`id`)))