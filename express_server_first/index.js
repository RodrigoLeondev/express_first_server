const { response } = require("express");
const express = require("express");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { request } = require("http");

const app = express()
app.use(express.json())  // -> cualquier dato a body va en json

/*
app.get("/hola", (request, response) => {
  response.write("Holaaa desde mi endpoint /hola")
  response.end()
})

app.post("/adios", (request, response) => {
  response.send("Estamos haciendo un post desde aqui")
})

// Callbacks
app.get("/callback", (request, response) => {
  fs.readFile("texto.txt", "utf8", (err, data) => {
    if(err) {
      response.send("Hubo un error")
      return
    }
    response.send(data)
  })
})

// Promises
app.get("/promises", (request, response) => {
  fsPromises.readFile("texto.txt", "utf8")
  .then((archivoALeer) => {
    response.send(archivoALeer)
  })
  .catch((err) => {
    response.send("Hubo un error")
  })
})

const resolver = async () => {
  const archivoLeido = await fsPromises.readFile("text.txt", "utf8")
  return archivoLeido
}
// Async/Await
// --> async/await -> try catch
app.get("/async", async (request, response) => {
  try {
    const archivoLeido = await fsPromises.readFile("text.txt", "utf8")
    response.send(archivoLeido)
  } catch(err) {
    console.log("err", err)
    response.send("Hubo un error.")
  }
})

app.get("/todos", async (request, response) => {
  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const kodersJson = JSON.parse(koders) // que este parseado a json.
  response.json(kodersJson) // -> Content/Type = application/json
})

app.get("/koders", async (request, response) => {
  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const kodersJson = JSON.parse(koders) // que este parseado a json.
  response.json(kodersJson.alumnos) // -> Content/Type = application/json
}); */



/* CLASE 7 */

// Estructura de mi enpoints como tiene que ser si quiero que me regrese Abraham
// -> /todos
// -> /koders
// -> /koders/Abraham
// -> /koders/Bere
// -> /koders/Victor

// Syntaxis universal -> /recurso/identicador
// identificador = name
// Path params

// Lo que manda el CLIENTE -> request
// Lo qiue manda el SERVIDOR -> response
// forEach, filter, map, reduce is not a function
// app.get("/koders/:nombre", async (request, response) => {

//   // Destructuracion
//   const { nombre } = request.params
//   const koders = await fsPromises.readFile("koders.json", "utf8")

//   const kodersJson = JSON.parse(koders)
//   const koderEncontrado = kodersJson.alumnos.filter((koder) => {
//     return koder.name.toLowerCase() === nombre.toLowerCase()
//   })

//   response.json(koderEncontrado)
// })

/**
 * -- Ejercicio --
 * Endpoints de GET
 * ruta -> koders/:id
 * Que me van a regresar, todo el objeto del koder encontrado con ese identificador
 * Que si ese ID no existe, me regresen -> Ese koder no fue encontrado.
 * TIP: fijense en los tipos de datos si no les sale.
 */

 app.get("/koders/:id", async (request, response) => {

  // Destructuracion
  const { id } = request.params
  const koders = await fsPromises.readFile("koders.json", "utf8")

  const kodersJson = JSON.parse(koders)
  const koderEncontrado = kodersJson.alumnos.filter((koder) => {
    return koder.id === parseInt(id)
  })

  if(!koderEncontrado.length) {
    response.json("El koder no fue encontrado")
    return;
  }

  response.json(koderEncontrado[0])
})

app.listen(8080, () => {
  console.log("Ya estamos escuchando desde nuestro servidor express");
})

// PATH QUERY



/* POST */  //un objeto no tiene push {}

/* app.post("/koders", async (request, response) => {
    // DETRUCTURACION
    const {name, gen, modulo, edad } = request.body  // -> recibir datos
    const koders = await fsPromises.readFile("koders.json", "utf8")
    const bd = JSON.parse(koders)
    const alumnos = bd.alumnos  // -> se guarda arreglo

    const newAlumnos = [...alumnos]   // Hacer un copy para trabajar con el

    // Al arreglo se hace un push con los datos que recibe del body
    newAlumnos.push({
        name,
        gen,
        modulo, 
        edad
    })
      // Reemplaza en mi base de datos(koders.json) mi arreglo alumnos, por el nuevo
    bd.alumnos = newAlumnos

      // Escribi en koders.json mi base de datos nueva, con un salto de linea y 4 de indentacion
    await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 2))


    response.json("El endpoint fue creado con éxito")
}) */


/* TAREA */

app.post("/koders", async (request, response) => {
  // DETRUCTURACION
  const {name, gen, modulo, edad } = request.body  // -> recibir datos
  const koders = await fsPromises.readFile("koders.json", "utf8")
  const bd = JSON.parse(koders)
  const alumnos = bd.alumnos  // -> se guarda arreglo

  const newAlumnos = [...alumnos]   // Hacer un copy para trabajar con el

  // Al arreglo se hace un push con los datos que recibe del body
  newAlumnos.push({
      name,
      gen,
      modulo, 
      edad
  })
    // Reemplaza en mi base de datos(koders.json) mi arreglo alumnos, por el nuevo
  bd.alumnos = newAlumnos

    // Escribi en koders.json mi base de datos nueva, con un salto de linea y 4 de indentacion
  await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 2))


  response.json("El endpoint fue creado con éxito")
})








/* PUT */

// Para inmutables = no se puede modificar
// Como en AWS s3

//  spreed operator = copia -> me hace un objeto {...}
// object assign -> setear (poner un valor en algun lugar que ya existe, 
// como volver a asignar) object.assign

app.put("/koders/:id", async (request, response) => {
  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const bd = JSON.parse(koders)

  // Destructuracion
  const { id } = request.params // -> esto es un string
  const { name, gen, modulo, edad } = request.body

  const alumnos = bd.alumnos

  // Encontrar el koder que queremos modificar
  const koderIndex = alumnos.findIndex(alumno => parseInt(id) === alumno.id)

  // Cambiar el objeto que esta en ese indice
  alumnos[koderIndex] = {
    id: alumnos[koderIndex].id,
    name,
    gen,
    modulo,
    edad
  }
  bd.alumnos = alumnos
  await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 2))

  response.json(alumnos[koderIndex])
})


/* PATCH */
app.patch("/koders/:id", async (request, response) => {
  
  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const bd = JSON.parse(koders)

  // Destructuracion
  const { id } = request.params

  // Me trae el index
  const koderIndex = bd.alumnos.findIndex(alumno => parseInt(id) === alumno.id)

  // Koder encontrado
  const koderEncontrado = bd.alumnos[koderIndex]


  for(const propiedad in request.body) {
    console.log(`${propiedad}: ${request.body[propiedad]}`)
    koderEncontrado[propiedad] = request.body[propiedad]
  }

  await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 2))

  response.json(koderEncontrado)
}) 

app.delete("/koders/:id", async (request, response) => {

  // Params
  const { id } = request.params
  

  const koders = await fsPromises.readFile("koders.json", "utf-8")
  const bd = JSON.parse(koders)

  const koderEncontrado = bd.alumnos.filter(koder => {
    return koder.id === parseInt(id)
  })

  if(!koderEncontrado.length) {
    response.status(404) // No se encontro el koder
    response.json({
      "message": "El koder solicitdado no se encontro"
    })
    return;
  }

  const kodersQueSeQuedan = bd.alumnos.filter((koder) => {
    if(koder.id !== parseInt(id)) {
      return koder
    }
  })


  // Modificacion
  bd.alumnos = kodersQueSeQuedan

  console.log("bd.alumnos", bd.alumnos)

  await fsPromises.writeFile("koders.json", JSON.stringify(bd, "\n", 2))

  response.status(202) //not found
  response.json("Se elimino exitosamente")

})