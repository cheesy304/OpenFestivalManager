var express = require('express');
var router = express.Router();
var db = require("../database");
const fs = require('fs');
const { groupCollapsed } = require('console');
const { redirect } = require('express/lib/response');

router.get('/', function (req, res) {
  if (!req.session.admin_id) {
    res.redirect("/admin/login");
    return;
  }
  db.query('SELECT * FROM account WHERE id_type=3', function (err, rows) {
    var db_access = true, db_table = true;
    if (err) {
      console.log(err);
      if (err.code != "ER_NO_SUCH_TABLE") {
        db_access = false;
      }
      db_table = false;
      rows = {};
    }
    res.render("admin/admin", { regActive: global.registrationActive, uptime: parseInt(process.uptime()), personal: rows, db_a: db_access, db_t: db_table });

  });

});


router.post('/', function (req, res, next) {
  if (!req.session.admin_id) {
    res.redirect("/admin/login");
    return;
  }
  // store all the user input data
  const body = req.body;

  if (body.registrationPersonal == "on") {
    global.registrationActive = true;
  } else {
    global.registrationActive = false;
  }

  if (body.createTables) {
    console.log("create Tables WIP");
    /*    fs.readFile('fm_db.sql', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      var sql = data.replaceAll("\n","");
      console.log(sql);
      
      db.query(sql, function (err, rows) {
        if (err) {
          console.log(err);
        }
      });
    });*/
  }

  res.redirect("/admin");  // redirect to user form page after inserting the data
});


router.get('/configuration', function (req, res) {
  if (!req.session.admin_id) {
    res.redirect("/admin/login");
    return;
  }
  db.query('SELECT * FROM stand', function (err, rows) {
    if (err) {
      console.log("error");
    }

    db.query('SELECT * FROM Zutat', function (err, opts) {
      if (err) {
        console.log("error");
      }

      db.query('SELECT * FROM Gericht', function (err, prod) {
        if (err) {
          console.log(err);
        }
        db.query('SELECT * FROM Tisch', function (err, table) {
          if (err) {
            console.log(err);
          }

          db.query('SELECT * FROM Tisch_Gruppe', function (err, groups) {
            if (err) {
              console.log(err);
            }

            res.render("admin/admin_configuration", { stations: rows, options: opts, products: prod, table_groups: groups, tables: table });
          });
        });

      });

    });

  });

});

router.post('/configuration', function (req, res) {
  if (!req.session.admin_id) {
    res.redirect("/admin/login");
    return;
  }
  const body = req.body;
  console.log(body)

  // Neue Tisch Gruppe anlegen
  if (body.new_table_group) {
    var sql = `INSERT INTO Tisch_Gruppe VALUES (0,"${body.new_table_group}")`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log('record inserted');
    });
  }

  // Neuen Tisch anlegen
  if (body.new_table) {
    var sql = `INSERT INTO Tisch VALUES (0,"${body.new_table}",${body.table_group_id})`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log('record inserted');
    });
  }


  // Neue Station anlegen
  if (body.new_station) {
    var sql = `INSERT INTO stand VALUES (0,"${body.new_station}",NULL)`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log('record inserted');
    });
  }

  // Neue Zutat anlegen
  if (body.new_option) {
    var sql = `INSERT INTO Zutat VALUES (0,"${body.new_option}")`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log('record inserted');
    });
  }

  // Neues Produkt anlegen
  if (body.product_name) {
    var station = body.product_station;
    var name = body.product_name;
    var options = body.product_option;
    var defaults = body.product_option_standard;
    var deliverable = (body.product_deliverable == "on");
    var cost = body.product_cost;

    // Produkt eintrag anlegen
    var sql = `INSERT INTO Gericht VALUES (0,${station},"${name}",${cost},${deliverable})`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      // Get Gericht ID!
      if (options) {
        var sql = `SELECT id FROM Gericht WHERE id_stand=${station} AND name = "${name}" AND preis = ${cost} and lieferbar = ${deliverable}`;
        db.query(sql, function (err, result) {
          if (err) throw err;
          // Optionen speichern
          for (var i = 0; i < options.length; i++) {
            var optional = defaults.includes(options[i]);
            var sql = `INSERT INTO Gericht_Zutaten VALUES (0,${result[0].id},${options[i]},1,${optional})`;
            db.query(sql, function (err, result) {
              if (err) throw err;
            });
            console.log(sql);
          }
        });
      }
    });
    console.log(sql);
  }

  // Remove Produkt
  if (body.remove_product) {
    // Gericht_Zutaten entfernen
    var sql = `DELETE FROM Gericht_Zutaten WHERE id_gericht = ${body.remove_product}`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log('record  deleted');
    });
    // Gericht entfernen
    var sql = `DELETE FROM Gericht WHERE id = ${body.remove_product}`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log('record  deleted');
    });
  }

  // Remove Tisch
  if (body.remove_table) {
    // Gericht_Zutaten entfernen
    var sql = `DELETE FROM Tisch WHERE id = ${body.remove_table}`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log('record  deleted');
    });
  }

  // Remove Tisch Gruppe
  if (body.remove_table_group) {
    // Tische entfernen
    var sql = `DELETE FROM Tisch WHERE id_tischgruppe = ${body.remove_table_group}`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log('record  deleted');
      var sql = `DELETE FROM Tisch_Gruppe WHERE id = ${body.remove_table_group}`;
      db.query(sql, function (err, result) {
        if (err) throw err;
        console.log('record  deleted');
      });
    });
  }


  res.redirect("/admin/configuration");

});


router.get('/orderdata', function (req, res) {
  if (!req.session.admin_id) {
    res.redirect("/admin/login");
    return;
  }
  // Count all tables
  db.query("SELECT id, groupname FROM tisch_gruppe", function (err, tables) {
    if (err) {
      console.log(err);
    }
    res.render("admin/admin_orderdata", { table_groups: tables });


  });
});

router.get('/statistics', function (req, res) {
  if (!req.session.admin_id) {
    res.redirect("/admin/login");
    return;
  }
  // Count all active orders
  var sql = 'SELECT COUNT(id) AS c FROM bestellung\
    WHERE bestellung.erledigt IS NULL AND bestellung.stoniert = false';
  db.query(sql, function (err, activeOrders) {
    if (err) {
      console.log(err);
    }
    // Count all active sessions
    db.query("SELECT COUNT(id) AS c FROM sitzung WHERE end IS NULL", function (err, activeSessions) {
      if (err) {
        console.log(err);
      }
      // Count all tables
      db.query("SELECT COUNT(id) AS c FROM tisch", function (err, countTables) {
        if (err) {
          console.log(err);
        }
        // Count all orders today
        db.query("SELECT COUNT(id) AS c FROM sitzung WHERE end IS NOT NULL AND DATEDIFF(DATE(end),NOW())=0", function (err, todaySessions) {
          if (err) {
            console.log(err);
          }
          // Count all sessions today
          db.query("SELECT COUNT(id) AS c FROM bestellung WHERE erledigt IS NOT NULL AND DATEDIFF(DATE(erledigt),NOW())=0", function (err, todayOrders) {
            if (err) {
              console.log(err);
            }
            // Count all sessions today
            db.query('SELECT DISTINCT(DATE_FORMAT(erledigt,"%d.%m.%Y")) AS date, DATE_FORMAT(erledigt,"%Y-%m-%d") AS date_machine FROM bestellung WHERE erledigt IS NOT NULL', function (err, dates) {
              if (err) {
                console.log(err);
              }
              console.log(dates)
              res.render("admin/admin_statistics", { activeOrders: activeOrders[0].c, activeSessions: activeSessions[0].c, countTables: countTables[0].c, todayOrders: todayOrders[0].c, todaySessions: todaySessions[0].c, dates: dates });

            });
          });
        });

      });
    });
  });



});


router.get('/login', function (req, res) {
  res.render("admin/login_admin", { err: false });
});

router.post('/login', function (req, res) {
  // check username
  console.log(req.body)
  if (req.body.username && req.body.password) {
    var sql = `SELECT id,name FROM account WHERE name ="${req.body.username}" AND id_type= 1 AND pw="${req.body.password}"`;
    db.query(sql, function (err, result) {
      if (err) throw err;

      if (result[0]) {
        req.session.admin_id = result[0].id;
        req.session.admin_name = result[0].name;
        res.redirect("/admin");
      } else {
        res.render("admin/login_admin", { err: true });
      }
    });
  } else {
    res.render("admin/login_admin", { err: true });
  }

});



module.exports = router;
