# Django Real time chatting with websocket
This application contain real time chatting with websocket and radis server

# Table of Contents

* [Requirement](#requirement)
* [Installation](#installation)

<a name="requirement"></a>
### Requirement:
* Django 1.11.2
* Django channels
* Redis Server
* Websocket

<a name="installation"></a>
### Installation:
####Following Step need to follow:
1. Setup the redis server, Download and install (3.2.100 or any latest version)
2. Git clone this code at your system
3. Create multiple users
``` python manage.py createsuperuser```
4. Start you redis server
5. Add your redis server IP and PORT to setting.py file
6. pip install -r requirements.txt
7. Run the application ```python manage.py runserver```
<a name="quick-start"></a>