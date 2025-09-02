CREATE TABLE `currencies` (
	`id`			INT AUTO_INCREMENT PRIMARY KEY,
    `currency_code`	CHAR(3) NOT NULL UNIQUE,
    `currency_name`	VARCHAR(50) NOT NULL,
    `symbol`		VARCHAR(10),
    `currency_rate`	DECIMAL(15,6) NOT NULL,
    `created_at`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO currencies (currency_code, currency_name, symbol, currency_rate)
VALUES
('PHP', 'Philippine Peso', '₱', 1.000000),
('USD', 'US Dollar', '$', 56.250000), -- 1 USD = 56.25 PHP
('EUR', 'Euro', '€', 61.150000), -- 1 EUR = 61.15 PHP
('JPY', 'Japanese Yen', '¥', 0.380000); -- 1 JPY = 0.38 PHP