const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DB_FILE = path.join(__dirname, 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function readDB(){
  try { return JSON.parse(fs.readFileSync(DB_FILE,'utf8')); } catch(e){ return {users:[], products:[]}; }
}
function writeDB(db){ fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static front-end files (from repo root)
app.use('/', express.static(path.join(__dirname, '..')));

// API: products
app.get('/api/products', (req,res)=>{
  const db = readDB();
  res.json(db.products);
});

// API: register
app.post('/api/register', async (req,res)=>{
  const {username,email,password} = req.body || {};
  if(!username||!email||!password) return res.status(400).json({error:'Tous les champs sont requis.'});
  const db = readDB();
  if(db.users.find(u=>u.email===email)) return res.status(400).json({error:'Email déjà utilisé.'});
  const hash = await bcrypt.hash(password, 10);
  const user = {id: Date.now(), username, email, password: hash};
  db.users.push(user);
  writeDB(db);
  const token = jwt.sign({id:user.id,email:user.email,username:user.username}, JWT_SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id, username:user.username, email:user.email}});
});

// API: login
app.post('/api/login', async (req,res)=>{
  const {email,password} = req.body || {};
  if(!email||!password) return res.status(400).json({error:'Tous les champs sont requis.'});
  const db = readDB();
  const user = db.users.find(u=>u.email===email);
  if(!user) return res.status(401).json({error:'Identifiants invalides.'});
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({error:'Identifiants invalides.'});
  const token = jwt.sign({id:user.id,email:user.email,username:user.username}, JWT_SECRET, {expiresIn:'7d'});
  res.json({token, user:{id:user.id, username:user.username, email:user.email}});
});

// Protected example: get current user
app.get('/api/me', (req,res)=>{
  const auth = req.headers.authorization || '';
  if(!auth.startsWith('Bearer ')) return res.status(401).json({error:'Missing token'});
  const token = auth.slice(7);
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({user: payload});
  }catch(e){ res.status(401).json({error:'Invalid token'}) }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Server running on http://localhost:${port}`));
