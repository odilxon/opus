from api import *
from werkzeug.exceptions import HTTPException

# @app.errorhandler(404)
# def page_not_found(e):
#     # note that we set the 404 status explicitly
#     return render_template('/pages/error/404.html'), 404

# @app.errorhandler(500)
# def server_error(e):
#     print("500 called")
#     # note that we set the 404 status explicitly
#     return render_template('/pages/error/500.html'), 500

# @app.errorhandler(HTTPException)
# def handle_exception(e):
#     print("HTTPException called")
#     return render_template('/pages/error/500.html'), e.code


# @app.errorhandler(Exception)
# def Exeption_(error):
#     print(str(Exception))
#     print("Exception called")
#     return render_template('/pages/error/500.html'), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')