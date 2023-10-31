import fs from "node:fs";
import { parse } from "csv-parse";

// Caminho relativo do aquivo
const csvPath = new URL("./tasks.csv", import.meta.url);

// Criar uma stream de leitura do arquivo
const streamCSV = fs.createReadStream(csvPath);

// configurar a stream de parse do csv
const csvParse = parse({
  delimiter: ",",
  skip_empty_lines: true,
  /// começar a ler o arquivo a partir da segunda linha
  from_line: 2,
});

async function run() {
  // Transferir chucks da stream de leitura do arquivo
  // na stream de conversão
  const linesParse = streamCSV.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    // Uncomment this line to see the import working in slow motion (open the db.json)
    await wait(1000);
  }
}

run();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
