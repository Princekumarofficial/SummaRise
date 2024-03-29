import os
import google.generativeai as genai
from get_mails import get_mails

GOOGLE_API_KEY='AIzaSyDvZ9CVOOxKi1H0L3EXh-KDkA4GC9sK6jI'
genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-pro')


def get_summary_list(n_summary=10):
    """
    The number of email to summarize (n_summary)
    """
    mails = get_mails(n_summary)

    summaries = []

    for mail in mails:
        response = model.generate_content(f"What is this mail trying to tell me in less than 50 words without showing order details or transaction details: \nFrom- {mail['From']} \nSubject- {mail['Subject']} \nBody- {mail['body']}")
        summaries.append(response.text)

    return summaries

