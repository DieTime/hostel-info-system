const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db_name = "hostel.sqlite3";
let database = null;

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("client/build"));

// Get empty apartments with class
// and capacity params
app.get("/empty/:class/:cap", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const cl = req.params["class"] !== "null" ? `'${req.params["class"]}'` : null;
  const cap = req.params["cap"];

  const sql = `SELECT * FROM
              (
                  SELECT a.id, a.number, a.capacity, a.class, a.day_price,
                                  a.animals, a.candidate, a.heating,
                                  (date() < start_date OR date() > end_date) as in_range
                  FROM apartments a
                    LEFT JOIN orders o ON a.id = o.apartments_id
                    WHERE (${cl} IS NULL OR a.class=${cl}) AND (${cap} IS NULL OR a.capacity>=${cap})
                  ORDER BY in_range
              )
              GROUP BY id HAVING (in_range IS NULL OR in_range = 1)`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get capacities of apartments
app.get("/capacities", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT DISTINCT capacity FROM apartments ORDER BY capacity`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get classes of apartments
app.get("/classes", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT DISTINCT class FROM apartments`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get empty apartments at the moment
app.get("/empty", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT * FROM
              (
                  SELECT a.id, a.number, a.capacity, a.class, a.day_price,
                                  a.animals, a.candidate, a.heating,
                                  (date() < start_date OR date() > end_date) as in_range
                  FROM apartments a
                    LEFT JOIN orders o ON a.id = o.apartments_id
                  ORDER BY in_range
              )
              GROUP BY id HAVING (in_range IS NULL OR in_range = 1)`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get free apartments in a certain date range
// and with a certain number of people
app.get("/empty/:from/:to/:cap", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT * FROM 
               (
                   SELECT a.id, a.number, a.capacity, a.class, a.day_price,
                          a.animals, a.candidate, a.heating,
                          (? < start_date OR ? > end_date) as in_range
                   FROM apartments a
                     LEFT JOIN orders o ON a.id = o.apartments_id
                   WHERE a.capacity >= ?
                   ORDER BY in_range
               )
               GROUP BY id HAVING (in_range IS NULL OR in_range = 1)`;

  // Send sql query with params []
  database.all(
    sql,
    [req.params["to"], req.params["from"], req.params["cap"]],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return err;
      }

      // Send table if success
      res.json({ data: rows });
    }
  );

  // Close database
  database.close();
});

// Get all services
app.get("/services", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT * FROM service`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get all guests
app.get("/guests", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT *, (number_price + service_price) as total
               FROM (
                  SELECT o.id, a.number, o.persons, c.id as client_id,
                     c.name, c.surname, c.patronym, c.passport,
                     o.start_date, o.end_date,
                     Cast((julianDay(o.end_date) - JulianDay(o.start_date)) As Integer) * a.day_price as number_price,
                     COALESCE(sum(os.count * s.price), 0) as service_price
                  from orders o
                     left join clients c on o.client_id = c.id
                     left join apartments a on o.apartments_id = a.id
                     left join order_service os on os.order_id = o.id
                     left join service s on os.service_id = s.id
                  where start_date <= date('now')
                  group by o.id
               )`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get today-tomorrow apartments
app.get("/today_tomorrow", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT a.id, a.number, a.capacity, a.class, a.day_price, a.animals, a.candidate,
                      a.heating, CAST(julianday(o.end_date) - julianday(date('now')) as INTEGER) as delta
               FROM apartments a LEFT JOIN orders o ON a.id = o.apartments_id
               WHERE o.apartments_id IS NOT NULL AND (delta == 1 OR delta == 0)`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get today-tomorrow apartments
app.get("/info/:order_id", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT name, count, date, price, price * count AS total 
               FROM orders 
                   LEFT JOIN  order_service os ON orders.id = os.order_id 
                   LEFT JOIN service s ON os.service_id = s.id
               WHERE orders.id=? 
               ORDER BY service_id, date`;

  // Send sql query with params []
  database.all(sql, [req.params["order_id"]], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get all reservations
app.get("/reservation", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT *, (number_price + service_price) as total
               FROM (
                  SELECT o.id, a.number, o.persons, c.id as client_id,
                     c.name, c.surname, c.patronym, c.passport,
                     o.start_date, o.end_date,
                     Cast((julianDay(o.end_date) - JulianDay(o.start_date)) As Integer) * a.day_price as number_price,
                     COALESCE(sum(os.count * s.price), 0) as service_price
                  from orders o
                     left join clients c on o.client_id = c.id
                     left join apartments a on o.apartments_id = a.id
                     left join order_service os on os.order_id = o.id
                     left join service s on os.service_id = s.id
                  where start_date > date('now')
                  group by o.id
                  order by o.start_date
               )`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get reservations by name
app.get("/reservation/:name/:surname/:patronym", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT *, (number_price + service_price) as total
               FROM (
                  SELECT o.id, a.number, o.persons,
                     c.name, c.surname, c.patronym, c.passport,
                     o.start_date, o.end_date,
                     Cast((julianDay(o.end_date) - JulianDay(o.start_date)) As Integer) * a.day_price as number_price,
                     COALESCE(sum(os.count * s.price), 0) as service_price
                  from orders o
                     left join clients c on o.client_id = c.id
                     left join apartments a on o.apartments_id = a.id
                     left join order_service os on os.order_id = o.id
                     left join service s on os.service_id = s.id
                  where start_date > date('now') AND c.name=? AND c.surname=? AND c.patronym=?
                  group by o.id
               )`;

  // Send sql query with params []
  database.all(
    sql,
    [req.params["name"], req.params["surname"], req.params["patronym"]],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return err;
      }
      res.json({ data: rows });
    }
  );

  // Close database
  database.close();
});

// Get all reservations
app.get("/archive", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT * FROM archive`;

  // Send sql query with params []
  database.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Get info by number
app.get("/apartments/:number", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  const sql = `SELECT number, capacity, class, day_price,
                      animals, candidate, heating
               FROM apartments WHERE number=?`;

  // Send sql query with params []
  database.all(sql, req.params["number"], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return err;
    }
    res.json({ data: rows });
  });

  // Close database
  database.close();
});

// Add order in database
app.post("/create", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  // Add client
  let c = req.body.client;
  let sql = `INSERT INTO clients (name, surname, patronym, passport) VALUES(?,?,?,?)`;
  database.run(sql, [c.name, c.surname, c.patronym, c.passport], err => {
    if (err) {
      res.status(500).json({ error: err.message });
      return err;
    }

    // After adding client get last client id
    database.get(
      `SELECT clients.id FROM clients ORDER BY id DESC`,
      [],
      (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return err;
        }
        // Last client id
        let c_id = row.id;

        // After getting client id add order in table
        let o = req.body.order;
        sql = `INSERT INTO orders (apartments_id, client_id, persons, start_date, end_date)
               VALUES(?,?,?,?,?)`;
        database.run(
          sql,
          [o.a_id, c_id, o.persons, o.dates[0], o.dates[1]],
          err => {
            if (err) {
              res.status(500).json({ error: err.message });
              return err;
            }

            // After adding order get last order id
            database.get(
              `SELECT orders.id FROM orders ORDER BY id DESC`,
              [],
              (err, row) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return err;
                }
                // Last order id
                let o_id = row.id;

                // After getting order id add services in order_service table
                let s = req.body.services;
                s.map((item, index) => {
                  // If client select service
                  if (item.state && item.dates.length > 0) {
                    let start = new Date(item.dates[0]); // Start date
                    let end = new Date(item.dates[1]); // End date

                    // Add all days with this service in order_service table
                    while (start <= end) {
                      sql = `INSERT INTO order_service (order_id, service_id, count, date) VALUES(?,?,?,?)`;
                      database.run(
                        sql,
                        [
                          o_id,
                          index + 1,
                          item.num,
                          start.toISOString().slice(0, 10)
                        ],
                        err => {
                          if (err) {
                            res.status(500).json({ error: err.message });
                            return err;
                          }
                        }
                      );
                      // Increment date
                      start.setDate(start.getDate() + 1);
                    }
                  }
                });

                // Send success if all field entered
                res.status(200).send({ result: "ok" });
              }
            );
          }
        );
      }
    );
  });

  // Close database
  database.close();
});

// Add field in archive
app.post("/add/archive", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  // Add field
  let d = req.body.data;
  let sql = `INSERT INTO archive (name, surname, patronym, number, start_date, end_date, price)
             VALUES (?, ?, ?, ?, ?, ?, ?)`;

  database.run(
    sql,
    [
      d.name,
      d.surname,
      d.patronym,
      d.number,
      d.start_date,
      d.end_date,
      d.price
    ],
    err => {
      if (err) {
        res.status(500).json({ error: err.message });
        return err;
      }
      // Send success if all field entered
      res.status(200).send({ result: "ok" });
    }
  );

  // Close database
  database.close();
});

// Remove order after paying
app.post("/remove", (req, res) => {
  // Open database
  database = new sqlite3.Database(db_name);

  // Add field
  let d = req.body;
  let sql = `DELETE FROM orders WHERE orders.id=?`;
  database.run(sql, [d.id], err => {
    if (err) {
      res.status(500).json({ error: err.message });
      return err;
    }

    sql = `DELETE FROM order_service WHERE order_id=?`;
    database.run(sql, [d.id], err => {
      if (err) {
        res.status(500).json({ error: err.message });
        return err;
      }

      sql = `DELETE FROM clients WHERE id=?`;
      database.run(sql, [d.client_id], err => {
        if (err) {
          res.status(500).json({ error: err.message });
          return err;
        }

        if (new Date().toISOString().slice(0, 10) >= d.start_date) {
          sql = `INSERT INTO archive (name, surname, patronym, passport, number, start_date, end_date, price)
               VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
          database.run(
            sql,
            [
              d.name,
              d.surname,
              d.patronym,
              d.passport,
              d.number,
              d.start_date,
              d.end_date,
              d.total
            ],
            err => {
              if (err) {
                res.status(500).json({ error: err.message });
                return err;
              }

              // Send success if all field entered
              res.status(200).send({ result: "ok" });
            }
          );
        } else {
          // Send success if all field entered
          res.status(200).send({ result: "ok" });
        }
      });
    });
  });

  // Close database
  database.close();
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
