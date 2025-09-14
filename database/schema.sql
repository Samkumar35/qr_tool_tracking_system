CREATE TABLE operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'operator'
);

CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    current_operator_id UUID REFERENCES operators(id) DEFAULT NULL,
    purchase_date DATE,
    last_maintenance_date DATE,
    total_usage_duration INTERVAL DEFAULT '0 hours',
    is_archived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES tools(id),
    operator_id UUID REFERENCES operators(id),
    transaction_type VARCHAR(20) NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT now(),
    condition_on_issue VARCHAR(50), -- This column has been added
    condition_on_return VARCHAR(50),
    notes TEXT
);