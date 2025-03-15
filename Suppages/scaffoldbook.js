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
                    <h2>{{ geruest.id }}</h2>
                    <p><strong>Bereich:</strong> {{ geruest.bereich || 'Nicht angegeben' }}</p>
                    <p><strong>Status:</strong> {{ geruest.status }}</p>
                    <p><strong>Anmeldedatum:</strong> {{ formatDate(geruest.anmeldedatum) }}</p>
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
        });
        
        return {
            gerueste,
            loading,
            currentFilter,
            filteredGerueste,
            formatDate
        };
    }
};