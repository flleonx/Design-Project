import socket
import sys

# Create a UDP socket

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
nombre_equipo = socket.gethostname()
direccion_equipo = socket.gethostbyname(nombre_equipo)
print("Insertar # de puerto:")
puertoget=input()
puerto=int(puertoget)
# Bind the socket to the port
server_address = (direccion_equipo, puerto)
s.bind(server_address)
print("Do Ctrl+c to exit the program !!")

while True:
    print("####### Server is listening #######")
    data, address = s.recvfrom(4096)
    print("\n\n 2. Server received: ", data.decode('utf-8'), "\n\n")
    
    


    archivo=open('Coordenadas.txt','w')
    archivo.write(data.decode('utf-8'))

    archivo.close()
    