const AnmeldungPage = {
    template: `
        <div>
            <h1>Gerüstanmeldung</h1>
            
            <div class="form-group">
                <input type="text" id="textInput" placeholder="Gib eine Gerüstnummer ein ein..." v-model="scaffold"><br>
                <input type="text" id="textInput" placeholder="Gib einen Bereich ein..." v-model="Bereich">
            </div><br>
            
            <button @click="saveScaffold">Gerüst anmelden</button>
            
            <div id="messageDisplay" v-if="statusMessage" :class="statusType">
                {{ statusMessage }}
            </div>
        </div>
    `,
    setup() {
        const { ref } = Vue;
        
        const scaffold = ref('');
        const Bereich = ref('');
        const statusMessage = ref('');
        const statusType = ref('');
        
        // Firebase initialisieren
        const saveScaffold = () => {
            if (scaffold.value.trim() === '') {
                showMessage('Bitte gib eine Gerüst ID Text ein!', 'error');
                return;
            }
            
            // Dokument in Firestore speichern
            firebase.firestore().collection('gerueste').add({
                id: scaffold.value,
                createdAt: new Date().toISOString().split('T')[0],
                status: 'angemeldet',
                Bereich: Bereich.value

            })
            .then(() => {
                showMessage('Nachricht erfolgreich gespeichert!', 'success');
                scaffold.value = '';
                Bereich.value = '';
            })
            .catch((error) => {
                showMessage('Fehler beim Speichern: ' + error.message, 'error');
                console.error('Fehler beim Speichern:', error);
            });
        };
        
        // Hilfsfunktion zum Anzeigen von Nachrichten
        const showMessage = (text, type) => {
            statusMessage.value = text;
            statusType.value = type;
            
            setTimeout(() => {
                statusMessage.value = '';
            }, 3000);
        };
        
        return {
            scaffold,
            statusMessage,
            statusType,
            saveScaffold
        };
    }
};