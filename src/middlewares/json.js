export async function json(req, res, next) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.stringify(Buffer.concat(buffers).toString());
  } catch (err) {
    req.body = null;
  }

  res.setHeader("Content-Type", "application/json");

  next();
}
