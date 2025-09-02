DELIMITER //
CREATE PROCEDURE update_policy (
	IN	p_policy_id			INT,
    IN	p_start_date		VARCHAR(10),
    IN	p_end_date			VARCHAR(10),
	IN	p_premium_amt		DECIMAL,
    IN	p_coverage_amt		DECIMAL,
    IN	p_deductible_amt	DECIMAL,
    IN	p_beneficiaries		TEXT,
    IN	p_uw_notes			TEXT
)
BEGIN
	DECLARE v_policy_exists	VARCHAR(1);

	SET v_policy_exists = NULL;
    SELECT 'Y'
      INTO v_policy_exists
      FROM policies
     WHERE id = p_policy_id;

	IF v_policy_exists IS NULL OR v_policy_exists <> 'Y'
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'policy_does_not_exists';
    END IF;

	UPDATE policies
	SET effective_date = str_to_date(p_start_date, '%Y-%m-%d'),
		expiration_date = str_to_date(p_end_date, '%Y-%m-%d'),
        premium_amount = p_premium_amt,
        coverage_amount = p_coverage_amt,
        deductible_amount = p_deductible_amt,
        insured_properties = p_insured_properties,
        underwriting_notes = p_uw_notes
	WHERE id = p_policy_id;
END //

DELIMITER ;