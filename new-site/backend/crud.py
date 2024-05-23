from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/api/jobs', methods=['GET'])
def list_jobs():
    conn = sqlite3.connect('path/to/database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM jobs')
    jobs = cursor.fetchall()
    conn.close()
    return jsonify(jobs)

@app.route('/api/job', methods=['POST'])
def create_job():
    job = request.json
    conn = sqlite3.connect('path/to/database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO jobs (title, company, location, description) VALUES (?, ?, ?, ?)',
                   (job['title'], job['company'], job['location'], job['description']))
    conn.commit()
    conn.close()
    return '', 201

@app.route('/api/job/update', methods=['PUT'])
def update_job():
    job = request.json
    conn = sqlite3.connect('path/to/database.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE jobs SET title=?, company=?, location=?, description=? WHERE id=?',
                   (job['title'], job['company'], job['location'], job['description'], job['id']))
    conn.commit()
    conn.close()
    return '', 200

@app.route('/api/job/delete', methods=['DELETE'])
def delete_job():
    job = request.json
    conn = sqlite3.connect('path/to/database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM jobs WHERE id=?', (job['id'],))
    conn.commit()
    conn.close()
    return '', 200

if __name__ == '__main__':
    app.run(debug=True)
