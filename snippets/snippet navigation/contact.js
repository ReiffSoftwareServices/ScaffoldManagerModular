const ContactPage = {
    template: `
        <div>
            <h1>Kontakt</h1>
            <p>Du kannst uns über die folgenden Wege erreichen:</p>
            
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" v-model="formData.name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">E-Mail:</label>
                    <input type="email" id="email" v-model="formData.email" required>
                </div>
                
                <div class="form-group">
                    <label for="message">Nachricht:</label>
                    <textarea id="message" v-model="formData.message" rows="4" required></textarea>
                </div>
                
                <button type="submit">Nachricht senden</button>
            </form>
            
            <div v-if="formSubmitted" class="success-message">
                Danke für deine Nachricht! Wir werden uns bald bei dir melden.
            </div>
        </div>
    `,
    setup() {
        const { ref } = Vue;
        
        const formData = ref({
            name: '',
            email: '',
            message: ''
        });
        
        const formSubmitted = ref(false);
        
        const submitForm = () => {
            // Hier würde normalerweise der API-Aufruf stattfinden
            console.log('Form submitted:', formData.value);
            formSubmitted.value = true;
            
            // Formular zurücksetzen
            formData.value = {
                name: '',
                email: '',
                message: ''
            };
            
            // Nach 3 Sekunden die Erfolgsmeldung ausblenden
            setTimeout(() => {
                formSubmitted.value = false;
            }, 3000);
        };
        
        return {
            formData,
            formSubmitted,
            submitForm
        };
    }
};