from flask import Flask, request, redirect, url_for, render_template
import sqlite3

app = Flask(__name__)

def init_db():
    with sqlite3.connect('mi_base_de_datos.db') as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                rut TEXT NOT NULL,
                correo TEXT NOT NULL
            );
        ''')
        conn.commit()

@app.route('/', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form['Nombre']
        rut = request.form['rut']
        correo = request.form['correo']
        
        with sqlite3.connect('mi_base_de_datos.db') as conn:
            conn.execute('''
                INSERT INTO usuarios (nombre, rut, correo)
                VALUES (?, ?, ?)
            ''', (nombre, rut, correo))
            conn.commit()
        
        return redirect(url_for('registro'))

    return render_template('registro.html')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)