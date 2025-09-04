ALTER TABLE payments MODIFY COLUMN payment_method enum('credit_card','debit_card','bank_transfer','check','cash','other') NULL;
ALTER TABLE payments DROP COLUMN date;
