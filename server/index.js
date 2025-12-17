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
  // if auth provided, try to return a personalized ordering
  const auth = req.headers.authorization || '';
  if(auth.startsWith('Bearer ')){
    const token = auth.slice(7);
    try{
      const payload = jwt.verify(token, JWT_SECRET);
      const user = db.users.find(u=>u.id==payload.id);
      if(user && typeof user.recoSeed !== 'undefined'){
        // seeded shuffle so same user sees same ordering across devices
        const seed = user.recoSeed;
        const shuffled = seededShuffle(db.products, seed);
        return res.json(shuffled);
      }
    }catch(e){ /* invalid token -> fallback to public list */ }
  }
  res.json(db.products);
});

// API: register
app.post('/api/register', async (req,res)=>{
  const {username,email,password} = req.body || {};
  if(!username||!email||!password) return res.status(400).json({error:'Tous les champs sont requis.'});
  const db = readDB();
  if(db.users.find(u=>u.email===email)) return res.status(400).json({error:'Email déjà utilisé.'});
  const hash = await bcrypt.hash(password, 10);
  // assign a deterministic recommendation seed so products can be personalized
  const recoSeed = Math.floor(Math.random()*1000000);
  const user = {id: Date.now(), username, email, password: hash, recoSeed, savedProducts: []};
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

// Deterministic shuffle (mulberry32 PRNG)
function mulberry32(a){
  return function(){
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function seededShuffle(arr, seed){
  const r = mulberry32(seed);
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(r()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
