SELECT n.nspname as schema, t.typname as type 
FROM pg_type t 
LEFT JOIN pg_namespace n ON n.oid = t.typnamespace 
WHERE t.typtype = 'e' AND n.nspname = 'public';
