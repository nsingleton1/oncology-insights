const { exec } = require("child_process");
const PORT = process.env.PORT || 3000;
console.log(`Starting server on port ${PORT}`);
exec(`npx serve -s build -l ${PORT}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Server output: ${stdout}`);
}); 