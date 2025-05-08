const knex = require("knex");
const db = knex({
    client: "mysql2",
    connection:{
        host: "web0164.zxcs.be",
        user: "adb_rune",
        password: "kCn3Xm83XQfVA6TBkZX7",
        database: "adb_project_rune"
    }
})

module.exports = db;