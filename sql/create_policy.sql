DROP PROCEDURE IF EXISTS create_policy;

DELIMITER //

CREATE PROCEDURE `create_policy`(
	IN `json_payload` JSON,
	OUT `policy_id` INT UNSIGNED
)
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
BEGIN
    -- Declare local variables
    DECLARE commission_amount 	DECIMAL(10,2);
    DECLARE v_message			TEXT;
    DECLARE v_policy_number		VARCHAR(30);
    DECLARE	v_is_inserting		VARCHAR(1);
    DECLARE	v_exists			VARCHAR(1);

    -- Begin transaction for consistency
    START TRANSACTION;

	SET policy_id = JSON_EXTRACT(json_payload, '$.policy_id');

	IF policy_id IS NOT NULL THEN
		UPDATE policies
		   SET premium_amount = JSON_EXTRACT(json_payload, '$.premium_amount'),
			   coverage_amount = JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.coverage_amount')),
			   deductible_amount = JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.deductible_amount')),
			   effective_date = JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.effective_date')),
               expiration_date = JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.expiration_date')),
               payment_frequency = JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.payment_frequency')),
               payment_method_id = JSON_EXTRACT(json_payload, '$.payment_method_id'),
               auto_renewal = COALESCE(JSON_EXTRACT(json_payload, '$.auto_renewal'), TRUE),
               insured_properties = JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.insured_properties')),
               underwriting_notes = JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.underwriting_notes')),
               updated_at = NOW()
		 WHERE id = policy_id;

		SET v_is_inserting = 'N';
    ELSE
		SET v_policy_number = CONCAT(
			'POL',
			LPAD(FLOOR(RAND() * 100000000), 9, '0'),
			LPAD(FLOOR(RAND() * 100000000), 9, '0'),
			LPAD(FLOOR(RAND() * 100000000), 9, '0')
		);

		SELECT 'Y'
          INTO v_exists
          FROM currencies
		 WHERE currency_code = JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.currency_code'));

		IF v_exists IS NULL OR v_exists <> 'Y'
        THEN
			SET v_message = CONCAT('IAS Exception: ', 'Invalid Currency ', JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.currency_code')));
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_message;
        END IF;

		-- Insert policy data from JSON
		INSERT INTO policies (
			policy_number,
			client_id,
			product_id,
            partner_id,
            currency_code,
            currency_rate,
			premium_amount,
			coverage_amount,
			deductible_amount,
			status,
			effective_date,
			expiration_date,
			cancellation_date,
			cancellation_reason,
			payment_frequency,
			payment_method_id,
			auto_renewal,
            insured_properties,
			underwriting_notes,
			agent_id,
			commission_rate,
            created_at,
            updated_at
		)
		VALUES (
			v_policy_number,
			JSON_EXTRACT(json_payload, '$.client_id'),
			JSON_EXTRACT(json_payload, '$.product_id'),
			JSON_EXTRACT(json_payload, '$.partner_id'),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.currency_code')),
			JSON_EXTRACT(json_payload, '$.currency_rate'),
			JSON_EXTRACT(json_payload, '$.premium_amount'),
			JSON_EXTRACT(json_payload, '$.coverage_amount'),
			JSON_EXTRACT(json_payload, '$.deductible_amount'),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.status')),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.effective_date')),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.expiration_date')),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.cancellation_date')),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.cancellation_reason')),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.payment_frequency')),
			JSON_EXTRACT(json_payload, '$.payment_method_id'),
			COALESCE(JSON_EXTRACT(json_payload, '$.auto_renewal'), TRUE),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.insured_properties')),
			JSON_UNQUOTE(JSON_EXTRACT(json_payload, '$.underwriting_notes')),
			JSON_EXTRACT(json_payload, '$.agent_id'),
			JSON_EXTRACT(json_payload, '$.commission_rate'),
            NOW(),
            NOW()
		);
		
		-- Get the ID of the inserted policy
		SET policy_id = LAST_INSERT_ID();
		SET v_is_inserting = 'Y';
    END IF;

	IF v_is_inserting = 'Y' AND JSON_EXTRACT(json_payload, '$.quote_id') IS NOT NULL THEN
		UPDATE quotes
           SET status = 'converted',
			   updated_at = NOW()
		 WHERE id = JSON_EXTRACT(json_payload, '$.quote_id');
    END IF;

	IF v_is_inserting = 'Y' THEN
		-- Process commissions array if it exists
		IF JSON_EXTRACT(json_payload, '$.commissions') IS NOT NULL THEN
			INSERT INTO commissions (
				agent_id,
				policy_id,
				payment_id,
				commission_type,
				amount,
				rate,
				status,
				transaction_date,
				payment_date,
				notes
			)
			SELECT 
				COALESCE(JSON_EXTRACT(commission_data, '$.agent_id'), JSON_EXTRACT(json_payload, '$.agent_id')),
				policy_id,
				JSON_EXTRACT(commission_data, '$.payment_id'),
				JSON_UNQUOTE(JSON_EXTRACT(commission_data, '$.commission_type')),
				JSON_EXTRACT(commission_data, '$.amount'),
				COALESCE(JSON_EXTRACT(commission_data, '$.rate'), JSON_EXTRACT(json_payload, '$.commission_rate')),
				COALESCE(JSON_UNQUOTE(JSON_EXTRACT(commission_data, '$.status')), 'pending'),
				COALESCE(JSON_UNQUOTE(JSON_EXTRACT(commission_data, '$.transaction_date')), CURDATE()),
				JSON_UNQUOTE(JSON_EXTRACT(commission_data, '$.payment_date')),
				JSON_UNQUOTE(JSON_EXTRACT(commission_data, '$.notes'))
			FROM JSON_TABLE(
				JSON_EXTRACT(json_payload, '$.commissions'),
				'$[*]' COLUMNS (
					commission_data JSON PATH '$'
				)
			) AS commission_records;
		ELSE
			-- If no commissions array is provided but there's an agent_id, create a default commission record
			IF JSON_EXTRACT(json_payload, '$.agent_id') IS NOT NULL 
			   AND JSON_EXTRACT(json_payload, '$.commission_rate') IS NOT NULL THEN
				-- Calculate commission amount based on premium and rate
				SET commission_amount = 
					(JSON_EXTRACT(json_payload, '$.premium_amount') * JSON_EXTRACT(json_payload, '$.commission_rate')) / 100;

				INSERT INTO commissions (
					agent_id,
					policy_id,
					commission_type,
					amount,
					rate,
					status,
					transaction_date
				)
				VALUES (
					JSON_EXTRACT(json_payload, '$.agent_id'),
					policy_id,
					'new_business',
					commission_amount,
					JSON_EXTRACT(json_payload, '$.commission_rate'),
					'for_collection',
					CURDATE()
				);
			END IF;
		END IF;
    END IF;

    COMMIT;
END //

DELIMITER ;