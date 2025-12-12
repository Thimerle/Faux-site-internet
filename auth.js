// Auth client-side wrapper that uses the backend API (JWT)
// Stores token and user in localStorage under keys `fs_token` and `fs_user`.

function _saveSession(token, user){
  if(token) localStorage.setItem('fs_token', token);
  if(user) localStorage.setItem('fs_user', JSON.stringify(user));
}

function logout(){
  localStorage.removeItem('fs_token');
  localStorage.removeItem('fs_user');
}

function currentUser(){
  try{ return JSON.parse(localStorage.getItem('fs_user')||'null'); }catch(e){ return null }
}

async function registerUser(username,email,password){
  if(!username||!email||!password) return {ok:false,msg:'Tous les champs sont requis.'};
  const res = await fetch('/api/register',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,email,password})
  });
  const j = await res.json();
  if(!res.ok) return {ok:false,msg: j.error || j.message || 'Erreur'};
  _saveSession(j.token, j.user);
  injectAuthLinks();
  return {ok:true};
}

async function loginUser(email,password){
  if(!email||!password) return {ok:false,msg:'Tous les champs sont requis.'};
  const res = await fetch('/api/login',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})
  });
  const j = await res.json();
  if(!res.ok) return {ok:false,msg: j.error || j.message || 'Erreur'};
  _saveSession(j.token, j.user);
  injectAuthLinks();
  return {ok:true};
}

function injectAuthLinks(){
  const usr = currentUser();
  const container = document.getElementById('authLinks');
  if(!container) return;
  container.innerHTML = usr ? `<a href="profile.html">${usr.username}</a> • <a href="#" id="logoutBtn">Déconnexion</a>` : `<a href="login.html">Se connecter</a> • <a href="register.html">S'inscrire</a>`;
  const btn = document.getElementById('logoutBtn');
  if(btn) btn.addEventListener('click',e=>{e.preventDefault(); logout(); injectAuthLinks(); window.location.href='index.html';});
}

document.addEventListener('DOMContentLoaded', ()=>{
  injectAuthLinks();
});
