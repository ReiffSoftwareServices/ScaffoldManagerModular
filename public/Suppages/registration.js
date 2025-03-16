const AnmeldungPage = {
    template: `
        <div>
            <h1>Gerüstanmeldung</h1>
            
            <div class="form-group">
                <label for="scaffoldInput">Gerüstnummer:</label>
                <input type="text" id="scaffoldInput" v-model="scaffold" disabled class="disabled-input" title="Wird automatisch generiert"><br>
                <label for="areaInput">Bereich:</label>
                <input type="text" id="areaInput" placeholder="Gib einen Bereich ein..." v-model="area">
            </div><br>
            
            <button @click="saveScaffold" :disabled="!area">Gerüst anmelden</button>
            
            <div id="messageDisplay" v-if="statusMessage" :class="statusType">
                {{ statusMessage }}
            </div>
            
            <div v-if="loading" class="loading-indicator">
                Lade Daten...
            </div>
        </div>
    `,
    setup() {
        const { ref, onMounted } = Vue;
        
        const scaffold = ref('G001'); // Standardwert, wird automatisch aktualisiert
        const area = ref('');
        const statusMessage = ref('');
        const statusType = ref('');
        const loading = ref(false);
        
        // Funktion zum Generieren der nächsten Gerüstnummer
        const generateNextScaffoldId = () => {
            loading.value = true;
            
            // Firestore-Abfrage, um alle Gerüste zu laden
            firebase.firestore().collection('gerueste')
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        scaffold.value = 'G001'; // Standardwert, wenn keine Gerüste vorhanden sind
                        loading.value = false;
                        return;
                    }
                    
                    // Extrahiere alle numerischen IDs und finde die höchste
                    const numericIds = [];
                    
                    querySnapshot.forEach((doc) => {
                        const geruestData = doc.data();
                        if (geruestData.id) {
                            // Extrahiere die Nummer aus der ID (z.B. "G001" -> 1)
                            const match = geruestData.id.match(/G(\d+)/);
                            if (match) {
                                const numericId = parseInt(match[1], 10);
                                if (!isNaN(numericId)) {
                                    numericIds.push(numericId);
                                }
                            }
                        }
                    });
                    
                    // Finde die höchste ID
                    const highestId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
                    
                    // Generiere die nächste ID mit führenden Nullen
                    const nextId = highestId + 1;
                    scaffold.value = `G${nextId.toString().padStart(3, '0')}`;
                    
                    loading.value = false;
                    console.log('Nächste Gerüstnummer generiert:', scaffold.value);
                })
                .catch((error) => {
                    console.error('Fehler beim Laden der Gerüste:', error);
                    loading.value = false;
                    // Fallback auf Standardwert bei Fehler
                    scaffold.value = 'G001';
                });
        };
        
        // Firebase initialisieren
        const saveScaffold = () => {            
            loading.value = true;
            
            // Dokument in Firestore speichern
            firebase.firestore().collection('gerueste').add({
                id: scaffold.value,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                anmeldedatum: new Date().toISOString().split('T')[0],
                status: 'angemeldet',
                area: area.value
            })
            .then(() => {
                showMessage('Gerüst erfolgreich angemeldet!', 'success');
                area.value = '';
                // Neue Gerüstnummer generieren für das nächste Gerüst
                generateNextScaffoldId();
            })
            .catch((error) => {
                showMessage('Fehler beim Speichern: ' + error.message, 'error');
                console.error('Fehler beim Speichern:', error);
                loading.value = false;
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
        
        // Beim Mounten der Komponente die nächste Gerüstnummer generieren
        onMounted(() => {
            generateNextScaffoldId();
        });
        
        return {
            scaffold,
            area,
            statusMessage,
            statusType,
            saveScaffold,
            loading
        };
    }
};