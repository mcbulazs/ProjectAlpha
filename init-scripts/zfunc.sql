CREATE OR REPLACE FUNCTION SET_CREATION_DATE()
RETURNS TRIGGER AS $$
BEGIN
    NEW.Creation_Date := NOW();
    NEW.Modification_Date := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION apply_creation_date_trigger()
RETURNS VOID AS $$
DECLARE
    tbl_row RECORD;  
    current_table_name TEXT;
BEGIN
    FOR tbl_row IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') 
    LOOP
        current_table_name := tbl_row.table_name; 
        EXECUTE format('
            CREATE TRIGGER %I_SET_CREATION_DATE
            BEFORE INSERT ON %I
            FOR EACH ROW
            EXECUTE FUNCTION SET_CREATION_DATE();', current_table_name, current_table_name); 
    END LOOP;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION SET_MODIFICATION_DATE()
RETURNS TRIGGER AS $$
BEGIN
    NEW.Modification_Date := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION apply_modification_date_trigger()
RETURNS VOID AS $$
DECLARE
    tbl_row RECORD;  
    current_table_name TEXT;
BEGIN
    FOR tbl_row IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') 
    LOOP
        current_table_name := tbl_row.table_name;  
        EXECUTE format('
            CREATE TRIGGER %I_SET_MODIFICATION_DATE
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION SET_MODIFICATION_DATE();', current_table_name, current_table_name);  
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- Call the function to apply triggers to all tables
SELECT apply_creation_date_trigger();
SELECT apply_modification_date_trigger();
