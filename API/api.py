from sqlalchemy.sql.expression import desc
from core import *
from datetime import datetime, timedelta
from sqlalchemy import or_,and_
from werkzeug.utils import secure_filename
import os
@app.route("/login",methods=['POST'])
def login_a():
    email = request.form.get('email')
    password = request.form.get('password')
    print(request.form)
    user = User.query.filter(User.email==email).first()
    if user:
        ch = user.check_password(password)
        if ch:
            token = jwt.encode({
                'public_id': user.id,
                'exp' : datetime.utcnow() + timedelta(days = 100)
                    }, app.config['SECRET_KEY'],algorithm="HS256")
            print(token)
            return jsonify({"token" : token,"msg": "ok"}),200
        return jsonify({"msg": "incorrect"}), 401
    return jsonify({"msg": "not found"}), 404

@app.route("/ping", methods=['GET'])
@token_required
def ping(c):
    return "Post"

@app.route("/user/add", methods=['POST'])
@token_required
def useradd(c):
    u_name = request.form.get('name')
    u_email = request.form.get('email')
    u_role = request.form.get('role')
    u_image = request.form.get('image')
    u_department = request.form.get('department')
    u_rank = request.form.get('rank')
    u_password = request.form.get('password')

    user = User(
        name = u_name,
        email = u_email,
        role = u_role,
        image = u_image,
        department = u_department,
        rank = u_rank
    )

    user.set_password(u_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Success"}), 200

@app.route("/user", methods=['GET', 'POST'])
@token_required
def userdata(c):
    '''
    img
    department
    rank
    '''

    if request.method=='POST':
        u = User.query.get(c.id)
        u_name = request.form.get('name')
        if u_name:
            u.name = u_name
        u_email = request.form.get('email')
        if u_email:
            u.email = u_email
        u_role = request.form.get('role')
        if u_role:
            u.role = u_role
        if 'image' in request.files:
            file = request.files['image']
            if file:
                filename = secure_filename(file.filename)
                filename = os.path.join(app.config['UPLOAD_FOLDER'],"photo", filename)
                file.save(filename)
                u.image = filename
        u_department = request.form.get('department')
        if u_department:
            u.department = u_department
        u_rank = request.form.get('rank')
        if u_rank:
            u.rank = u_rank

        db.session.commit()
        return u.format(),201
    f = c.format()
    f['tasks'] = { "pending" : 0, "completed": 0 }
    ff = or_(
            Task.owner_id == int(c.id), and_(Task_Meta.key == 'user_id',Task_Meta.value == str(c.id)).self_group()
            )
    t = db.session.query(Task).outerjoin(Task_Meta, Task_Meta.task_id == Task.id).filter(ff).all()
    for task in t:
        if task.status in [1,2]:
            f['tasks']['pending'] += 1
        else:
            f['tasks']['completed'] += 1
    print(f)
    return f,200


@app.route("/newpass", methods=['POST'])
@token_required
def newpass(c):
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    u = User.query.get(c.id)
    if u.check_password(current_password):
        u.set_password(new_password)

        db.session.commit()
        return jsonify({"msg": "Success"}), 200
    else:
        return jsonify({"msg": "Incorrect password"}),405
@app.route("/user/tasks", methods=['GET'])
@token_required
def user_tasks(c):
    import calendar
    date = request.args.get('date')
    month = request.args.get('month')# 2021-11

    print(date)
    
    ff = or_(
            Task.owner_id == int(c.id), and_(Task_Meta.key == 'user_id',Task_Meta.value == str(c.id)).self_group()
            ).self_group()
    if date:
        # date = "-".join(date.split("-")[::-1]) # 2012-02-31 -> 31-02-2012
        ff = and_(ff,Task.start_date == date ).self_group()
    if month:
        year = int(month.split("-")[0])
        month = int(month.split("-")[1])
        s_date = datetime.date(year,month, 1) 
        l = calendar.monthrange(year, month)
        e_date = datetime.date(year,month, l[1])
        ff = and_(ff,Task.start_date.between(s_date,e_date)).self_group()
    tasks = db.session.query(Task)\
        .outerjoin(Task_Meta, Task_Meta.task_id == Task.id)\
        .filter(ff)
    print("FF", ff)
    print(tasks)
    tasks = tasks.all()

    print("TASKS", tasks)
    ret_data = []
    for task in tasks:
        T = task.format()
        T['attributes'] = [ x.format() for x in Task_Meta.query.filter(Task_Meta.task_id == task.id).all()]
        T['history'] = [ x.format() for x in Task_History.query.filter(Task_History.task_id == task.id).all()]
        ret_data.append(T)
    return jsonify(ret_data)

@app.route("/user/c_data", methods=['GET'])
@token_required
def calendar_data(c):
    ff = or_(
        Task.owner_id == int(c.id), and_(Task_Meta.key == 'user_id',Task_Meta.value == str(c.id)).self_group()
        ).self_group()
    tasks = db.session.query(Task)\
        .outerjoin(Task_Meta, Task_Meta.task_id == Task.id)\
        .filter(ff)
    tasks = tasks.all()
    ret_data = {}
    for task in tasks:
        if str(task.start_date) not in ret_data:
            ret_data[str(task.start_date)] = {"Sana" : str(task.start_date), "Bajarilmagan" : 0, "Bajarilmoqda" : 0, "Bajarildi" : 0}
        ret_data[str(task.start_date)]['Bajarilmagan' if task.status == 1 else ('Bajarilmoqda' if task.status == 2 else 'Bajarildi')] += 1
    return jsonify(ret_data)
    
@app.route("/user/task/add", methods=['POST'])
@token_required
def task_add(c):
    user_id = c.id
    start = request.form.get('start_date')
    end = request.form.get('end_date')
    description = request.form.get('desc')
    stat = 1
    task = Task(
        owner_id = user_id,
        start_date = start,
        end_table = end,
        desc = description,
        status = stat
    )

    db.session.add(task)
    db.session.commit()
    if 'file' in request.files:
        ffs = request.files.getlist('file')
        for file in ffs:
            if file:
                filename = secure_filename(file.filename)
                filename = os.path.join(app.config['UPLOAD_FOLDER'],"files", filename)
                file.save(filename)

            t_m = Task_Meta(
                key = 'attach',
                value = filename,
                task_id = task.id
            )
            db.session.add(t_m)
            db.session.commit()
            print('Submitted: %s'%filename)

    return user_tasks(), 200

@app.route("/user/task/add_event", methods=['POST'])
@token_required
def history_add(c):
    user = c.id
    task = request.form.get('task_id')
    description = request.form.get('desc')
    stat = request.form.get('status')

    history = Task_History(
        user_id = user,
        task_id = task,
        desc = description
    )

    db.session.add(history)
    db.session.commit()

    t = Task.query.get(task)
    print("STAT", stat)
    if stat == 'true':
        t.status = 3
    else:
        t.status = 2
    print(t.status)
    db.session.commit()

    return user_tasks(), 200