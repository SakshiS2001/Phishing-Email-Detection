
from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
from pathlib import Path
import uuid

app = Flask(__name__)

# Application configuration
app.secret_key = "replace-this-with-a-random-secret"

# Upload configuration
UPLOAD_FOLDER = Path(app.instance_path) / "uploads"
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

ALLOWED_EXTENSIONS = {".eml"}


# Check allowed file extension
def allowed_file(filename):
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


# Dashboard route
@app.route("/")
def home():
    return render_template("index.html")


# Email upload page
@app.route("/upload", methods=["GET", "POST"])
def upload_email():

    if request.method == "POST":

        if "email_file" not in request.files:
            flash("No file was selected.", "danger")
            return redirect(url_for("upload_email"))

        file = request.files["email_file"]

        if file.filename == "":
            flash("Please select an email file.", "warning")
            return redirect(url_for("upload_email"))

        if not allowed_file(file.filename):
            flash("Only .eml files are allowed.", "danger")
            return redirect(url_for("upload_email"))

        safe_name = secure_filename(file.filename)

        if not safe_name:
            flash("Invalid filename.", "danger")
            return redirect(url_for("upload_email"))

        # Generate a unique stored filename
        stored_name = f"{uuid.uuid4().hex}.eml"

        file_path = Path(app.config["UPLOAD_FOLDER"]) / stored_name

        file.save(file_path)

        flash("Email uploaded successfully. Ready for analysis.", "success")

        return redirect(url_for("upload_email"))

    return render_template("email_upload.html")


if __name__ == "__main__":
    app.run(debug=True)
