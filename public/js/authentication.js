 // DOM-Elemente für Auth
 const loginForm = document.getElementById('login-form');
 const userInfo = document.getElementById('user-info');
 const userEmail = document.getElementById('user-email');
 const emailInput = document.getElementById('email');
 const passwordInput = document.getElementById('password');
 const loginButton = document.getElementById('login-button');
 const registerButton = document.getElementById('register-button');
 const logoutButton = document.getElementById('logout-button');

 // Auth-Status überwachen
 window.auth.onAuthStateChanged(user => {
     if (user) {
         // Benutzer ist angemeldet
         loginForm.style.display = 'none';
         userInfo.style.display = 'flex';
         userEmail.textContent = user.email;         
         // Element für nicht angemeldete Benutzer ausblenden
         document.getElementById('app').style.display = 'block';
     } else {
         // Benutzer ist nicht angemeldet
         loginForm.style.display = 'block';
         userInfo.style.display = 'none';
         
         // Element für nicht angemeldete Benutzer ausblenden
         document.getElementById('app').style.display = 'none';
     }
 });

 // Login-Funktion
 loginButton.addEventListener('click', () => {
     const email = emailInput.value;
     const password = passwordInput.value;
     
     auth.signInWithEmailAndPassword(email, password)
         .then((userCredential) => {
             // Erfolgreicher Login
             console.log('Erfolgreich angemeldet!', userCredential.user);
         })
         .catch((error) => {
             // Fehler beim Login
             alert('Login fehlgeschlagen: ' + error.message);
             console.error('Login-Fehler:', error);
         });
 });

 // Registrierungs-Funktion
 registerButton.addEventListener('click', () => {
     const email = emailInput.value;
     const password = passwordInput.value;
     
     auth.createUserWithEmailAndPassword(email, password)
         .then((userCredential) => {
             // Erfolgreiche Registrierung
             console.log('Benutzer registriert!', userCredential.user);
         })
         .catch((error) => {
             // Fehler bei der Registrierung
             alert('Registrierung fehlgeschlagen: ' + error.message);
             console.error('Registrierungs-Fehler:', error);
         });
 });

 // Logout-Funktion
 logoutButton.addEventListener('click', () => {
     auth.signOut()
         .then(() => {
             console.log('Erfolgreich abgemeldet!');
         })
         .catch((error) => {
             console.error('Abmelde-Fehler:', error);
         });
 });