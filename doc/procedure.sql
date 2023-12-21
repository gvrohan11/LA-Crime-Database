DELIMITER $$

CREATE DEFINER=`root`@`%` PROCEDURE `ProcPremis`(IN weapontype int, IN agenew int)
BEGIN
    DECLARE Premis_Cd_Var INT;
    DECLARE Premis_Desc_Var VARCHAR(100);
    DECLARE Num_Crimes_Var INT;
    DECLARE exitLoop BOOLEAN DEFAULT FALSE;
    DECLARE premisCur CURSOR FOR (SELECT Premis_Cd FROM premis);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET exitLoop=TRUE;

    DROP TABLE IF EXISTS premis_count;
    CREATE TABLE premis_count (
        Premis_Cd INT PRIMARY KEY,
        Premis_Desc VARCHAR(100),
        Num_Crimes INT
    );

    OPEN premisCur;

    loop_0: LOOP
        FETCH premisCur INTO Premis_Cd_Var;
        IF exitLoop THEN
            LEAVE loop_0;
        END IF;

        IF (weapontype = 106 or weapontype = 107) THEN
            SELECT count(DR_NO), Premis_Desc
            INTO Num_Crimes_Var, Premis_Desc_Var
            from crime c natural join premis p
            where (c.Weapon_Used_Cd BETWEEN 100 AND 199)
                and Vict_Age <= agenew and Premis_Cd = Premis_Cd_Var
            group by c.Premis_Cd;
        ELSE
            SELECT count(DR_NO), Premis_Desc
            INTO Num_Crimes_Var, Premis_Desc_Var
            from crime c natural join premis p
            where (c.Weapon_Used_Cd = weapontype)
                and Vict_Age <= agenew and c.Premis_Cd = Premis_Cd_Var
            group by c.Premis_Cd;
        END IF;

        INSERT INTO premis_count VALUES (Premis_Cd_Var, Premis_Desc_Var, Num_Crimes_Var);
    END LOOP loop_0;

    CLOSE premisCur;

    SELECT * FROM premis_count ORDER BY Num_Crimes DESC;
END$$

DELIMITER ;
