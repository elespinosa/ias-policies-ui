alter table policies add ref_policy_number varchar(30) DEFAULT NULL AFTER policy_number;
alter table policies add insured_properties text DEFAULT NULL AFTER deductible_amount;

alter table policies add currency_code CHAR(3) NULL AFTER product_id;
UPDATE policies SET currency_code = 'PHP';
alter table policies MODIFY currency_code CHAR(3) NOT NULL;

alter table policies add currency_rate DECIMAL(15,6) NULL AFTER currency_code;
UPDATE policies SET currency_rate = 1.0;
alter table policies MODIFY currency_rate DECIMAL(15,6) NOT NULL;

alter table policies add partner_id INT NULL AFTER client_id;
UPDATE policies e
  JOIN insurance_products d
	ON e.product_id = d.id
   SET e.partner_id = d.partner_id;

alter table policies MODIFY partner_id INT NOT NULL;

-- Remove column if it exists
ALTER TABLE policies DROP COLUMN beneficiaries;