const fs = require("fs");
const path = require("path");
const readline = require("readline");

const tasksFilePath = path.join(__dirname, "tasks.json");
console.log(tasksFilePath);

if (!fs.existsSync(tasksFilePath)) {
  console.log("File doesn't exist, Creating now.");
  fs.writeFileSync(tasksFilePath, "[]");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getMyTasks = () => {
  const myTasks = fs.readFileSync(tasksFilePath, "utf-8");
  return JSON.parse(myTasks);
};

const saveMyTask = (tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks));
};

const addTask = (task) => {
  const tasksContainer = getMyTasks();
  tasksContainer.push({
    description: task,
    isCompleted: false,
  });
  saveMyTask(tasksContainer);
  console.log("Task added successfully");
};
const showAllTask = () => {
  const allTasks = getMyTasks();
  allTasks.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.description} - ${item.isCompleted ? "[Completed]" : "[Not Completed]"}`
    );
  });
};

const deleteTask = (taskNo) => {
  const tasks = getMyTasks();
  if (tasks[taskNo - 1]) {
    const filteredData = tasks.filter((item, index) => index !== taskNo - 1);
    saveMyTask(filteredData);
    console.log("Task deleted successfully");
  } else {
    console.log("Invalid task Number.");
  }
};
const markTaskAsCompleted = (taskNo) => {
  const tasks = getMyTasks();
  if (tasks[taskNo - 1]) {
    tasks[taskNo - 1].isCompleted = true;
    saveMyTask(tasks);
    console.log("Task completed successfully...");
  } else {
    console.log("Invalid task Number.");
  }
  return;
};
const todoManager = () => {
  rl.question(
    `What would you want to do?
      1.Add a task.
      2.Show all task.
      3.Delete Task.
      4.Exit.
      5.Mark task as completed.`,
    (answer) => {
      console.log(`Your entered: ${answer}`);
      switch (answer) {
        case "1":
          rl.question("Enter your task: ", (input) => {
            console.log(`Adding task: ${input}`);
            addTask(input);
            todoManager();
          });
        case "2": {
          console.log("Showing all tasks...");
          showAllTask();
          todoManager();
          break;
        }
        case "3": {
          rl.question(
            "Enter the task number you what to delete: ",
            (taskNo) => {
              deleteTask(parseInt(taskNo));
              todoManager();
            }
          );
          break;
        }
        case "4": {
          rl.close();
          break;
        }
        case "5": {
          rl.question(
            "Enter the task number you what to complete: ",
            (taskNo) => {
              markTaskAsCompleted(parseInt(taskNo));
              todoManager();
            }
          );
          break;
        }
        default:
          console.log("Invalid Option");
          todoManager();
      }
    }
  );
};

todoManager();
