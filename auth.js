// Simple client-side auth simulation using localStorage
// WARNING: pour démo uniquement — ne pas utiliser en production

function _loadUsers(){
  try{return JSON.parse(localStorage.getItem('fs_users')||'[]')}catch(e){return[]}
}
function _saveUsers(u){localStorage.setItem('fs_users',JSON.stringify(u))}

function registerUser(username,email,password){
  const users=_loadUsers();
  if(!username||!email||!password) return {ok:false,msg:'Tous les champs sont requis.'};
  if(password.length<6) return {ok:false,msg:'Le mot de passe doit faire au moins 6 caractères.'};
  if(users.find(u=>u.email===email)) return {ok:false,msg:'Email déjà utilisé.'};
  users.push({username, email, password});
  _saveUsers(users);
  localStorage.setItem('fs_session', JSON.stringify({username,email}));
  return {ok:true};
}

function loginUser(email,password){
  const users=_loadUsers();
  const u = users.find(x=>x.email===email && x.password===password);
  if(!u) return {ok:false,msg:'Identifiants invalides.'};
  localStorage.setItem('fs_session', JSON.stringify({username:u.username,email:u.email}));
  return {ok:true};
}

function logout(){
  localStorage.removeItem('fs_session');
}

function currentUser(){
  try{return JSON.parse(localStorage.getItem('fs_session')||'null')}catch(e){return null}
}

// helper to show login status in pages
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
