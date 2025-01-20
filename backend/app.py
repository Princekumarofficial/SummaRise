from flask import Flask, render_template, request
from summarise import get_summary_list

app = Flask(__name__)

all_s = get_summary_list(5)

@app.route('/')
def home():
    try:
        mail_no = int(request.args.get('mail'))
    except:
        mail_no = 0
    return render_template('index.html', all_s=all_s, mail=mail_no)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
