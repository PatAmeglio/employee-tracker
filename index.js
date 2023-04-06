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
    case "view all roles":
      viewallRoles()
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

async function viewallDept(){
  try {
    const [rows] = await connection.promise().query('SELECT id, name FROM departments');
      console.table(rows);
      setTimeout(start, 2000)
  } catch (err) {
    console.log(err);
  }
}

async function viewallRoles(){
  try {
    const [rows] = await connection.promise().query('SELECT r.id, r.title, r.salary, d.name AS department FROM roles r LEFT JOIN departments d ON r.department_id = d.id');
      console.table(rows);
      setTimeout(start, 2000)
  } catch (err) {
    console.log(err);
  }
}


init();