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
    tbl_row RECORD;  
    current_table_name TEXT;  -- Change here
BEGIN
    FOR tbl_row IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') 
    LOOP
        current_table_name := tbl_row.table_name;  -- Change here
        EXECUTE format('
            CREATE TRIGGER %I_SET_RECORD_LOG
            BEFORE INSERT ON %I
            FOR EACH ROW
            EXECUTE FUNCTION SET_RECORD_LOG();', current_table_name, current_table_name);  -- Change here
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Call the function to apply triggers to all tables
SELECT apply_record_log_trigger();



--creating default values

INSERT INTO USERS VALUES (DEFAULT, DEFAULT, 'admin','$2a$08$LZ8Hmw5hGlRZENJwReQcx.hx1vEDP0xpjMA29pNXinqfW32kg/C7i');
INSERT INTO allowed_origins VALUES (DEFAULT, DEFAULT, 'http://localhost:4200');