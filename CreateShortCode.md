33333////////////


INSERT INTO shortcode (short_code, created_at, expires_at)
WITH RECURSIVE seq AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1
    FROM seq
    WHERE n < 46655   -- 36^3 - 1
)
SELECT
    code,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT
        LPAD(UPPER(CONV(n, 10, 36)), 3, '0') AS code
    FROM seq
) t
WHERE
    SUBSTRING(code, 1, 1) <> SUBSTRING(code, 2, 1)
AND SUBSTRING(code, 1, 1) <> SUBSTRING(code, 3, 1)
AND SUBSTRING(code, 2, 1) <> SUBSTRING(code, 3, 1);





444444444444444444444444444

INSERT INTO shortcode (short_code, created_at, expires_at)
WITH RECURSIVE seq AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1
    FROM seq
    WHERE n < 1679615   -- 36^4 - 1
)
SELECT
    code,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT
        LPAD(UPPER(CONV(n, 10, 36)), 4, '0') AS code
    FROM seq
) t
WHERE
    SUBSTRING(code,1,1) <> SUBSTRING(code,2,1)
AND SUBSTRING(code,1,1) <> SUBSTRING(code,3,1)
AND SUBSTRING(code,1,1) <> SUBSTRING(code,4,1)
AND SUBSTRING(code,2,1) <> SUBSTRING(code,3,1)
AND SUBSTRING(code,2,1) <> SUBSTRING(code,4,1)
AND SUBSTRING(code,3,1) <> SUBSTRING(code,4,1);





5555555555555555555555555555555555555


INSERT INTO shortcode (short_code, created_at, expires_at)
WITH RECURSIVE seq AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1
    FROM seq
    WHERE n < 60466175   -- 36^5 - 1
)
SELECT
    code,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT
        LPAD(UPPER(CONV(n, 10, 36)), 5, '0') AS code
    FROM seq
) t
WHERE
    SUBSTRING(code,1,1) <> SUBSTRING(code,2,1)
AND SUBSTRING(code,1,1) <> SUBSTRING(code,3,1)
AND SUBSTRING(code,1,1) <> SUBSTRING(code,4,1)
AND SUBSTRING(code,1,1) <> SUBSTRING(code,5,1)
AND SUBSTRING(code,2,1) <> SUBSTRING(code,3,1)
AND SUBSTRING(code,2,1) <> SUBSTRING(code,4,1)
AND SUBSTRING(code,2,1) <> SUBSTRING(code,5,1)
AND SUBSTRING(code,3,1) <> SUBSTRING(code,4,1)
AND SUBSTRING(code,3,1) <> SUBSTRING(code,5,1)
AND SUBSTRING(code,4,1) <> SUBSTRING(code,5,1);



santosh