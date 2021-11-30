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

@app.route("/user", methods=['GET', 'POST'])
@token_required
def userdata(c):
    '''
    img
    department
    rank
    '''
    if request.method in ['OPTIONS', 'GET']:
        return c.format(),200    
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
        u_image = request.form.get('image')
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
    return c.format(),200


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
            ret_data[str(task.start_date)] = {"Bajarilmagan" : 0, "Bajarilmoqda" : 0, "Bajarildi" : 0}
        ret_data[str(task.start_date)]['Bajarilmagan' if task.status == 1 else ('Bajarilmoqda' if task.status == 2 else 'Bajarildi')] += 1
    return jsonify(ret_data)