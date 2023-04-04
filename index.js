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
    host: "localhost"
});


yargs(hideBin(process.argv))
    .command(["Docs", "$0"], "Gestionar Estudiantes", () => {
        console.log("-----------------------------------------");
        console.log("select N°Cta");
        console.log("trans N°Cta monto motivo");
        console.log("-----------------------------------------");
    })
    .command("select", "Obtiene estudiente por rut", () => {
        if (args.length == 2 && !isNaN(args[1])) {
            getDataCursor("SELECT * FROM transacciones WHERE cuenta = $1", [parseInt(args[1])])
        } else {
            console.log("Error: falta de parametros o Cta NO numerica")
        };
    })
    .command("trans", "Nueva transaccion", () => {
        if (args.length == 4 && !isNaN(args[1])) {

        }
        transaccion("", "")
    })
    .command("update", "Modifica un estudiante por rut", () => {

    })
    .command("delete", "Elimina un estudiante por rut", () => {

    })
.argv

async function transaccion(sql, values) {
    // await pool.query("BEGIN");
    let fecha = new Date();
    fecha = [fecha.getFullYear(), fecha.getMonth(), fecha.getDay()].join('/');

    console.log(fecha)
    try {

        // const resultado = await pool.query("UPDATE cuentas SET monto = monto + $2 WHERE id = $1 RETURNING");
        // console.log(resultado.rows)
        console.log([fecha, values[1], values[2], values[3]])
    } catch (e) {
        console.log(e)
    };

    // pool.close(() => {
    //     pool.release;
    // })
};

async function getDataCursor(sql, values) {
    const client = await pool.connect()
    const cursor = client.query(new Cursor(sql, values));

    cursor.read(10, (err, rows) => {
        console.log(rows);
        cursor.close(() => {
            cursor.release;
        });
    });
};
