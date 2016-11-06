from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_url_path = "")

@app.route("/")
def index():
	return render_template("index.html")

@app.route('/js/<path:path>')
def send_js(path):
	return send_from_directory('templates/js', path)

@app.route('/css/<path:path>')
def send_css(path):
	return send_from_directory('templates/css', path)

@app.route('/img/<path:path>')
def send_img(path):
	return send_from_directory('templates/img', path)

if __name__ == "__main__":
	app.run()