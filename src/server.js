import { server } from "./app.js";

const PORT = 3333;

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
