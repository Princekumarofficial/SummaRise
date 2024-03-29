from flask import Flask, render_template, redirect
from summarise import get_summary_list

app = Flask(__name__)

all_s = get_summary_list(10)

@app.route('/')
def home():
    return render_template('index.html', all_s=all_s)


if __name__ == '__main__':
    app.run(debug=True, port=5005)
