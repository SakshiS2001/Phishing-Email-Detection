
import email
from email import policy
from email.parser import BytesParser


def parse_email(file_path):
    """
    Parse an EML file and extract important email information.
    """

    # Open the EML file in binary mode
    with open(file_path, "rb") as email_file:

        # Parse the email content
        message = BytesParser(policy=policy.default).parse(email_file)

    # Extract email headers
    email_data = {
        "from": message.get("From"),
        "to": message.get("To"),
        "cc": message.get("Cc"),
        "subject": message.get("Subject"),
        "date": message.get("Date"),
        "reply_to": message.get("Reply-To"),
        "return_path": message.get("Return-Path"),
        "message_id": message.get("Message-ID"),
        "received": message.get_all("Received", []),
        "authentication_results": message.get_all(
            "Authentication-Results", []
        ),
        "body": "",
        "attachments": []
    }

    # Extract email body and attachment metadata
    if message.is_multipart():

        for part in message.walk():

            content_type = part.get_content_type()
            filename = part.get_filename()

            if part.get_content_disposition() == "attachment":

                payload = part.get_payload(decode=True) or b""

                email_data["attachments"].append({
                    "filename": filename,
                    "content_type": content_type,
                    "size": len(payload)
                })

            elif content_type == "text/plain" and not filename:

                if not email_data["body"]:
                    email_data["body"] = part.get_content()

    else:

        if message.get_content_type() == "text/plain":
            email_data["body"] = message.get_content()

    return email_data
