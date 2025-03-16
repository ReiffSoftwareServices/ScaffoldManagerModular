const StammdatenPage = {
    template: `
        <div class="stammdaten-container">
            <div class="submenu">
                <ul>
                    <li v-for="subpage in subpages" :key="subpage.name">
                        <a href="#" 
                           @click.prevent="currentSubpage = subpage.component" 
                           :class="{ active: currentSubpage === subpage.component }">
                            {{ subpage.name }}
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="subpage-content">
                <component :is="currentSubpage"></component>
            </div>
        </div>
    `,
    setup() {
        const { ref } = Vue;
        
        // Verfügbare Unterseiten
        const subpages = [
            { name: 'Leistungsverzeichnis', component: 'leistungsverzeichnis-page' },
            { name: 'Anmelder', component: 'users-page' }
        ];
        
        // Aktuelle Unterseite - standardmäßig Leistungsverzeichnis anzeigen
        const currentSubpage = ref('leistungsverzeichnis-page');
        
        return {
            subpages,
            currentSubpage
        };
    },
    components: {
        'leistungsverzeichnis-page': {
            template: `
                <div>
                    <h2>LV</h2>
                    <p>Hier können Sie die LVs verwalten.</p>
                </div>
            `
        },
        'users-page': {
            template: `
                <div>
                    <h2>Anmelder</h2>
                    <p>Hier können Sie die Anmelder verwalten.</p>
                </div>
            `
        }
    }
};