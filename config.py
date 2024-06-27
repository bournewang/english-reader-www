import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    EXTENSION_URL = "https://chromewebstore.google.com/detail/english-reader/plipgafgeeplbfgpjednfhfbcjdeeejk"
    SCREENSHOTS = [
        {
            'filename': 'screenshot1.jpg',
            'alt': 'Screenshot 1'
        },
        {
            'filename': 'screenshot2.jpg',
            'alt': 'Screenshot 2'
        },
        {
            'filename': 'screenshot3.jpg',
            'alt': 'Screenshot 3'
        }
    ]    
