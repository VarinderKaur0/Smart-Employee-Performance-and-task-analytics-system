import os
import sqlite3
# from flask import Flask, request, jsonify
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
import random

app = Flask(__name__)
CORS(app)

pending_approvals = {}

# WARNING: Replace these placeholders with your actual email credentials before production deployment.
# We recommend using environment variables or a secure vault instead of hardcoding.
SMTP_SENDER = "varinderkaur88888888888@gmail.com"
SMTP_APP_PASSWORD = "zducgovmhwiwilvn"
SMTP_RECEIVER = "varinderkaur88888888888@gmail.com"


DB_PATH = 'db.sqlite'

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if old schema exists without new columns
    cursor.execute("PRAGMA table_info(employees)")
    columns = [info[1] for info in cursor.fetchall()]
    if columns and ('department' not in columns or 'teamwork' not in columns):
        cursor.execute("DROP TABLE IF EXISTS employees")
        
    # Create employees table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            password TEXT,
            name TEXT,
            department TEXT,
            experience REAL,
            technical REAL,
            leadership REAL,
            communication REAL,
            teamwork REAL,
            overall REAL,
            work_hours REAL,
            overtime REAL,
            performance_category TEXT
        )
    ''')
    # Create admin_sessions table for 2FA
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admin_sessions (
            session_id TEXT PRIMARY KEY,
            token TEXT UNIQUE,
            status TEXT DEFAULT 'pending',
            created_at REAL
        )
    ''')
    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Init the db on startup
init_db()


@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/app.js")
def js_file():
    return send_from_directory(".", "app.js")

@app.route("/style.css")
def css_file():
    return send_from_directory(".", "style.css")


@app.route('/api/admin/config', methods=['GET', 'POST'])
def handle_config():
    conn = get_db()
    
    if request.method == 'GET':
        cursor = conn.execute('SELECT key, value FROM config')
        rows = cursor.fetchall()
        config = {
            'topPerformerThreshold': '300',
            'powerBiLink': ''
        }
        for r in rows:
            if r['key'] in config:
                config[r['key']] = r['value']
        
        emp_count = conn.execute('SELECT COUNT(*) FROM employees').fetchone()[0]
        config['employeeCount'] = emp_count
        
        # Count employees with at least one NULL in required fields
        missing_count = conn.execute('''
            SELECT COUNT(*) FROM employees 
            WHERE name IS NULL OR department IS NULL OR experience IS NULL OR 
                  technical IS NULL OR leadership IS NULL OR communication IS NULL OR teamwork IS NULL OR
                  work_hours IS NULL OR overtime IS NULL
        ''').fetchone()[0]
        config['missingDataCount'] = missing_count
        
        return jsonify(config)
        
    elif request.method == 'POST':
        try:
            data = request.json or {}
            keys_to_save = ['topPerformerThreshold', 'powerBiLink']
            for k in keys_to_save:
                if k in data:
                    conn.execute('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', (k, str(data[k])))
            conn.commit()
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/metrics/home', methods=['GET'])
def get_home_metrics():
    conn = get_db()
    total = conn.execute('SELECT COUNT(*) FROM employees').fetchone()[0]
    if total == 0:
        return jsonify({
            "total_employees": 0,
            "average_overall": 0.0,
            "high_performers": 0
        })
    avg_overall = conn.execute('SELECT AVG(overall) FROM employees').fetchone()[0]
    
    # Get threshold from config
    cursor = conn.execute('SELECT value FROM config WHERE key = "topPerformerThreshold"')
    row = cursor.fetchone()
    threshold = float(row[0]) if row else 300.0
    
    # Count employees who scored above the given threshold
    # Total Score = technical + leadership + communication + teamwork
    # Use COALESCE to treat NULLs as 0 during comparison
    high_perf = conn.execute('''
        SELECT COUNT(*) FROM employees 
        WHERE (COALESCE(technical, 0) + COALESCE(leadership, 0) + COALESCE(communication, 0) + COALESCE(teamwork, 0)) > ?
    ''', (threshold,)).fetchone()[0]
    
    return jsonify({
        "total_employees": total,
        "average_overall": round(avg_overall, 2) if avg_overall else 0.0,
        "high_performers": high_perf
    })

@app.route('/api/admin/missing-data-ids', methods=['GET'])
def get_missing_data_ids():
    conn = get_db()
    cursor = conn.execute('''
        SELECT id FROM employees 
        WHERE name IS NULL OR department IS NULL OR experience IS NULL OR 
              technical IS NULL OR leadership IS NULL OR communication IS NULL OR teamwork IS NULL OR
              work_hours IS NULL OR overtime IS NULL
    ''')
    ids = [row['id'] for row in cursor.fetchall()]
    return jsonify({"success": True, "ids": ids})

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    pwd = request.json.get('password')
    require_2fa = request.json.get('require_2fa', False)
    if pwd == 'admin123':
        if not require_2fa:
            return jsonify({"success": True})
            
        # Generate token and OTP
        token = str(uuid.uuid4())
        otp_code = str(random.randint(100000, 999999))
        
        # Store in memory temporarily
        pending_approvals[token] = {
            "code": otp_code,
            "created_at": time.time()
        }
        
        print(f"--- SECURITY NOTICE ---")
        print(f"Generated OTP Code for token {token}: {otp_code}")
        print(f"-----------------------")
        
        # Attempt to send email
        try:
            msg = MIMEMultipart()
            msg['From'] = SMTP_SENDER
            msg['To'] = SMTP_RECEIVER
            msg['Subject'] = "SEPTAS Security: Admin Authentication Code"
            
            body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #3b82f6;">SEPTAS Admin Verification</h2>
                <p>A login attempt to the SEPTAS Admin Dashboard was detected.</p>
                <p>Your one-time authentication code is:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 15px; background: #f1f5f9; display: inline-block; border-radius: 5px; color: #0f172a;">
                  {otp_code}
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 20px;">This code is valid for a short period. If you did not request this, please secure your system.</p>
              </body>
            </html>
            """
            msg.attach(MIMEText(body, 'html'))
            
            # Use 'smtp.gmail.com' for Gmail. Update if using a different provider.
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(SMTP_SENDER, SMTP_APP_PASSWORD)
            server.send_message(msg)
            server.quit()
        except Exception as e:
            print(f"SMTP Email Error: {e}")
            print(f"Make sure to update SMTP_SENDER and SMTP_APP_PASSWORD in app.py!")
            # We don't fail the login here, so the user can still test using the console printed OTP
            
        return jsonify({"success": True, "pending": True, "token": token})
        
    return jsonify({"success": False, "error": "Invalid password"}), 401

@app.route('/api/admin/verify_code', methods=['POST'])
def admin_verify_code():
    data = request.json or {}
    token = data.get('token')
    code = data.get('code')
    
    if not token or not code:
        return jsonify({"success": False, "error": "Missing token or code"}), 400
        
    session_data = pending_approvals.get(token)
    if not session_data:
        return jsonify({"success": False, "error": "Session expired or invalid"}), 401
        
    # Optional: check if code expired (e.g., > 10 minutes)
    if time.time() - session_data["created_at"] > 600:
        del pending_approvals[token]
        return jsonify({"success": False, "error": "Code has expired"}), 401
        
    if session_data["code"] == code:
        del pending_approvals[token]
        return jsonify({"success": True})
        
    return jsonify({"success": False, "error": "Invalid verification code"}), 401

@app.route('/api/admin/upload', methods=['POST'])
def upload_excel():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
        
    try:
        df = pd.read_excel(file)
        
        # Clean up column names strictly to lowercase and stripped
        df.columns = df.columns.str.strip().str.lower()
        
        def get_col(*opts):
            return next((c for c in df.columns if any(opt in c for opt in opts)), None)
            
        id_col = get_col('employee id', 'empid', 'id')
        name_col = get_col('employee name', 'name')
        dept_col = get_col('department', 'dept')
        exp_col = get_col('experience', 'exp')
        tech_col = get_col('technical', 'tech')
        lead_col = get_col('leadership', 'leader')
        comm_col = get_col('communication', 'comm')
        team_col = get_col('teamwork', 'team')
        overall_col = get_col('overall', 'rating')
        hours_col = get_col('work hours', 'hours')
        overtime_col = get_col('overtime')
        perf_col = get_col('performance category', 'performance')
        
        if id_col is None:
             return jsonify({"success": False, "error": "Employee ID column not found in Excel."}), 400
        
        # Validations on employee id
        if df[id_col].isnull().any() or (df[id_col] == '').any():
             return jsonify({"success": False, "error": "employee id can not be null."}), 400
             
        dup_ids = df[df[id_col].duplicated()][id_col].dropna().unique()
        if len(dup_ids) > 0:
             return jsonify({"success": False, "error": f"{dup_ids[0]} is duplicate."}), 400

        warnings = []
        required_cols = [name_col, dept_col, exp_col, tech_col, lead_col, comm_col, team_col, overall_col, hours_col, overtime_col, perf_col]
        valid_cols = [c for c in required_cols if c is not None]

        conn = get_db()
        conn.execute('DELETE FROM employees')
        
        count = 0
        for index, row in df.iterrows():
            emp_id = str(row.get(id_col)).strip()
            if emp_id.endswith('.0'): emp_id = emp_id[:-2]
            
            null_cols = []
            for c in valid_cols:
                val = row.get(c)
                if pd.isna(val) or str(val).strip() == '':
                    null_cols.append(c)
            
            if null_cols:
                warnings.append(f"Employee {emp_id}: Missing values in {', '.join(null_cols)}")
                
            def get_val(c, default):
                if c is None: return default
                v = row.get(c)
                return default if pd.isna(v) or str(v).strip() == '' else v
                
            name = str(get_val(name_col, None)).strip() if get_val(name_col, None) else None
            dept = str(get_val(dept_col, None)).strip() if get_val(dept_col, None) else None
            
            def parse_float(val, default=None):
                try:
                    if pd.isna(val) or str(val).strip() == '':
                        return default
                    return float(val)
                except (ValueError, TypeError):
                    return default
            
            exp = parse_float(get_val(exp_col, None))
            tech = parse_float(get_val(tech_col, None))
            lead = parse_float(get_val(lead_col, None))
            comm = parse_float(get_val(comm_col, None))
            team = parse_float(get_val(team_col, None))
            work_hours = parse_float(get_val(hours_col, None))
            overtime = parse_float(get_val(overtime_col, None))
            
            # For overall calculation, treat NULLs as 0
            t_score = tech if tech is not None else 0.0
            l_score = lead if lead is not None else 0.0
            c_score = comm if comm is not None else 0.0
            tm_score = team if team is not None else 0.0
            
            overall = round(((t_score + l_score + c_score + tm_score) / 400.0) * 5)
            overall = max(0, min(5, overall))
            
            perf_cat = str(get_val(perf_col, 'Stable Performer')).strip()
            
            # Score Validations (only if not None)
            if (tech and tech > 100) or (lead and lead > 100) or (comm and comm > 100) or (team and team > 100):
                 return jsonify({"success": False, "error": f"Score cannot be more than 100 for employee {emp_id}."}), 400
            if overall > 5:
                 return jsonify({"success": False, "error": f"Overall score cannot be more than 5 for employee {emp_id}."}), 400
            
            # calculate password
            name_letters = name[:2] if len(name) >= 2 else name.ljust(2, 'x')
            password = name_letters.capitalize() + (emp_id[-2:] if len(emp_id) >= 2 else emp_id.zfill(2))
            
            conn.execute('''
                INSERT INTO employees (id, password, name, department, experience, technical, leadership, communication, teamwork, overall, work_hours, overtime, performance_category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (emp_id, password, name, dept, exp, tech, lead, comm, team, overall, work_hours, overtime, perf_cat))
            count += 1
            
        conn.commit()
        return jsonify({"success": True, "count": count, "warnings": warnings})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/employees', methods=['GET'])
def get_employees():
    conn = get_db()
    cursor = conn.execute('SELECT id, name, department, experience, technical, leadership, communication, teamwork, overall, work_hours, overtime, performance_category FROM employees ORDER BY id ASC')
    emps = [dict(row) for row in cursor.fetchall()]
    return jsonify({"success": True, "data": emps})

@app.route('/api/admin/employees', methods=['POST'])
def add_employee():
    try:
        data = request.json or {}
        emp_id = str(data.get('id', '')).strip()
        
        if not emp_id:
            return jsonify({"success": False, "error": "employee id can not be null."}), 400
            
        conn = get_db()
        
        existing = conn.execute('SELECT id FROM employees WHERE id = ?', (emp_id,)).fetchone()
        if existing:
            return jsonify({"success": False, "error": f"{emp_id} is duplicate."}), 400
            
        warnings = []
        null_fields = []
        required_fields = ['name', 'department', 'experience', 'technical', 'leadership', 'communication', 'teamwork', 'work_hours', 'overtime']
        for f in required_fields:
            if str(data.get(f, '')).strip() == '':
                null_fields.append(f)
        
        if null_fields:
            warnings.append(f"Employee {emp_id}: Missing values in {', '.join(null_fields)}")
                
        name = str(data.get('name', '')).strip() or None
        dept = str(data.get('department', '')).strip() or None
        perf_cat = str(data.get('performance_category', 'Stable Performer')).strip() or 'Stable Performer'
        
        def parse_float(val, default=None):
            try:
                if val is None or str(val).strip() == '':
                    return default
                return float(val)
            except (ValueError, TypeError):
                return default
                
        exp = parse_float(data.get('experience', None))
        tech = parse_float(data.get('technical', None))
        lead = parse_float(data.get('leadership', None))
        comm = parse_float(data.get('communication', None))
        team = parse_float(data.get('teamwork', None))
        work_hours = parse_float(data.get('work_hours', None))
        overtime = parse_float(data.get('overtime', None))
        
        # For overall calculation, treat NULLs as 0
        t_score = tech if tech is not None else 0.0
        l_score = lead if lead is not None else 0.0
        c_score = comm if comm is not None else 0.0
        tm_score = team if team is not None else 0.0
        
        overall = round(((t_score + l_score + c_score + tm_score) / 400.0) * 5)
        overall = max(0, min(5, overall))
        
        avg_overall = conn.execute('SELECT AVG(overall) FROM employees').fetchone()[0]
        companyAvg = float(avg_overall) if avg_overall else 0.0
        
        if overall > companyAvg:
            perf_cat = "Good Performer"
        elif abs(overall - companyAvg) < 0.01:
            perf_cat = "Average Performer"
        else:
            perf_cat = "Needs Improvement"
        
        # Validations
        if (tech and tech > 100) or (lead and lead > 100) or (comm and comm > 100) or (team and team > 100):
             return jsonify({"success": False, "error": "Score cannot be more than 100."}), 400
        name_letters = name[:2] if len(name) >= 2 else name.ljust(2, 'x')
        password = name_letters.capitalize() + (emp_id[-2:] if len(emp_id) >= 2 else emp_id.zfill(2))
        
        conn.execute('''
            INSERT INTO employees (id, password, name, department, experience, technical, leadership, communication, teamwork, overall, work_hours, overtime, performance_category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (emp_id, password, name, dept, exp, tech, lead, comm, team, overall, work_hours, overtime, perf_cat))
        conn.commit()
        
        return jsonify({"success": True, "warnings": warnings})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/employees/<emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    try:
        conn = get_db()
        conn.execute('DELETE FROM employees WHERE id = ?', (emp_id,))
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/admin/clear', methods=['POST'])
def clear_employees():
    conn = get_db()
    conn.execute('DELETE FROM employees')
    conn.commit()
    return jsonify({"success": True})

@app.route('/api/employee/login', methods=['POST'])
def employee_login():
    try:
        data = request.json or {}
        emp_id = str(data.get('employee_id', '')).strip()
        password = str(data.get('password', '')).strip()
        
        conn = get_db()
        cursor = conn.execute('SELECT * FROM employees WHERE id = ? AND password = ?', (emp_id, password))
        emp = cursor.fetchone()
        
        if emp:
            return jsonify({
                "success": True,
                "data": dict(emp)
            })
        else:
            return jsonify({"success": False, "error": "Invalid combination"}), 401
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
        
if __name__ == '__main__':
    # Running on 0.0.0.0 allows other devices on the same Wi-Fi (like your phone) 
    # to access the approval link.
    app.run(host='0.0.0.0', debug=True, port=5000)
