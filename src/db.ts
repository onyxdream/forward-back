import sqlite from "node:sqlite";

const dbPath = process.env.DB_FILE;

if (!dbPath)
  throw new Error("[ERR] Especify a valid path for the .sqlite file.");

let db = new sqlite.DatabaseSync(dbPath);

const query = (query: string, params?: (string | number)[]): any => {
  try {
    const stmt = db.prepare(query);

    console.log(params);
    const result = stmt.run(...(params || []));

    return result;
  } catch (error) {
    throw new Error(
      `Query Error. \n- Query: ${query}\n- Parameters: ${params?.join()}\n- Error: ${error}`
    );
  }
};

class Cursor {
  static query = (query: string, params?: (string | number)[]): any => {
    try {
      const stmt = db.prepare(query);

      console.log(params);
      const result = stmt.run(...(params || []));

      return result;
    } catch (error) {
      throw new Error(
        `Query Error. \n- Query: ${query}\n- Parameters: ${params?.join()}\n- Error: ${error}`
      );
    }
  };

  static get = (query: string, params?: (string | number)[]): any => {
    try {
      const stmt = db.prepare(query);

      const result = stmt.get(...(params || []));

      return result;
    } catch (error) {
      throw new Error(
        `Query Error. \n- Query: ${query}\n- Parameters: ${params?.join()}\n- Error: ${error}`
      );
    }
  };
}

export default db;
export { Cursor };
