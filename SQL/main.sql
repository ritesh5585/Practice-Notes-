--  how can we create a table in SQL?
CREATE TABLE departments(
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL
);
INSERT INTO departments (department_name)
vALUES
('Sales'),
('Support'),
('Warehouse');

CREATE TABLE employees(
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    mobile VARCHAR(12) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    bio TEXT,
    job_title VARCHAR(50) NOT NULL,
    salary INT NOT NULL CHECK (salary > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    hire_date DATE,
    last_login TIMESTAMP,
    emplyee_status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK(
        emplyee_status IN ('active', 'on_leave', 'terminated')
    ),
    department_id INT REFERENCES departments(department_id),
    manager_id INT REFERENCES employees(employee_id)
)

 --insert data into tables
INSERT INTO employees (
        first_name,
        last_name,
        mobile,
        email,
        bio,
        job_title,
        salary,
        is_active,
        hire_date,
        last_login,
        emplyee_status,
        department_id,
        manager_id
    )
VALUES (
        'Rahul',
        'Sharma',
        '9876543210',
        'rahul@company.com',
        'Team lead with 8 years of experience in backend development.',
        'Engineering Manager',
        120000,
        TRUE,
        '2018-04-10',
        '2024-06-01 09:15:00',
        'active',
        1,
        NULL
    );

INSERT INTO employees (
        first_name,
        last_name,
        mobile,
        email,
        bio,
        job_title,
        salary,
        is_active,
        hire_date,
        last_login,
        emplyee_status,
        department_id,
        manager_id
    )
VALUES (
        'Priya',
        'Verma',
        '9876543211',
        'priya@company.com',
        'Frontend developer skilled in React and TypeScript.',
        'Frontend Developer',
        75000,
        TRUE,
        '2021-07-01',
        '2024-06-02 10:00:00',
        'active',
        1,
        (
            SELECT employee_id
            FROM employees
            WHERE email = 'rahul@company.com'
        )
    ),
    (
        'Amit',
        'Kumar',
        '9876543212',
        'amit@company.com',
        'Backend developer working on microservices architecture.',
        'Backend Developer',
        80000,
        TRUE,
        '2020-01-15',
        '2024-06-02 11:30:00',
        'active',
        1,
        (
            SELECT employee_id
            FROM employees
            WHERE email = 'rahul@company.com'
        )
    ),
    (
        'Sneha',
        'Patel',
        '9876543213',
        'sneha@company.com',
        'QA engineer focused on automation testing using Selenium.',
        'QA Engineer',
        65000,
        TRUE,
        '2022-09-05',
        '2024-06-03 09:45:00',
        'on_leave',
        2,
        (
            SELECT employee_id
            FROM employees
            WHERE email = 'rahul@company.com'
        )
    ),
    (
        'Vikram',
        'Singh',
        '9876543214',
        'vikram@company.com',
        'DevOps engineer handling CI/CD pipelines and AWS infra.',
        'DevOps Engineer',
        95000,
        FALSE,
        '2019-11-20',
        '2024-05-28 18:20:00',
        'terminated',
        2,
        (
            SELECT employee_id
            FROM employees
            WHERE email = 'rahul@company.com'
        )
    );

-- get all data
SELECT *
FROM employees

-- get specific data
SELECT employee_id,
    first_name,
    email
FROM employees;

-- add colum to table employee
ALTER TABLE employees
ADD COLUMN internal_notes VARCHAR(100) NOT NULL DEFAULT 'N/A'

-- rename the column name 
ALTER table employees
rename column internal_notes to hr_notes

-- delete the column from table 
alter table employees
drop column  hr_notes