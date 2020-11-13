from bluedot.btcomm import BluetoothServer
from signal import pause
import time
import RPi.GPIO as GPIO

def connect_handler():
    print('Client connected...')
    #while True:	
								#s.send("50")
								#print("Enviado")
								#time.sleep(10)
	
def disconnect_handler():
    print('Client disconnected...')

def data_received_handler(data):
    # reverse text and send back to client
    
    TRIG = 24
    ECHO = 22
    GPIO.setmode(GPIO.BOARD)

    GPIO.setup(TRIG, GPIO.OUT)
    GPIO.setup(ECHO, GPIO.IN)
     
    GPIO.output(TRIG,True)
    time.sleep(0.0001)
    GPIO.output(TRIG,False)

    while GPIO.input(ECHO) == False:
								start = time.time()

    while GPIO.input(ECHO) == True:
								end = time.time()
				
    sig_time = end-start

				#cm
    distance = round(sig_time / 0.000058 , 2)

    print('{}'.format(distance))
    s.send('{}'.format(distance));
    GPIO.cleanup()

s = BluetoothServer(data_received_handler,
        port=1,
        when_client_connects=connect_handler,
        when_client_disconnects=disconnect_handler)

print('Listening...')

pause()
