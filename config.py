import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
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
