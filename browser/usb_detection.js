const { spawn } = require("child_process");

const command = "wmic logicaldisk where drivetype=2 get caption";

const child = spawn("powershell.exe", [command]);

child.stdout.on("data", (data) => {
  console.log(`USB Drive Captions:\n${data.toString()}`);
});

child.stderr.on("data", (data) => {
  console.error(`Error:\n${data.toString()}`);
});

child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Process exited with code ${code}`);
  }
});
