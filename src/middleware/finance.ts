import { Request, Response } from "express";
import { MiddlewareRecord } from "../types";
import db, { Cursor } from "../db";

db.exec(`CREATE TABLE IF NOT EXISTS accounts (
    AccountID INTEGER PRIMARY KEY AUTOINCREMENT,
    AccountName VARCHAR(100),
    Balance DECIMAL(15, 2),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);

db.exec(`CREATE TABLE IF NOT EXISTS Categories (
    CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(50)
);`);

db.exec(`CREATE TABLE IF NOT EXISTS Transactions (
    TransactionID INTEGER PRIMARY KEY AUTOINCREMENT,
    AccountID INTEGER,
    CategoryID INTEGER,
    Amount DECIMAL(15, 2),
    TransactionDate DATE,
    Description TEXT,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);`);

interface Transaction {
  TransactionID: number;
  AccountID: number;
  CategoryID: number;
  Amount: number;
  Description: string;
  TransactionDate: string;
}

interface Category {
  CategoryId: number;
  Name: string;
}

interface Account {
  AccountID: number;
  AccountName: string;
  Balance: number;
  CreatedAt: string;
}

const getTransactions = (
  startDate?: string | undefined,
  endDate?: string | undefined
) => {
  try {
    // fetch all habits
    let query = "SELECT * FROM transactions ";

    const params: any[] = [];
    let whereAdded = false;

    const addCondition = (condition: string, param: string | number) => {
      query += `${whereAdded ? " AND " : " WHERE "} ${condition}`;
      params.push(param);
      whereAdded = true;
    };

    if (startDate) addCondition("TransactionDate > ?", startDate);
    if (endDate) addCondition("TransactionDate <= ?", endDate);

    const statement = db.prepare(query);
    const result = statement.all(...params);

    return result;
  } catch (error) {
    console.log("Error retrieving transactions.", error);
    return [];
  }
};

const getTotalBalance = () => {
  try {
    const result = db
      .prepare("SELECT SUM(Balance) as total FROM Accounts")
      .get();
    return result?.total ?? 0;
  } catch (error) {
    console.log("Error calculating total balance", error);
    return 0;
  }
};

const mw: MiddlewareRecord = {
  "get /finance": async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const transactions = getTransactions(
        startDate && String(startDate),
        endDate && String(startDate)
      );
      const accounts = db.prepare("SELECT * FROM Accounts").all();
      const categories = db.prepare("SELECT * FROM Categories").all();
      const totalBalance = getTotalBalance();

      return res.json({
        transactions,
        accounts,
        categories,
        totalBalance,
      });
    } catch (error) {
      console.error("Error fetching finance data:", error);
      return res
        .status(500)
        .json({ error: "Failed to retrieve finance data." });
    }
  },
  "post /finance/transaction": async (req: Request, res: Response) => {
    try {
      const { AccountID, CategoryID, Amount, TransactionDate, Description } =
        req.body;

      if (
        typeof AccountID !== "number" ||
        typeof CategoryID !== "number" ||
        typeof Amount !== "number" ||
        typeof TransactionDate !== "string" ||
        typeof Description !== "string"
      ) {
        return res.status(400).json({ error: "Invalid request body." });
      }

      const stmt = db.prepare(
        `INSERT INTO Transactions (AccountID, CategoryID, Amount, TransactionDate, Description)
         VALUES (?, ?, ?, ?, ?)`
      );

      const info = stmt.run(
        AccountID,
        CategoryID,
        Amount,
        TransactionDate,
        Description
      );

      const stmt2 = db.prepare(
        `UPDATE Accounts SET Balance = Balance + ? WHERE AccountID = ?`
      );

      stmt2.run(Amount, AccountID);

      return res.json({
        message: "Transaction created.",
        TransactionID: info.lastInsertRowid,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      return res.status(500).json({ error: "Failed to create transaction." });
    }
  },

  "delete /finance/transaction": async (req: Request, res: Response) => {
    try {
      const { TransactionID } = req.body;

      if (typeof TransactionID !== "number") {
        return res.status(400).json({ error: "Invalid TransactionID." });
      }

      const transaction = Cursor.get(
        "SELECT * FROM Transactions WHERE TransactionID = ?",
        [TransactionID]
      );

      if (transaction.changes === 0) {
        return res.status(404).json({ error: "Transaction not found." });
      }

      // remove transaction
      Cursor.query("DELETE FROM Transactions WHERE TransactionID = ?", [
        TransactionID,
      ]);

      // remove the value of the transaction into the account affected
      Cursor.query(
        "UPDATE accounts SET Balance = Balance - ? WHERE AccountID = ?",
        [transaction.Amount, transaction.AccountID]
      );

      return res.json({ message: "Transaction deleted." });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return res.status(500).json({ error: "Failed to delete transaction." });
    }
  },

  "post /finance/account": async (req: Request, res: Response) => {
    try {
      const { AccountName, Balance } = req.body;

      if (typeof AccountName !== "string" || typeof Balance !== "number") {
        return res.status(400).json({ error: "Invalid request body." });
      }

      const stmt = db.prepare(
        `INSERT INTO Accounts (AccountName, Balance) VALUES (?, ?)`
      );

      const info = stmt.run(AccountName, Balance);

      return res.json({
        message: "Account created.",
        AccountID: info.lastInsertRowid,
      });
    } catch (error) {
      console.error("Error creating account:", error);
      return res.status(500).json({ error: "Failed to create account." });
    }
  },

  "delete /finance/account": async (req: Request, res: Response) => {
    try {
      const { AccountID } = req.body;
      if (typeof AccountID !== "number") {
        return res.status(400).json({ error: "Invalid AccountID." });
      }
      const stmt = db.prepare("DELETE FROM Accounts WHERE AccountID = ?");
      const info = stmt.run(AccountID);
      if (info.changes === 0) {
        return res.status(404).json({ error: "Account not found." });
      }
      return res.json({ message: "Account deleted." });
    } catch (error) {
      console.error("Error deleting account:", error);
      return res.status(500).json({ error: "Failed to delete account." });
    }
  },

  "post /finance/category": async (req: Request, res: Response) => {
    try {
      const { Name } = req.body;
      if (typeof Name !== "string") {
        return res.status(400).json({ error: "Invalid category name." });
      }
      const stmt = db.prepare("INSERT INTO Categories (Name) VALUES (?)");
      const info = stmt.run(Name);
      return res.json({
        message: "Category created.",
        CategoryID: info.lastInsertRowid,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Failed to create category." });
    }
  },

  "delete /finance/category": async (req: Request, res: Response) => {
    try {
      const { CategoryID } = req.body;
      if (typeof CategoryID !== "number") {
        return res.status(400).json({ error: "Invalid CategoryID." });
      }
      const stmt = db.prepare("DELETE FROM Categories WHERE CategoryID = ?");
      const info = stmt.run(CategoryID);
      if (info.changes === 0) {
        return res.status(404).json({ error: "Category not found." });
      }
      return res.json({ message: "Category deleted." });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Failed to delete category." });
    }
  },
};
export default mw;
