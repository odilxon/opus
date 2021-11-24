from api import *
from werkzeug.urls import url_parse

# app.add_url_rule('/assets/<path:filename>', endpoint='assets',
#                  view_func=app.send_static_file)

@app.route("/")
@login_required
def index():
    print("loaded index")
    return render_template("index.html", page='index')



@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(name=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            print('Invalid email or password')
            return redirect(url_for('login_page'))
        login_user(user, form.remember_me.data)
        print(request.args)
        next_page = request.args.get('next')
        print(next_page)
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        print(next_page)
        return redirect(next_page)
    return render_template('pages/login.html', form=form)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login_page"))