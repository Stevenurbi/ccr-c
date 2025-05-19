document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('residenceForm');
    if (!form) return;

    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Mostrar loader
        if (btnText) btnText.classList.add('hidden');
        if (btnLoader) btnLoader.classList.remove('hidden');
        if (submitBtn) submitBtn.disabled = true;

        // Validar campos requeridos
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let errorMessage = '';

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#e74c3c';
                errorMessage = 'Por favor complete todos los campos requeridos.';
            } else {
                field.style.borderColor = '#ddd';
            }
        });

        // Validar email
        const email = document.getElementById('email');
        if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            isValid = false;
            email.style.borderColor = '#e74c3c';
            errorMessage = 'Por favor ingrese un correo electrónico válido.';
        }

        if (!isValid) {
            if (errorAlert) {
                errorAlert.textContent = errorMessage;
                errorAlert.classList.remove('hidden');
            }
            if (successAlert) successAlert.classList.add('hidden');
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoader) btnLoader.classList.add('hidden');
            if (submitBtn) submitBtn.disabled = false;
            return;
        }

        // Crear objeto con los datos del formulario
        const formData = {
            firstName: document.getElementById('firstName')?.value,
            lastName: document.getElementById('lastName')?.value,
            email: email?.value,
            phone: document.getElementById('phone')?.value,
            apartment: document.getElementById('apartment')?.value,
            moveInDate: document.getElementById('moveInDate')?.value,
            documentType: document.getElementById('documentType')?.value,
            documentNumber: document.getElementById('documentNumber')?.value,
            purpose: document.getElementById('purpose')?.value,
            termsAccepted: document.getElementById('terms')?.checked,
            requestDate: new Date().toISOString()
        };

        try {
            // Enviar datos al backend
            const response = await fetch('http://localhost:3000/api/certificados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            let data = {};
            try {
                data = await response.json();
            } catch (jsonError) {
                data = { message: 'Respuesta inesperada del servidor.' };
            }

            if (response.ok) {
                // Redirige a success.html con el ID de la solicitud
                window.location.href = `success.html?requestId=${data.id || ''}`;
            } else {
                throw new Error(data.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            if (errorAlert) {
                errorAlert.textContent = error.message || 'Ocurrió un error al enviar el formulario. Por favor intente nuevamente.';
                errorAlert.classList.remove('hidden');
            }
            if (successAlert) successAlert.classList.add('hidden');
        } finally {
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoader) btnLoader.classList.add('hidden');
            if (submitBtn) submitBtn.disabled = false;
        }
    });

    // Mejorar la experiencia en móviles y limpiar mensajes al enfocar
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (errorAlert) errorAlert.classList.add('hidden');
            if (successAlert) successAlert.classList.add('hidden');
        });
    });
});