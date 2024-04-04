import os.path
import base64

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


def get_mails(n_mails):
  """
  Returns the number(n_mails) of unread emails from the user inbox.
  """
  creds = None
  # The file token.json stores the user's access and refresh tokens, and is
  # created automatically when the authorization flow completes for the first
  # time.
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json", SCOPES)
  # If there are no (valid) credentials available, let the user log in.
  if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
    else:
      flow = InstalledAppFlow.from_client_secrets_file(
          "credentials.json", SCOPES
      )
      creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    # Call the Gmail API
    service = build("gmail", "v1", credentials=creds)
    
    results = service.users().messages().list(userId='me', labelIds=['UNREAD'], q="is:unread").execute()
    messages = results.get('messages', [])

    message_list = []

    if not messages:
        print('No new messages.')
    else:
        for message in messages:
            msg = service.users().messages().get(userId='me', id=message['id']).execute() 
            # print(msg, '\n\n\n')  
            email_data = msg['payload']['headers']  

            subject = ''

            for values in email_data:
                name = values['name']
                if name == 'Subject':
                   subject = values['value']
                     
            for values in email_data:
                name = values['name']
                if name == 'From':
                    from_name= values['value']                
                    for part in msg['payload']['parts']:
                        try:
                            data = part['body']["data"]
                            byte_code = base64.urlsafe_b64decode(data)

                            text = byte_code.decode("utf-8")

                            message_list.append(
                               {
                                  'From': from_name,
                                  'Subject': subject,
                                  'body': text
                               }
                            )

                            if len(message_list) >= n_mails:
                               return message_list

                            # print ("This is the message: "+ str(text))

                            # mark the message as read (optional)
                            # msg  = service.users().messages().modify(userId='me', id=message['id'], body={'removeLabelIds': ['UNREAD']}).execute()                                                       
                        except BaseException as error:
                            pass
  except Exception as error:
        print(f'An error occurred: {error}')


if __name__ == "__main__":
  mails = get_mails(10)

  for mail in mails:
     print(mail, '\n\n\n')