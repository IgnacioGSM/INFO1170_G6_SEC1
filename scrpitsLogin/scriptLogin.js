
    const form = document.getElementById('loginForm');
    const rutInput = document.getElementById('rut');
    const passwordInput = document.getElementById('password');
    const rutError = document.getElementById('rutError');
    const passwordError = document.getElementById('passwordError');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let isValid = true;
      rutError.textContent = '';
      passwordError.textContent = '';

      const rutValue = rutInput.value.trim().replace("-", ""); // Eliminar guion si existe
      const digits = rutValue.slice(0, -1);
      const verifier = rutValue.slice(-1).toUpperCase();

      // Validación del RUT según normativa chilena
      if (digits.length !== 8 || isNaN(digits)) {
        rutError.textContent = 'El RUT debe tener 8 dígitos numéricos.';
        isValid = false;
      } else {
        const sum = digits.split('').reverse().reduce((acc, digit, index) => {
          const factor = (2 + index) % 7 + 2;
          return acc + parseInt(digit) * factor;
        }, 0);
        const remainder = 11 - (sum % 11);
        const calculatedVerifier = remainder === 11 ? '0' : remainder === 10 ? 'K' : remainder.toString();

        if (calculatedVerifier !== verifier) {
          rutError.textContent = 'El dígito verificador del RUT es inválido.';
          isValid = false;
        }
      }

      // Validación de la contraseña
      const passwordValue = passwordInput.value.trim();
      if (passwordValue.length < 8) {
        passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        isValid = false;
      }

      if (isValid) {
        // Enviar el formulario o realizar otra acción
        console.log('Formulario válido. Enviar datos al servidor...');
      }
    });
  