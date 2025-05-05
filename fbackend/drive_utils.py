import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

FOLDER_ID = "1YKW56R00qbwEUTryValBF_etMwvZqb0O"
CREDENTIALS_FILE = "credencialesS.json"  # Asegúrate que esté en tu backend

def subir_imagen_a_drive(file_path: str, filename: str) -> str:
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=["https://www.googleapis.com/auth/drive"]
    )

    service = build("drive", "v3", credentials=credentials)

    file_metadata = {
        "name": filename,
        "parents": [FOLDER_ID]
    }

    media = MediaFileUpload(file_path, mimetype="image/jpeg")
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id"
    ).execute()

    return f"https://drive.google.com/uc?id={file.get('id')}"

def eliminar_imagen_drive(file_id: str) -> bool:
    try:
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE,
            scopes=["https://www.googleapis.com/auth/drive"]
        )
        service = build("drive", "v3", credentials=credentials)

        service.files().delete(fileId=file_id).execute()
        return True
    except HttpError as error:
        print(f"Error al eliminar el archivo: {error}")
        return False