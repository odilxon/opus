from models import *

@app.route('/assets/<path:path>')
def send_static(path):
    return send_from_directory('assets', path)

@login_manager.user_loader
def load_user(user_id):
    #@cache.memoize(300)
    def Get_Load(user_id):
        return User.query.get(user_id)
    return Get_Load(user_id)