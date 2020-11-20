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
    
    GPIO.output(TRIG, GPIO.LOW)
    time.sleep(0.5)


    GPIO.output(TRIG,GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG,GPIO.LOW)

    while True:
        pulso_inicio = time.time()
        if GPIO.input(ECHO) == GPIO.HIGH:
            break

    while True:
        pulso_fin = time.time()
        if GPIO.input(ECHO) == GPIO.LOW:
            break
				
    duracion = pulso_fin-pulso_inicio

				#cm
    distancia = (34300 * duracion)/2

    if distancia > 200 :
        distancia = 200
    
    print("Distancia: %.2f cm" %distancia)
    
    s.send(str(round(distancia,2)));
    GPIO.cleanup()

s = BluetoothServer(data_received_handler,
        port=1,
        when_client_connects=connect_handler,
        when_client_disconnects=disconnect_handler)

print('Listening...')

pause()
