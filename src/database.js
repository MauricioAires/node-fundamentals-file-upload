import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  /**
   * Para criar propriedades privadas
   * em classes javascript devemos adicionar um # do nome da
   * propriedade dessa forma ela ficar disponível
   * apenas dentro da classe, isso funciona tanto para
   * propriedades com para métodos
   */
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);

      this.#persist();
      return;
    }

    this.#database[table] = [data];

    this.#persist();

    return data;
  }

  select(table, search) {
    let data = this.#database[table];

    // let it change

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    if (!data) {
      return [];
    }

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex === -1) {
      return;
    }

    this.#database[table].splice(rowIndex, 1);

    this.#persist();
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex === -1) {
      return;
    }

    this.#database[table][rowIndex] = {
      id,
      ...data,
    };

    this.#persist();
  }
}
