const express = require('express')
var cors = require('cors')
const mysql = require('mysql')
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express()

const port = 3000

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(express.static('kepek'))
app.use(express.static('szoveg'))


var connection
function kapcsolat()
{
   connection = mysql.createConnection({
    host          :     'localhost',
    user          :     'root',
    password      :     '',
    database      :     'zarodolgozat_utazas'
  })
  
  connection.connect()
  
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.get('/orszag', (req, res) => {
    
kapcsolat()
connection.query('SELECT * FROM orszag', (err, rows, fields) => {
  if (err) throw err

  console.log(rows)
  res.send(rows)
})
connection.end() 
})



app.get('/varos', (req, res) => {
    
  kapcsolat()
  connection.query('SELECT * FROM varos', (err, rows, fields) => {
    if (err) throw err
  
    console.log(rows)
    res.send(rows)
  })
  connection.end() 
  })
//-----------------------------------------




// ------ K É P F E L T Ö L T É S ----------\\



const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './kepek');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});


const upload = multer({ storage });

app.get('/', (req, res) => {
  res.status(200).send('You can post to /api/upload.');
});

app.post('/api/upload', upload.array('photo', 3), (req, res) => {
  console.log('file', req.files);
  console.log('body', req.body);


  // felvitel adatb-be
  kapcsolat()
  
  connection.query(`INSERT INTO orszag VALUES (NULL, '${req.body.bevitel1}', '${req.files[0].filename}')`, (err, rows, fields) => {
  if (err){
    console.log("Hiba")
    res.send("Hiba")
  }
  else{
    console.log("Sikeres felvitel")
    res.send("Sikeres felvitel")
  }    
  })
  connection.end()


  // felvitel adatb.be vége
  
  });


// INSERT INTO orszag VALUES (NULL, 'Ausztria', 'Austria.gif');
/*app.post('/felvitelzaszlo', (req, res) => {
  kapcsolat()
  
  connection.query(`INSERT INTO orszag VALUES (NULL, 'Alma', 'Austria.gif')`, (err, rows, fields) => {
  if (err){
    console.log("Hiba")
    res.send("Hiba")
  }
  else{
    console.log("Sikeres felvitel")
    res.send("Sikeres felvitel")
  }
  
  
  
  
  })
  connection.end() 
  })
*/
// ------ K É P F E L T Ö L T É S        V É G E----------\\




//~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  Picker segédtábla ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~\\
app.get('/segedVaros', (req, res) => {
    
  kapcsolat()
  connection.query('SELECT * FROM segedVaros', (err, rows, fields) => {
    if (err) throw err
  
    console.log(rows)
    res.send(rows)
  })
  connection.end() 
  })





app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})