const connection = require('./config/connection');
const inquire = require('inquirer');
const app = { get:() => console.log("you have functions to get rid of !!!")};
require("console.table");

function init(){
  console.log("Welcome to the employee tracker");
  start();
}

async function start(){
  const {data} = await inquire.prompt({
    type: "list",
    name: "data",
    message: "What would you like to do?",
    choices: ["view all employees", "view all departments", "view all roles"],
  })

  switch (data) {
    case "view all employees":
      viewallEmp()
      break;
  case "view all departments":
    viewallDept()
    break;
    default:
      console.log("Goodbye")
      process.exit(0)
      break;
  }
}

async function viewallEmp(){
  try {
    const [rows] = await connection.promise().query(`SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id`);
      console.table(rows);
      setTimeout(start, 2000)
  } catch (err) {
    console.log(err);
  }
}



// Get all departments
app.get('/departments', async (req, res) => {
  try {
    const [rows] = await connection.promise().query('SELECT id, name FROM departments');
    console.table(rows);
      setTimeout(start, 2000)
  } catch (err) {
    console.log(err)
  }
});

// Get all roles
app.get('/roles', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT r.id, r.title, r.salary, d.name AS department FROM roles r LEFT JOIN departments d ON r.department_id = d.id');
    console.table(rows);
      setTimeout(start, 2000)
  } catch (err) {
    console.log(err)
  }
});

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const [rows] = await connection.execute(`SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id`);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to retrieve employees' });
  }
});

// // Add a department
// app.post('/departments', async (req, res) => {
//   const { name } = req.body;
//   try {
//     await connection.execute('INSERT INTO departments (name) VALUES (?)', [name]);
//     res.status(201).json({ message: 'Department added successfully' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: 'Failed to add department' });
//   }
// });

// // Add a role
// app.post('/roles', async (req, res) => {
//   const { title, salary, department_id } = req.body;
//   try {
//     await connection.execute('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department_id]);
//     res.status(201).json({ message: 'Role added successfully' });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: 'Failed to add role' });
//   }
// });

// // Add an employee
// app.post("/api/employees", function (req, res) {
//     const employee = req.body;
//     const query = "INSERT INTO employee SET ?";
//     connection.query(query, employee, function (err, data) {
//       if (err) throw err;
//       res.json(data);
//     });
//   });
  
//   // Update an employee role
//   app.put("/api/employees/:id", function (req, res) {
//     const { id } = req.params;
//     const { role_id } = req.body;
//     const query = "UPDATE employee SET role_id = ? WHERE id = ?";
//     connection.query(query, [role_id, id], function (err, data) {
//       if (err) throw err;
//       res.json(data);
//     });
//   });

init();