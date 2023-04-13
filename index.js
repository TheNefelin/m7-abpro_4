import pkg from 'pg';
import Cursor from 'pg-cursor';
import yargs from 'yargs';
import { hideBin } from "yargs/helpers";

const { Pool } = pkg;
const args = hideBin(process.argv);

const pool = new Pool({
    user: "postgres",
    password: "123456",
    database: "banco",
    host: "localhost",
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 1000
});

yargs(hideBin(process.argv))
    .command(["Docs", "$0"], "Gestionar Estudiantes", () => {
        console.log("-----------------------------------------");
        console.log("nueva N°Cta monto motivo");
        console.log("trans N°Cta");
        console.log("saldo N°Cta");
    })
    .command("nueva", "Nueva Transaccion", () => {
        if (args.length == 4 && !isNaN(args[1]) && !isNaN(args[2])) {
            transaccion(args)
        } else {
            console.log("-----------------------------------------");
            console.log("Error: falta de parametros o Cta y/o monto NO numerico");
        };
    })
    .command("trans", "Obtiene 10 Transacciones de una Cta", () => {
        if (args.length == 2 && !isNaN(args[1])) {
            getDataCursor("SELECT * FROM transacciones WHERE cuenta = $1", [parseInt(args[1])]);
        } else {
            console.log("-----------------------------------------");
            console.log("Error: falta de parametros o Cta NO numerica");
        };
    })
    .command("saldo", "Saldo por Cta", () => {
        if (args.length == 2 && !isNaN(args[1])) {
            getDataCursor("SELECT * FROM cuentas WHERE id = $1", [parseInt(args[1])]);
        } else {
            console.log("-----------------------------------------");
            console.log("Error: falta de parametros o Cta NO numerica");
        };
    })
.argv

async function transaccion(values) {
    let fecha = new Date();
    fecha = [fecha.getFullYear(), fecha.getMonth(), fecha.getDay()].join('/');

    await pool.query("BEGIN");

    try {
        await pool.query("INSERT INTO cuentas (id, saldo) VALUES ($1, $2)", [values[1], values[2]]);
        
        const transaccion = await pool.query("INSERT INTO transacciones (fecha, cuenta, monto, descripcion) VALUES ($1, $2, $3, $4) RETURNING *", [fecha, values[1], values[2], values[3]]);
       
        console.log("-----------------------------------------");
        console.table(transaccion.rows);

        await pool.query("COMMIT");
    } catch (e) {
        await pool.query("ROLLBACK");
        console.log(e)
    };

    pool.release;
};

async function getDataCursor(sql, values) {
    const client = await pool.connect()
    const cursor = client.query(new Cursor(sql, values));

    cursor.read(10, (err, rows) => {
        console.table(rows);
        cursor.close(() => {
            cursor.release;
        });
    });
};
