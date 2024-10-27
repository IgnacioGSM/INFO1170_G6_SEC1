    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('loginForm');
      const rutInput = document.getElementById('rut');
      const passwordInput = document.getElementById('password');
      const rutError = document.getElementById('rut-error');
      const passwordError = document.getElementById('password-error');

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        //limpia los mensajes de error
        rutError.textContent = '';
        passwordError.textContent = '';

        let isValid = true;

        // Por ahora no vamos a queckear que el rut sea realmente valido, solo que tenga un formato correcto
        limpiarRUT(rutInput);

        /*if(!validateRUT(rutInput.value)){
          rutError.textContent = "El RUT es invalido";
          rutError.style.display = 'block';
          isValid = false;
        }*/

        // La validación de la contraseña se hará en el backend
        if(!validatePassword(passwordInput.value)){
          passwordError.textContent = "La contraseñas debe tener al menos 8 caracteres";
          passwordError.style.display = 'block';
          isValid = false;
        }

        if (isValid) {
          // Enviar el formulario o realizar otra acción
          console.log('Formulario válido. Enviar datos al servidor...');
          form.submit();
        }
    });

    rutInput.addEventListener('input', function() {   // Al escribir en el campo rut se eliminan los espacio al inicio y los caracteres no permitidos
      this.value = this.value.trimStart();
      limpiarRUT(this);
    });

    rutInput.addEventListener('blur', function() {    // Al salir del campo rut se agregan los puntos y guión para que se vea bonito
      formatearRUT(this);
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

      // Funciones sacadas desde el archivo de validación de reserva public/js/index/validacion_reserva.js
    function formatearRUT(input) {
      let rut = input.value.replace(/[^\dkK]/g, ''); // Elimina caracteres no permitidos
      
      // dividir el rut en parte numerica y digito verificador
      let numerica = rut.slice(0, -1);
      let verificador = rut.slice(-1);

      // agregar puntos cada 3 digitos
      numerica = numerica.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      // \B se asegura de que la coincidencia no esté al principio de una palabra
      // ?= es una búsqueda positiva hacia adelante, significa que la expresión regular solo coincidirá si se encuentra lo que está dentro de los paréntesis a continuación
      // \d{3} significa que se esperan 3 dígitos
      // (?! significa que la expresión regular solo coincidirá si no se encuentra lo que está dentro de los paréntesis a continuación)
      // \d significa cualquier dígito
      // /g significa que la búsqueda se realiza en todo el texto

      input.value = numerica + (verificador ? "-" + verificador : '');
      // Se agrega guión y dígito verificador si es que este último existe
    }

    function limpiarRUT(input) {
    input.value = input.value.replace(/[^\dkK]/g, ''); // Elimina puntos y guiones
    }

    });