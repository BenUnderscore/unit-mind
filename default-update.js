//Updates the code on Screeps

let destination = "path/to/branch";

const { exec } = require ("child_process")
exec("cp ./src/* " + destination);