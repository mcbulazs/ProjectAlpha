CREATE OR REPLACE FUNCTION SET_RECORD_LOG()
RETURNS TRIGGER AS $$
BEGIN
    NEW.Record_Log := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION apply_record_log_trigger()
RETURNS VOID AS $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') LOOP
        EXECUTE format('
            CREATE TRIGGER %I_SET_RECORD_LOG
            BEFORE INSERT ON %I
            FOR EACH ROW
            EXECUTE FUNCTION SET_RECORD_LOG();', table_name, table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Call the function to apply triggers to all tables
SELECT apply_record_log_trigger();