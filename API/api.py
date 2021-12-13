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
    u_phone = request.form.get('phone')

    user = User(
        name = u_name,
        email = u_email,
        phone = u_phone,
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
        u_phone = request.form.get('phone')
        if u_phone:
            u.phone = u_phone
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
        f = u.format()
        f['tasks'] = { "pending" : 0, "completed": 0 }
        ff = or_(
                Task.owner_id == int(u.id), and_(Task_Meta.key == 'user_id',Task_Meta.value == str(u.id)).self_group()
                )
        t = db.session.query(Task).outerjoin(Task_Meta, Task_Meta.task_id == Task.id).filter(ff).all()
        for task in t:
            if task.status in [1,2]:
                f['tasks']['pending'] += 1
            else:
                f['tasks']['completed'] += 1

        return f,201
    f = c.format()
    f['tasks'] = { "pending" : 0, "completed": 0 }
    ff = or_(
            Task.owner_id == int(c.id), and_(Task_Meta.key == 'user_id',Task_Meta.value == str(c.id)).self_group()
            )

    t = db.session.query(Task).outerjoin(Task_Meta, Task_Meta.task_id == Task.id)
    if c.role != 'admin':
        t = t.filter(ff).all()
    for task in t:
        if task.status in [1,2]:
            f['tasks']['pending'] += 1
        else:
            f['tasks']['completed'] += 1

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

@app.route("/user/users", methods=['GET'])
@token_required
def user_choose(c):
    users = db.session.query(User).filter(User.role != 'admin').order_by(User.id.asc()).all()
    ret_data = []
    for user in users:
        U = user.format()
        ret_data.append(U)
    return jsonify(ret_data)

@app.route("/user/tasks", methods=['GET'])
@token_required
def user_tasks(c):
    date = request.args.get('date')
    adminAll = request.args.get('allTasks')
    print(adminAll)
    if c.role == 'admin':
        user = request.args.get('userId')
    else:
        user = c.id
    if request.args.get('clicked'):
        user = request.args.get('clicked')

    if user:
        ff = or_(
                Task.owner_id == int(user), and_(Task_Meta.key == 'user_id',Task_Meta.value == str(user)).self_group()
                ).self_group()
    tasks = db.session.query(Task)\
        .outerjoin(Task_Meta, Task_Meta.task_id == Task.id)
    if date:
        # date = "-".join(date.split("-")[::-1]) # 2012-02-31 -> 31-02-2012
        ff = and_(ff,Task.start_date == date ).self_group()
    
    foradmin = False
    if adminAll and c.role == 'admin':
        tasks = tasks.order_by(Task.start_date.desc()).all()
        foradmin = True
    else:
        tasks = tasks.filter(ff).order_by(Task.start_date.desc()).all()
    
    def fetchUsers(T, task):
        admin_id = c.id
        ids = []
        if task.owner.role != 'admin':
            ids.append(int(T['owner_id']))
        for us in T['linked']:
            ids.append(int(us['value']))
        users = [x[0] for x in db.session.query(User.name).filter(User.id.in_(ids)).all()] # [('name',), ('sd',)]
        return users

    ret_data = []
    for task in tasks:
        T = task.format()

        T['linked'] = [ x.format() for x in Task_Meta.query.filter(Task_Meta.task_id == task.id, Task_Meta.key=='user_id').all()]
        T['attachments'] = [x.format() for x in Attachment.query.filter(Attachment.type=='task', Attachment.type_id==task.id).all()]
        T['history'] = [ x.format() for x in Task_History.query.filter(Task_History.task_id == task.id).all()]
        T['isAdmin'] = True if db.session.query(User).filter(User.id == task.owner_id).first().role == 'admin' else False
        T['users'] = fetchUsers(T, task)
        ret_data.append(T)
    return jsonify(ret_data)

@app.route("/user/c_data", methods=['GET'])
@token_required
def calendar_data(c):
    print(request.args)
    if c.role == 'admin':
        user = request.args.get('userId')
    else:
        user = c.id
    ff = or_(
        Task.owner_id == int(user), and_(Task_Meta.key == 'user_id',Task_Meta.value == str(user)).self_group()
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
    users = request.form.getlist('users')
    if c.role == 'admin':
        for user in users:
            new_tm = Task_Meta(
                key = 'user_id',
                value = user,
                task_id = task.id
            )
            db.session.add(new_tm)
            db.session.commit()
    if 'file' in request.files:
        ffs = request.files.getlist('file')
        for file in ffs:
            if file:
                filename = HASH_FILE(file.filename)
                print(filename)
                filename = os.path.join(app.config['UPLOAD_FOLDER'],"files", filename)
                file.save(filename)

            t_m = Attachment(
                type = 'task',
                type_id = task.id,
                path = filename
            )
            db.session.add(t_m)
            db.session.commit()
            print('Submitted: %s'%filename)
    users = User.query.filter(User.id.in_(users)).all()
    for user in users:
        sms.Task_create(user.phone,task.id)
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

    if stat == 'true':
        t.status = 3
    else:
        t.status = 2

    db.session.commit()

    return user_tasks(), 200