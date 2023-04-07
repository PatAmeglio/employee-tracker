const connection = require('./config/connection');
const inquirer = require('inquirer');

require("console.table");

function init(){
  console.log("Welcome to the employee tracker");
  start();
}

async function start(){
  const {data} = await inquirer.prompt({
    type: "list",
    name: "data",
    message: "What would you like to do?",
    choices: [
      "View all employees", 
      "View all departments", 
      "View all roles",
      "Add an employee",
      "Add a department",
      "Add a role",
      "Update an Employee"
    ],
  })

  switch (data) {
    case "View all employees":
      viewallEmp()
    break;
    case "View all departments":
      viewallDept()
    break;
    case "View all roles":
      viewallRoles()
    break;
    case "Add an employee":
      addEmp()
    break;
    case "Add a department":
      addDept()
    break;
    case "Add a role":
      addRole()
    break;
    case "Update an Employee":
      updateEmp()
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
      FROM employee e
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id`);
      console.table(rows);
      setTimeout(start, 3000)
  } catch (err) {
    console.log(err);
  }
}

async function viewallDept(){
  try {
    const [rows] = await connection.promise().query('SELECT id, name FROM department');
      console.table(rows);
      setTimeout(start, 3000)
  } catch (err) {
    console.log(err);
  }
}

async function viewallRoles(){
  try {
    const [rows] = await connection.promise().query('SELECT r.id, r.title, r.salary, d.name AS department FROM roles r LEFT JOIN department d ON r.department_id = d.id');
      console.table(rows);
      setTimeout(start, 3000)
  } catch (err) {
    console.log(err);
  }
}

const addEmp = async () => {
  await inquirer.prompt([
    {
      type: "input",
      message: "What's the first name of the employee?",
      name: "newFirstName"
    },
    {
      type: "input",
      message: "What's the last name of the employee?",
      name: "newLastName"
    },
    {
      type: "input",
      message: "What is the employees role id number?",
      name: "newRoleID"
    },
    {
      type: "input",
      message: "What is the manager id number?",
      name: "managerID"
    }]
  )

  .then(function(employeeName){
    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [employeeName.newFirstName, employeeName.newLastName, employeeName.newRoleID, employeeName.managerID] , (err, res) => {
      if (err) throw (err);
      console.table(res);
      setTimeout(start, 3000)
    })})
  };

  const addDept = async () => {
    await inquirer.prompt (
      {
          type: 'input',
          name: 'newDept',
          message: 'What is the name of the new Department you would like to add?'
  
      })
  
      .then(function(deptName){
        connection.query("INSERT INTO department (name) VALUES (?)", [deptName.newDept], (err, res) => {
          if (err) throw (err);
          console.table(res);
          setTimeout(start, 3000)
      })})
  };

  const addRole = async () => {
    await inquirer.prompt ([
      {
          type: 'input',
          name: 'newRole',
          message: 'What is the name of the new Role you would like to add?'
  
      },
      {
          type: 'input',
          name: 'newSalary',
          message: 'What is the salary of the new Role?'
  
      },
      {
          type: 'input',
          name: 'newRoleDept',
          message: 'What is the id of the department the new Role belongs to?'
      }]
      )
  
      .then(function(roleName){
        connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [roleName.newRole, roleName.newSalary, roleName.newRoleDept] , (err, res) => {
          if (err) throw (err);
          console.table(res);
          setTimeout(start, 3000)
  })})
  };

  const updateEmp = async () => {
    await inquirer.prompt([
        {
          type: "input",
          message: "Which employee would you like to update?",
          name: "employeeUpdate"
        },
  
        {
          type: "input",
          message: "What is the employees new role ID?",
          name: "roleUpdate"
        }]
      )
  
      .then(function(update){
        connection.query("UPDATE employee SET role_id=? WHERE first_name= ?", [update.employeeUpdate, update.roleUpdate], (err, res) => {
          if (err) throw (err);
          console.table(res);
          setTimeout(start, 3000)
      })})
  
  };

init();