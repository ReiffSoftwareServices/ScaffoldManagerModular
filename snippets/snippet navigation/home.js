const HomePage = {
    template: `
        <div>
            <h1>Willkommen</h1>
            <p>Willkommen auf unserer Beispiel-Webseite mit Vue.js Navigation.</p>
            <p>Hier könnte der Inhalt deiner Homepage stehen. Lorem ipsum dolor sit amet, 
            consectetur adipiscing elit. Nullam eget felis eget turpis convallis aliquam.</p>
            <button @click="showAlert">Klick mich</button>
        </div>
    `,
    setup() {
        const showAlert = () => {
            alert('Du hast auf den Button geklickt!');
        };
        
        return {
            showAlert
        };
    }
};