DELIMITER $$

CREATE TRIGGER errorChecking
AFTER INSERT ON selfreportcrime
FOR EACH ROW
BEGIN
    DECLARE err VARCHAR(10);
    IF LENGTH(NEW.Description) <= 1 THEN
        SET err = 'INVALID';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Description';
    END IF;

    IF LENGTH(NEW.Phone) != 10 THEN
        SET err = 'INVALID';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Phone Number';
    END IF;
END$$

DELIMITER ;
