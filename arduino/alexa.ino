/*
 Name:		CC3000PubSub.ino
 Created:	08/14/2017 10:43:00
 Author:	Kennedy Otieno
*/

#include <PubSubClient.h>
#include <SPI.h>
#include <ccspi.h>
#include <Adafruit_CC3000.h>

//Network Settings
#define WLAN_SSID "Lenovo A7010"
#define WLAN_PASS "Infrared@1944"
#define WLAN_SEC WLAN_SEC_WPA2

//CC3000 Hardware Setup
#define ADAFRUIT_CC3000_VBAT 5
#define ADAFRUIT_CC3000_IRQ 3
#define ADAFRUIT_CC3000_CS 10

#define LEDPIN 7
#define SENSORPIN A0

//Create a CC3000 Instance -< For connections
Adafruit_CC3000 cc3000 = Adafruit_CC3000(ADAFRUIT_CC3000_CS, ADAFRUIT_CC3000_IRQ, ADAFRUIT_CC3000_VBAT, SPI_CLOCK_DIVIDER);

//Setup CC3000 Client Instance
Adafruit_CC3000_Client cc_client = Adafruit_CC3000_Client();

long lastMsg = 0;
char msg[50];
int value = 0;
const char* broker = "sungura1-angani-ke-host.africastalking.com";
float data = analogRead(SENSORPIN);


// Callback function header
void callback(char* topic, byte* payload, unsigned int length);

PubSubClient client(broker,1883,callback,cc_client);

void setup() {
	pinMode(LEDPIN,OUTPUT);
	pinMode(SENSORPIN,INPUT);
	digitalWrite(LEDPIN,HIGH);
	Serial.begin(9600);
	while (!Serial) {
		; // wait for serial port to connect. 
	}
	connectCC300();
	displayConnectionDetails();
	digitalWrite(LEDPIN,LOW);

}
void loop() {
	if (!client.connected())
	{
		_keepAlive();
	}
	//client.loop();
	if (!client.loop()) {
		Serial.print("Client disconnected...");
		if (client.connect("AfricasTalkingIOT")) {
			Serial.println("reconnected.");
		}
		else {
			Serial.println("failed.");
		}
	}
	long now = millis();
	if (now - lastMsg > 2000) {
		lastMsg = now;
		++value;
		dtostrf(data,6,2,msg);
		Serial.print("Publish message: ");
		Serial.println(msg);
		client.publish("alexa", msg);
	}
}

//Connect CC3000 to Internet

void connectCC300()
{
	Serial.println(F("Initializing CC3000"));
	if (!cc3000.begin()) {
		Serial.println(F("Failed to initialize CC3000"));
		for (;;);
	}

	//You can call Firmware version check,display MAC address etc see
	//https://github.com/TheBeachMaster/adafruit-io-dashboard/blob/master/adafruit_io_sensors/adafruit_io_sensors.ino

	//Meanwhile, Delete Old Connection Pofiles and Attempt to Connect to our network
	Serial.println(F("Deleting old profiles"));

	if (!cc3000.deleteProfiles()) {
		Serial.println(F("Could not delete Profiles"));
		while (1);
	}
	char* ssid = WLAN_SSID;
	Serial.print(F("Attempting to connect to "));
	Serial.println(ssid);

	if (!cc3000.connectToAP(WLAN_SSID, WLAN_PASS, WLAN_SEC)) {
		Serial.println(F("Could not Connect"));
		while (1);
	}

	//Connected
	Serial.println(F("Connected!"));

	Serial.println(F("Request DHCP"));
	while (!cc3000.checkDHCP()) {
		delay(100);
	}
}

bool displayConnectionDetails(void)
{
	uint32_t ipAddress, netmask, gateway, dhcpserv, dnsserv;

	if (!cc3000.getIPAddress(&ipAddress, &netmask, &gateway, &dhcpserv, &dnsserv))
	{
		Serial.println(F("Unable to retrieve the IP Address!\r\n"));
		return false;
	}
	else
	{
		Serial.print(F("\nIP Addr: ")); cc3000.printIPdotsRev(ipAddress);
		Serial.print(F("\nNetmask: ")); cc3000.printIPdotsRev(netmask);
		Serial.print(F("\nGateway: ")); cc3000.printIPdotsRev(gateway);
		Serial.print(F("\nDHCPsrv: ")); cc3000.printIPdotsRev(dhcpserv);
		Serial.print(F("\nDNSserv: ")); cc3000.printIPdotsRev(dnsserv);
		Serial.println();
		return true;
	}
}

void callback(char* topic, byte* payload, unsigned int length) {
	Serial.print("Message arrived [");
	Serial.print(topic);
	Serial.print("] ");
	for (int i = 0; i < length; i++) {
		Serial.print((char)payload[i]);
	}
	Serial.println();
	if ((String)(char *)payload == 'ON') {
		digitalWrite(LEDPIN, HIGH);  
	}else if ((String)(char *)payload == 'OFF') {
		digitalWrite(LEDPIN, LOW);   
	}
	else {
		// digitalWrite(LEDPIN, HIGH);  // Turn the LED off by making the voltage HIGH
		// delay(500);
		digitalWrite(LEDPIN, LOW);
	}

}

//Reconnect always
void _keepAlive() {
	
	while (!client.connected()) {
		Serial.print(F("Contacting Server on: "));
		Serial.print(broker);
		Serial.println();
		if (client.connect("Alexa")) {
			Serial.println("connected");
			client.publish("alexa","Am Alive");
			client.subscribe("alexa");
		}
		else {
			Serial.print("Failed, rc=");
			Serial.print(client.state());
			Serial.println(" Retrying...");
			delay(6000);
		}
	}
}