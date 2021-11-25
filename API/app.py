from api import *
from werkzeug.exceptions import HTTPException
from flask_swagger_ui import get_swaggerui_blueprint
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

SWAGGER_URL = '/swagger'  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/static/swag.json'  # Our API url (can of course be a local resource)

# Call factory function to create our blueprint
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "Test Opus"
    },
    # oauth_config={  # OAuth config. See https://github.com/swagger-api/swagger-ui#oauth2-configuration .
    #    'clientId': "your-client-id",
    #    'clientSecret': "your-client-secret-if-required",
    #    'realm': "your-realms",
    #    'appName': "your-app-name",
    #    'scopeSeparator': " ",
    #    'additionalQueryStringParams': {'test': "hello"}
    # }
)

app.register_blueprint(swaggerui_blueprint)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')