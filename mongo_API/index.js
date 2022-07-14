const { response } = require("express");
const { request } = require("express");
const express = require("express");
const mongoose = require("mongoose")

const app = express();
app.use(express.json())

/* Middleware clase 08/07/2022
app.use(middleware)

*Sirven para casos de uso que se tiene que hacer antes de llegar a su punto final
*Synchronoos
*next --> FUNCTION()

*/
app.use((request, response, next)=>{
  console.log("estoy en mi middleware 1")
  next()
})

 const middlewareRuta = ((request, response, next) => {
   console.log("Middleware para la ruta de Get")
   next()
 })


app.get("/", (request, response) => {
    response.json({
        "message": "Endpoint de HOME"
    })
})



const koderSchema = new mongoose.Schema({
    name: {
        type: String,
        minlengt: 3,
        maxlenght: 20,
        required: true
    },
    edad: {
        type: Number,
        min: 18,
        max: 150,
    },
    gen: {
    type: String, 
    required: true   
    },
    modulo: {
        type: String
    },
    hobbies: {
        type: [String]
    },
    sexo:{
        type: String,
        enum: ["f", "m", "o"]
    }
})



// MODELOS  --> koders es el nombre a elegir
const Koders = mongoose.model("koders", koderSchema)

app.get("/koders", async (request, response) =>{
    try{
            // utilizar el modelo para accedre a la DB
    const koders = await Koders.find({})  //--> promesa
    response.json({
        succes: true,
        data: {koders}
    })

    }catch(error) {
        response.status(400)
        response.json({
        succes: false,
        error
    })
    }
})

/* Para agregar un Middleware a un endpoint
Pasa como declaración       
*/
// Los identificadoes van de path params
app.get("/koders/:identificador", middlewareRuta, async (request, response) => {
    // Destructuración (sacar de un objeto), formas:
    // request.identificador
    // const identificador = request.identificador
    try{
        const { identificador } = request.params
        const koder = await Koders.findById(identificador, {name: true})
        response.json({
        succes: true,
        data: {
            koder
        }
    })
    } catch(error){

        response.status(400)
        response.json({
        succes:false,
        message: error.message
    })    
  }
})

/* ENDPOINT -> PATCH
ACTUALIZAR EL KODER
*/

app.patch("/koders/:id", async (request, response) =>{
  console.log("Patch")
  const { name, gen } = request.body
  console.log("Patch_1", request.params.id )
  try{
      const koders = await Koders.findByIdAndUpdate(  request.params.id, { name: name , gen: gen }  )
      console.log( "koders _1", koders )
      response.json( koders )
  }catch( error ){
      response.status(404)
      response.json({
          success: false,
          message: error.message
      })
  }
})




// POST
app.post("/koders", middlewareRuta, async (request, response) => {
  try{

    const koder = await Koders.create(request.body) // Koder es el modelo
    response.status(201)
    response.json({
      data: {
        koder
      }
    })

  }catch(error){
    response.status(400)
    response.json(({
      succes: false,
      message: error.message
    }))
  }
})
  

// DELETE
app.delete("/koders/:id", async (request, response) =>{
  // Si se saca del request.params, siginifica  que se lo tenemos que mandar en la petición
  const { id } = request.params  // Si no se saca de aquí, es indefinido

  try{
    const kodersDelete = await Koders.findByIdAndDelete(id)
    response.status(201)
    response.json({
    succes: true,
    message: "Eliminado correctamente"
    })

  } catch(error){
    response.status(400)  
    response.json(({
      succes: false,
      message: error.message 
    }))
  }
})


// Conectando con DB de Mongo
mongoose.connect("mongodb+srv://Rod:Galaxya5a@kodemia.zty8zli.mongodb.net/kodemia")
.then(()=> {
    console.log("BD connect")

    app.listen(8080,(request, response) => {
        console.log("Servidor encendido")
    })
}).catch(()=>{
    console.log("No se pudo conectar", err)
})



// Primero se conecta a la base de datos, después se prende el servidor