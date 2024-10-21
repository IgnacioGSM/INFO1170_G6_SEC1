    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('loginForm');
      const rutInput = document.getElementById('rut');
      const passwordInput = document.getElementById('password');
      const rutError = document.getElementById('rutError');
      const passwordError = document.getElementById('passwordError');

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        //limpia los mensajes de error
        rutError.textContent = '';
        passwordError.textContent = '';

        let isValid = true;

        if(!validateRUT(rutInput.value)){
          rutError.textContent = "El RUT es invalido";
          isValid = false;
        }

        if(!validatePassword(passwordInput.value)){
          passwordError.textContent = "La contraseñas debe tener al menos 8 caracteres";
          isValid = false;
        }

        if (isValid) {
          // Enviar el formulario o realizar otra acción
          console.log('Formulario válido. Enviar datos al servidor...');
        }
    });
    
    function validateRUT(rut){
      const cleanRUT = rut.replace(/\./g, '').replace('-','');
      if (!/^\d{7,8}[0-9Kk]$/.test(cleanRUT)){
        return false;
      }

      const digits = cleanRUT.slice(0, -1);
      const verifier = cleanRUT.slice(-1).toUpperCase();

      const sum = digits.split('').reverse().reduce((acc, digit, index) => {
        const factor = (2 + index) % 7 + 2;
        return acc + parseInt(digit) * factor;
      }, 0);

      const remainder = 11 - (sum % 11);
      const calculatedVerifier = remainder === 11 ? '0' : remainder === 10 ? 'K' : remainder.toString();

      return calculatedVerifier === verifier;
    }

      // Validación de la contraseña
      function validatePassword(password){
      return password.length >=8;
      }
    });