import React from 'react';
import SQLite from 'react-native-sqlite-storage';

class SQLiteData extends React.Component {
  constructor() {
    super();
    SQLite.DEBUG = true;
  }

  ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
    db.transaction((trans) => {
      trans.executeSql(sql, params, (trans, results) => {
        resolve(results);
      },
        (error) => {
          reject(error);
        });
    });
  });

  async CreateTable() {
    let Table = await this.ExecuteQuery(`CREATE TABLE IF NOT EXISTS notification (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      status_read INTEGER,
      title VARCHAR(100),
      subject TEXT,
      content TEXT,
      icon TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      []);
    console.log(Table);
  }

  async InsertQuery(title, subject, content, icon) {
    let singleInsert = await this.ExecuteQuery(`INSERT INTO notification (
      status_read,
      title,
      subject,
      content,
      icon) VALUES ( ?, ?, ?, ?, ?)`,
      [0, title, subject, content, icon]);
    console.log(singleInsert);
  }

  async SelectQuery() {
    let selectQuery = await this.ExecuteQuery("SELECT *, datetime(created_at,'localtime') as createdAt FROM notification", []);
    const rows = selectQuery.rows;
    let dataQuery = []
    for (let i = 0; i < rows.length; i++) {
      var item = rows.item(i);
      dataQuery.push(item);
    }
    return dataQuery;
  }

  async UpdateQuery(status, id) {
    let updateQuery = await this.ExecuteQuery('UPDATE notification SET status_read = ? WHERE id = ?', [status, id]);
    console.log('updateQuery => ', updateQuery);
    if (updateQuery.rowsAffected > 0) return true;
    else return false;
  }

  async DeleteQuery(id) {
    let deleteQuery = await this.ExecuteQuery('DELETE FROM notification WHERE id = ?', [id]);
    // console.log('deleteQuery => ', deleteQuery);
    if (deleteQuery.rowsAffected > 0) return true;
    else return false;
  }
}

export default new SQLiteData();
