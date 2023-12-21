var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
const cors = require('cors');
const e = require('express');

var app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next();
})

app.use(cors());

app.use(express.json());

app.get('/', function(req, res) {
  res.send({'message': 'Hello'});
});

app.listen(3001, function () {
  console.log('Node app is running on port 3001');
});

const db = mysql.createPool({
  host: '34.68.202.24',
  user: 'root',
  password: '1234',
  database: 'test'
});

app.get('/reportCrime', function(req,res) {
  var a = `select * from selfreportcrime`
  db.query(a, (err, result)=>{
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

app.post('/report', function(req,res) {
  console.log(req.body);
  var a = req.body.dateocc

  var findmax = `select max(ReportID)
                 from selfreportcrime`
  
  var insert2 = ` insert into selfreportcrime
  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

  db.query(findmax, (err, result) => {
    if (err) {
      console.log(err);
    } else  {
      console.log(result);
      var val = JSON.stringify(result[0]);
      var newValue = JSON.parse(val);
      var jsonValue = newValue['max(ReportID)']
      var newVal = jsonValue + 1

      console.log()

      db.query(insert2, [newVal, req.body.dateocc, req.body.location, req.body.crime, req.body.description, req.body.fname, req.body.lname, req.body.phone, req.body.email, "06DY5F"], (err1, result1) => {
        if (err1) {
            console.log(err1)
        } else {
            res.send(result1);
        }
      })
    }
  });

  var a = req.body.dateocc;
  var insert = `
  insert into selfreportcrime
  values (1+?, req.body.dateocc, req.body.location, req.body.crime, req.body.description, req.body.fname, req.body.lname, h, req.body.email, "")
  `
  /*
  db.query(findmax, (err, result) => {
    if (err) {
        console.log(err)
    } else {
        db.query(insert, [result], (err1, result1) => {
        if (err1) {
            console.log(err1)
        } else {
            res.send(result1);
        }
        }
        )
    }
  });
  */
});

app.post('/weaponsData', function(req, res) {
  console.log("Hey")
  console.log(req.body)

  var qr = `
  SELECT w.Weapon_Desc, count(w.Weapon_Used_Cd)/?*100 as percentage
  from crime c natural join crimetype c1 natural join subarea s2 natural join weaponinfo w
  where s2.AREA_NAME = ?
  group by w.Weapon_Used_Cd
  having 5 < count(c.DR_NO);
  `
  var before = `
  select count(w.Weapon_Used_Cd)
  from crime c natural join weaponinfo w natural join subarea s2
  where s2.AREA_NAME = ?`;

  db.query(before, [req.body.inputValue] ,(err, result) => {
    if (err) {
        console.log(err)
        res.status(500).send();
        return;
    }
    console.log(result);
    
    var val = JSON.stringify(result[0]);
    console.log(val);
    var newValue = JSON.parse(val);
    console.log(newValue);
    var jsonValue = newValue['count(w.Weapon_Used_Cd)']
    console.log(jsonValue);
    db.query(qr, [jsonValue, req.body.inputValue] ,(err1, result1) => {
      if (err1) {
        console.log(err1)
        res.status(500).send();
      } else {
        console.log(result1);
        res.send(result1);
      }
    })
  });
});

app.post("/premisData", function(req, res) {
  console.log(req.body)
  var premisQuery = `
    select p.Premis_Desc, count(c.DR_NO) as count
    from crime c natural join weaponinfo w natural join premis p natural join statusinfo s
    where Vict_Descent = ? AND s.Status = 'IC'
    group by p.Premis_Cd
    having 20 < ALL(select count(c.DR_NO))
  `
  db.query(premisQuery, [req.body.inputValue], (err1, result1) => {
    if (err1) {
      console.log(err1)
      res.status(409).send();
    } else {
      console.log(result1);
      res.send(result1);
    }
  });
});

app.post("/procpremis", function(req, res) {
  console.log(req.body)
  var premisQuery = `
    CALL ProcPremis(?, ?);
  `
  db.query(premisQuery, [req.body.weapon, req.body.maxAge], (err1, result1) => {
    if (err1) {
      console.log(err1)
      res.status(409).send();
    } else {
      console.log(result1);
      res.send(result1[0]);
    }
  });
});

app.get("/get-report/:ID", function(req, res) {
  var getQuery = `
    select *
    from selfreportcrime
    where ReportID = ?;
  `
  db.query(getQuery, [req.params.ID] ,(err1, result1) => {
    if (err1) {
      console.log(err1)
      res.status(500).send();
    } else if (result1.length !== 1) {
      res.status(409).send();
    } else {
      res.send(result1[0]);
    }
  });
})

app.get("/get-last-submission/:ID", function(req, res) {
  console.log(req.params.ID)
  var getQuery = `
    select *
    from crime
    where ReportID = ?;
  `
   db.query(getQuery, [parseInt(req.params.ID)] ,(err1, result1) => {
    if (err1) {
      console.log(err1)
      res.status(500).send();
    } else if (result1.length !== 1) {
      res.status(409).send();
    } else {
      console.log(result1);
      res.send(result1[0]);
    }
  })

})

app.put("/process-report/:ID", function(req, res) {
  console.log(req.body);
  var query1 = `
    select *
    from crime
    where ReportID = ?
  `

  var query2 = `
    select max(DR_NO)
    from crime
  `

  var query3 = `
    insert into crime values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `

  var query4 = `
    update crime
    set Date_Rptd = ? , DATE_OCC = ? , TIME_OCC = ? , Rpt_Dist_No = ? ,
        Crm_Cd = ? , Vict_Age = ? , Vict_Sex = ? , Vict_Descent = ? ,
        Premis_Cd = ? , Weapon_Used_Cd = ? , Status = ? , LOCATION = ? ,
        LAT = ? , LON = ?
    where ReportID = ?;
  `

  // Consider writing a promise wrapper for db.query or use the library promise-mysql
  // Having three layers of callbacks isn't the best solution in terms of readability
  db.query(query1,[parseInt(req.params.ID)] ,(err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send();
      return;
    }
    console.log(result)

    //update
    if (result.length === 1) {
      db.query(query4, [req.body.Date_Rptd, req.body.DATE_OCC, req.body.TIME_OCC, req.body.Rpt_Dist_No, req.body.Crm_Cd, req.body.Vict_Age, req.body.Vict_Sex, req.body.Vict_Descent, req.body.Premis_Cd, req.body.Weapon_Used_Cd, req.body.Status, req.body.LOCATION, req.body.LAT, req.body.LON, parseInt(req.params.ID)], (err1, result1) => {
          if (err1) {
            console.log(err1)
            res.status(409).send();
          } else {
            console.log(result1)
            res.status(200).send();
          }
      })
      return;
    }

    //create new
    db.query(query2, (err1, res1) => {
      if (err1) {
        console.log(err1)
        res.status(409).send();
        return;
      }

      console.log(res1)
      var val = JSON.stringify(res1[0]);
      console.log(val);
      var newValue = JSON.parse(val);
      console.log(newValue);
      var jsonValue = newValue['max(DR_NO)']
      console.log(jsonValue);
      var insertVal = jsonValue + 1;
      
      db.query(query3, [insertVal, req.body.Date_Rptd, req.body.DATE_OCC, req.body.TIME_OCC, req.body.Rpt_Dist_No, req.body.Crm_Cd, req.body.Vict_Age, req.body.Vict_Sex, req.body.Vict_Descent, req.body.Premis_Cd, req.body.Weapon_Used_Cd, req.body.Status, req.body.LOCATION, req.body.LAT, req.body.LON, parseInt(req.params.ID)] ,(err2, res2) => {
        if (err2) {
          console.log(err2)
          res.status(409).send();
        } else {
          console.log(res2)
          res.status(200).send();
        }
      })
    })
  })
});

app.delete("/del-report/:ID", function(req, res) {
  console.log(req.params.ID)
  var deleteQuery = `
    delete from selfreportcrime
    where ReportID = ?;
  `
  db.query(deleteQuery, [parseInt(req.params.ID)], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send();
    } else if (result.affectedRows === 0) {
      res.status(409).send();
    } else {
      console.log(result);
      res.send("Deleted Crime");
    }
  });
});