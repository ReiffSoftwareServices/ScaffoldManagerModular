const GeruestbuchPage = {
    template: `
        <div>
            <h1>Gerüstbuch</h1>
            
            <div class="filter-buttons">
                <button 
                    @click="currentFilter = 'alle'"
                    :class="{ active: currentFilter === 'alle' }">
                    Alle anzeigen
                </button>
                <button 
                    @click="currentFilter = 'angemeldet'"
                    :class="{ active: currentFilter === 'angemeldet' }">
                    Angemeldet
                </button>
                <button 
                    @click="currentFilter = 'umgebaut'"
                    :class="{ active: currentFilter === 'umgebaut' }">
                    Umgebaut
                </button>
                <button 
                    @click="currentFilter = 'abgemeldet'"
                    :class="{ active: currentFilter === 'abgemeldet' }">
                    Abgemeldet
                </button>
            </div>
            
            <div v-if="loading" class="loading">
                Daten werden geladen...
            </div>
            
            <div v-else>
                <div v-for="geruest in filteredGerueste" :key="geruest.id" 
                     class="geruest" :class="geruest.status">
                    <!-- Lösch-Icon (Kreuz) oben rechts -->
                    <div class="delete-icon" @click="deleteGeruest(geruest.docId)" title="Gerüst löschen">
                        &#10006;
                    </div>
                    
                    <h2>{{ geruest.id }}</h2>
                    <p><strong>Bereich:</strong> {{ geruest.area || 'Nicht angegeben' }}</p>
                    <p><strong>Status:</strong> {{ geruest.status }}</p>
                    <p><strong>Anmeldedatum:</strong> {{ formatDate(geruest.anmeldedatum) }}</p>
                    
                    <!-- Abmelde-Button, nur anzeigen wenn Status nicht "abgemeldet" ist -->
                    <button 
                        v-if="geruest.status !== 'abgemeldet'"
                        @click="changeStatus(geruest.docId, 'abgemeldet')"
                        class="action-button abmelden-button">
                        Gerüst abmelden
                    </button>
                </div>
                
                <div v-if="filteredGerueste.length === 0">
                    <p>Keine Gerüste für den ausgewählten Filter gefunden.</p>
                </div>
            </div>
        </div>
    `,
    setup() {
        const { ref, computed, onMounted } = Vue;
        
        // Gerüstdaten und Loading-Status
        const gerueste = ref([]);
        const loading = ref(true);
        
        // Aktueller Filter
        const currentFilter = ref('alle');
        
        // Gefilterte Gerüste
        const filteredGerueste = computed(() => {
            if (currentFilter.value === 'alle') {
                return gerueste.value;
            }
            return gerueste.value.filter(g => g.status === currentFilter.value);
        });
        
        // Hilfsfunktion zum Formatieren des Datums
        const formatDate = (dateString) => {
            if (!dateString) return 'Kein Datum';
            
            try {
                // Handle Firestore Timestamp objects
                if (dateString.toDate && typeof dateString.toDate === 'function') {
                    const date = dateString.toDate();
                    return date.toLocaleDateString('de-DE');
                }
                
                // Handle ISO date strings
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return new Date(dateString).toLocaleDateString('de-DE', options);
            } catch (e) {
                console.error('Fehler beim Formatieren des Datums:', e);
                return 'Ungültiges Datum';
            }
        };
        
        // Funktion zum Ändern des Status eines Gerüsts
        const changeStatus = (docId, newStatus) => {
            if (!docId) {
                console.error('Keine Dokument-ID angegeben');
                return;
            }
            
            loading.value = true;
            
            // Firestore-Update
            firebase.firestore().collection('gerueste').doc(docId)
                .update({
                    status: newStatus,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    console.log(`Status des Gerüsts ${docId} auf "${newStatus}" geändert`);
                    // Daten neu laden, um die Änderungen anzuzeigen
                    loadGerueste();
                })
                .catch((error) => {
                    console.error('Fehler beim Ändern des Status:', error);
                    loading.value = false;
                    alert('Fehler beim Ändern des Status. Bitte versuchen Sie es erneut.');
                });
        };
        
        // Funktion zum Löschen eines Gerüsts
        const deleteGeruest = (docId) => {
            if (!docId) {
                console.error('Keine Dokument-ID angegeben');
                return;
            }
            
            // Bestätigung vom Benutzer einholen
            if (!confirm('Sind Sie sicher, dass Sie dieses Gerüst endgültig löschen möchten?')) {
                return; // Abbrechen, wenn der Benutzer nicht bestätigt
            }
            
            loading.value = true;
            
            // Firestore-Löschung
            firebase.firestore().collection('gerueste').doc(docId)
                .delete()
                .then(() => {
                    console.log(`Gerüst ${docId} wurde gelöscht`);
                    // Daten neu laden, um die Änderungen anzuzeigen
                    loadGerueste();
                })
                .catch((error) => {
                    console.error('Fehler beim Löschen des Gerüsts:', error);
                    loading.value = false;
                    alert('Fehler beim Löschen des Gerüsts. Bitte versuchen Sie es erneut.');
                });
        };
        
        // Daten aus Firestore laden
        const loadGerueste = () => {
            loading.value = true;
            
            // Firestore-Abfrage
            firebase.firestore().collection('gerueste')
                .orderBy('createdAt', 'desc') // Neueste zuerst
                .get()
                .then((querySnapshot) => {
                    const geruesteListe = [];
                    
                    querySnapshot.forEach((doc) => {
                        // Dokument-ID und -Daten kombinieren
                        const geruest = {
                            docId: doc.id, // Firestore-Dokument-ID
                            ...doc.data()
                        };
                        geruesteListe.push(geruest);
                    });
                    
                    gerueste.value = geruesteListe;
                    loading.value = false;
                    console.log('Geladene Gerüste:', geruesteListe);
                })
                .catch((error) => {
                    console.error('Fehler beim Laden der Gerüste:', error);
                    loading.value = false;
                });
        };
        
        // Beim Mounten der Komponente Daten laden
        onMounted(() => {
            loadGerueste();
            
            // CSS für das Lösch-Icon hinzufügen
            const style = document.createElement('style');
            style.textContent = `
                .geruest {
                    position: relative;
                }
                .delete-icon {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 18px;
                    color: #ff4444;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }
                .delete-icon:hover {
                    background-color: #ff4444;
                    color: white;
                    transform: scale(1.1);
                }
            `;
            document.head.appendChild(style);
        });
        
        return {
            gerueste,
            loading,
            currentFilter,
            filteredGerueste,
            formatDate,
            changeStatus,
            deleteGeruest
        };
    }
};