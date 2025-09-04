DROP PROCEDURE IF EXISTS apply_payment;

DELIMITER //
CREATE PROCEDURE apply_payment (
	IN	p_policy_id			INT,
	IN	p_amount			DECIMAL(10, 2),
    IN	p_reference_no		TEXT,
    IN	p_payment_date		TEXT
)
BEGIN
    DECLARE v_total_amount		DECIMAL(10, 2);
    DECLARE v_premium_amount	DECIMAL(10, 2);
    DECLARE v_due_date			DATE;
    DECLARE	v_payment_number	VARCHAR(30);
    DECLARE v_client_id			INT;

	SELECT CASE WHEN SUM(amount) IS NULL THEN 0 ELSE SUM(amount) END total_amount
      INTO v_total_amount
	  FROM payment_listing_v
	 WHERE policy_id = p_policy_id;

	SELECT client_id, premium_amount * currency_rate, DATE_ADD(effective_date, INTERVAL 90 DAY)
      INTO v_client_id, v_premium_amount, v_due_date
      FROM policies
	 WHERE id = p_policy_id;

	IF v_premium_amount - v_total_amount > 0 THEN
		SET v_payment_number = CONCAT(
			'PMT',
			LPAD(FLOOR(RAND() * 100000000), 9, '0'),
			LPAD(FLOOR(RAND() * 100000000), 9, '0'),
			LPAD(FLOOR(RAND() * 100000000), 9, '0')
		);

		INSERT INTO payments
        (payment_number, policy_id, client_id, amount, payment_date,
         due_date, payment_method, payment_status, transaction_reference,
         payment_period_start, payment_period_end, notes, processed_by,
         created_at, updated_at)
        VALUES
        (v_payment_number, p_policy_id, v_client_id, p_amount, p_payment_date,
         v_due_date, NULL, 'for_remittance', p_reference_no,
         NULL, NULL, NULL, NULL,
         CURDATE(), CURDATE());
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'premium_amount_already_paid';
    END IF;
END //
DELIMITER ;