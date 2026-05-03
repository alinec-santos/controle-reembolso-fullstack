// codigo que sobe o servidor

import app from "./app"

const PORT = 3000

app.listen(PORT, () => { //sobe o servidor
  console.log(` Server running on port ${PORT}`)
})