from flask import Flask, render_template, current_app
from flask_frozen import Freezer
import os

app = Flask(__name__)
app.config.from_object('config.Config')
freezer = Freezer(app)

@app.route('/')
def home():
    screenshots = current_app.config['SCREENSHOTS']
    extension_url = current_app.config['EXTENSION_URL']
    return render_template('home.html', 
        screenshots=screenshots,
        extension_url=extension_url
        )

@app.route('/features.html')
def features():
    return render_template('features.html')

@app.route('/install.html')
def install():
    extension_url = current_app.config['EXTENSION_URL']
    return render_template('install.html', extension_url=extension_url)

@app.route('/faq.html')
def faq():
    return render_template('faq.html')

@app.route('/contact.html')
def contact():
    return render_template('contact.html')

@app.route('/privacy-policy.html')
def privacy_policy():
    return render_template('privacy_policy.html')

if __name__ == "__main__":
    app.run(debug=True)
