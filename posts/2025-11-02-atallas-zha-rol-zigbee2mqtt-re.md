---
title: "Átállás ZHA-ról Zigbee2MQTT-re"
date: 2025-11-02
layout: post
tags: [zigbee, home-automation, mqtt, zigbee2mqtt, zha, home-assistant]
---

### Mi ez, és miért akarunk ilyet?

Mikor beleugrottam a Home Assistant világába, és megvettem az első Zigbee eszközeimet, akkor következett a lépés, hogy , "Na, akkor ezeket csatlakoztatni kellene a Home Assitanthoz". A Home Assistantba könnyedén lehet Zigbee eszközöket integrálni a Zigbee Home Automation nevű integrációval. Jól hangzott, tudtam hogy a Sonoff Zigbee Dongle-ommal együtt fog tudni működni, úgyhogy nem nagyon érdekelt hogy milyen egyéb integrálási lehetőségek vannak Zigbee eszközöt tekintetében, elindultam a ZHA útján.

Talán akkor kezdte piszkálni a fantáziámat, hogy mi is az a Zigbee2MQTT, amikor megvettem az első mmwave presence szenzoromat, és tudomásom volt róla, hogy valamilyen távolság információt is ki lehet nyerni belőle, de nálam a Home Assistant-ban csak egy binary sensor (két állapotú szenzor) jelent meg, ami csak azt jelezte, hogy van-e mozgás vagy nincs. Elkezdtem kutakodni, és kiderült, hogy a Zigbee2MQTT-vel sokkal több információt ki lehet hozni ebből a szenzorból, mint amit a ZHA tudott nyújtani. Mivel a kívánt funkciót így is meg tudtam valósítani, így ezt a gondolatot feltettem a polcra.

Aztán jöttek újabb és újabb eszközök a háztartásba, elkezdtem többféle fali villanykapcsolót kipróbálni, és volt egy igazán szimpatikus darab. Kétgombos Aqara H2 fali kapcsoló. Párosítást követően azt tapasztaltam, hogy a ZHA-n keresztül csak egy darab entitást lát a Home Assistant. A felső gomb kapcsolta ki/be a relét, de az alsó gombot nem láttam a home assistantból. Internetes forrásokból arra következtettem, hogy a Zigbee2MQTT-n keresztül történő kapcsolódáskor sokkal több funkcióhoz hozzá fogok férni.

Jó dolog lesz ez érzem, de adódik a kérdés hogy mi lesz az automatizációkkal, amik már hivatoznak valamilyen entity_id-val bizonyos entitásokra. Azok megmaradhatnak? Vagy mindennek teljesen új neve lesz? Talán a formátum is más lesz? Hát mindegy... Ezt meg kell léni, gyáva népnek nincs hazája!

De mi az az MQTT? Miért kell Zigbee eszközöket MQTT-n keresztül integrálni a Home Assistant-ba? Nos, az MQTT egy lightweight üzenetküldő protokoll, amelyet gyakran használnak IoT (Internet of Things) eszközök kommunikációjára. A Zigbee2MQTT lehetővé teszi, hogy a Zigbee eszközök adatokat küldjenek és fogadjanak az MQTT protokollon keresztül, így a Home Assistant könnyedén integrálhatja ezeket az eszközöket. Tehát van egy Zigbee mesh hálózatunk, ahol az eszközök zigbee protokollon kommunikálnak egymással, ez valahol átkonvertálódik MQTT protokollra, amit a Home Assistant tud kezelni.


### Mielőtt nekiállunk

Nézzük meg akkor hogy is fog ez kinézni.

Tehát a Zigbee2MQTT egy olyan szoftver (bridge), amely sokkal jobban "ismeri" a Zigbee eszközeink interfészeit, mint a ZHA. Ezért erre mindenképpen szükségünk lesz. A Zigbee üzenetet feldolgozza, majd átalakítja az üzenetet MQTT formátumra, amit a Mosquitto bróker tud kezelni. A Mosquitto bróker képes fogadni üzeneteket, és publikálni őket azoknak, akik erre fel vannak iratkozva. Innentől kezdve kell egy MQTT bróker is.

![img_1.png](img_1.png)

Szerencsére mindegyiket tudjuk dockerben konténerben futtatni, ez lesz számomra a legmegfelelőbb megoldás egyelőre, mivel a Home Assistant is dockerben fut.

Érdemes készíteni egy backupot a Home Assistant-ról mielőtt nekilátunk az átállásnak. Nekem nagyon jól jött mert eltüntettem egy db fájlt valószínűleg egy rebase-lés során, de a backupból könnyedén vissza tudtam állítani a hiányzó fájlt.

Én becsomagoltam a felcsatolt mappákat egy tar.gz fájlba, és lementettem egy külső meghajtóra.

```bash

### Mosquitto Docker

A Mosquitto hivatalos docker image-ét fogom használni. A telepítésről itt található leírás: https://github.com/sukesh-ak/setup-mosquitto-with-docker

Példa a docker konfigurációra:
```yaml
services:
  mosquitto:
    image: eclipse-mosquitto
    container_name: mqtt5
    ports:
      - "1883:1883" #default mqtt port
      - "9001:9001" #default mqtt port for websockets
    volumes:
      - ./config:/mosquitto/config
      - ./data:/mosquitto/data
      - ./log:/mosquitto/log
    restart: unless-stopped
```

Három volume-ot csatolunk fel. Az első a konfigurációs fájlok helye, a második a perzisztens adat helye, a harmadik pedig a log fájlok helye lesz. Ezeket a könyvtárakat nekünk kell létrehozni a host gépen. A konfigurációs fájlt pedig nekünk kell megírni, például így:

`./config/mosquitto.conf:`
```conf
listener 1883
allow_anonymous true
persistence true
persistence_location /mosquitto/data
```

Melyik portot figyelje, engedélyezzük az anonim hozzáférést, és megadjuk a perzisztens adat helyét.
Felhívom a figyelmet arra, hogy az anonim hozzáférés biztonsági kockázatot jelenthet, különösen nyilvános hálózatokon. Érdemes lehet felhasználói hitelesítést beállítani a Mosquitto brókerhez a biztonság növelése érdekében, egy következő lépésben.

### Zigbee2MQTT Docker

Kíváló leírás van a Zigbee2MQTT hivatalos oldalán a dockeres telepítésről:
https://www.zigbee2mqtt.io/guide/installation/02_docker.html

Például:
```yaml
services:
  zigbee2mqtt:
    image: ghcr.io/koenkk/zigbee2mqtt
    container_name: zigbee2mqtt
    restart: unless-stopped
    devices:
      - /dev/serial/by-id/usb-Texas_Instruments_TI_CC2531_USB_CDC___0X00124B0018ED3DDF-if00:/dev/ttyACM0
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
      - /run/udev:/run/udev:ro
    environment:
      - TZ=Europe/Amsterdam
```

A device paraméter meghatározása lesz talán a tapasztalatlan Linux felhasználóknak (mint nekem) a legnehezebb feladat. Ehhez van segítségünk a dokumentációban: https://www.zigbee2mqtt.io/guide/configuration/adapter-settings.html
Látszik hogy két volume van felcsatolva. Az első a konfigurációs fájlok helye, a második pedig az adapter auto-detektálásához való.

Szükségünk lesz itt is egy konfigurációs fájlra, amit a `./data/configuration.yaml` helyen kell elhelyeznünk. Szerencsére a honlapon segítenek nekünk egy config-file generátorral:
https://www.zigbee2mqtt.io/guide/configuration/

Nekem valahogy így nézett ki az elején:

`/data/configuration.yaml`
```yaml
version: 4
mqtt:
  base_topic: zigbee2mqtt
  server: mqtt://mosquitto:1883
serial:
  port: /dev/ttyUSB0
  adapter: zstack
advanced:
  channel: 11
  network_key: GENERATE
  pan_id: GENERATE
  ext_pan_id: GENERATE
frontend:
  enabled: true
homeassistant:
  enabled: true
```

A port és adapter kiderítése ismét a fenti linkkel (https://www.zigbee2mqtt.io/guide/configuration/adapter-settings.html) mehet. Én korábbi buherálásokból emlékeztem, hogy a Sonoff Zigbee Dongle kapcsán többször felmerült a Texas Instruments zstack adapter, így ezt választottam. A portot pedig a `ls /dev/serial/by-id/` paranccsal derítettem ki. Bár így még nem teljesen ezt a formátumot kaptam, de egy kis keresgélés, ChagtGPT után megleltem.

Ezután a docker-compose.yaml fájlom így nézett ki:

```docker-compose.yaml```
```yaml
services:
  homeassistant:
    container_name: homeassistant
    image: ghcr.io/home-assistant/home-assistant:stable
    restart: unless-stopped
    network_mode: host
    privileged: true
    volumes:
      - /home/<felhasznalo>/homeassistant:/config
      - /etc/localtime:/etc/localtime:ro
      - /run/dbus:/run/dbus
      - /var/run/dbus:/var/run/dbus
      - /var/run/dbus/system_bus_socket:/var/run/dbus/system_bus_socket
    environment:
      - TZ=Europe/Budapest

  mosquitto:
    image: eclipse-mosquitto:latest
    container_name: mosquitto
    restart: unless-stopped
    volumes:
      - /home/<felhasznalo>/mosquitto/config:/mosquitto/config
      - /home/<felhasznalo>/mosquitto/data:/mosquitto/data
      - /home/<felhasznalo>/mosquitto/log:/mosquitto/log
    ports:
      - "1883:1883"

  zigbee2mqtt:
    container_name: zigbee2mqtt
    image: ghcr.io/koenkk/zigbee2mqtt:latest-dev
    depends_on:
      - mosquitto
    restart: unless-stopped
    volumes:
      - /home/<felhasznalo>/zigbee2mqtt/data:/app/data
      - /run/udev:/run/udev:ro
    ports:
      - "8080:8080"
    environment:
      - TZ=Europe/Budapest
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0
```
A mappa-struktúrám pedig valahogy így:
```
/home/<felhasznalo>/homelab/
├── homeassistant/
│   ├── configuration.yaml
│   └── ...
├── mosquitto/
│   ├── config/
│   │   └── mosquitto.conf
│   ├── data/
│   └── log/
├── zigbee2mqtt/
│   └── data/
│       └── configuration.yaml
└── docker-compose.yml
```

### Próba

Vagy megnézzü a logokat, hogy minden rendben és/vagy az alábbi módszert kipróbáljuk:

#### Zigbee2MQTT frontend
A Zigbee2MQTT-nek van egy webes felülete, amit a `http://<host-ip>:8080` címen érhetünk el. Ez fontos hely lesz számunkra, mert itt tudunk eszközöket párosítani, az eszközök friendly nevét megváltoztatni, figyelni a zigbee üzeneteket, stb.

#### MQTT
Kel két terminál, az egyiken figyeljük az üzeneteket, a másikon pedig publikálunk egy teszt üzenetet.

```bash
# Terminál 1
docker exec -it mosquitto mosquitto_sub -v -t '#test/#'
```
Ez a parancs a mosquitto konténerben elindít egy MQTT feliratkozást minden témára, ami a `test/` prefix-szel kezdődik.

```bash
# Terminál 2
docker exec -it mosquitto mosquitto_pub -t 'test/message' -m 'Hello from MQTT'
```
Ez a parancs pedig egy üzenetet küld a `test/message` témára. Ha minden jól megy, az egyes terminálon megkapjuk az üzenetet. Ha ez sikerült, kiléphetünk.


### Eszközök párosítása, összekötés Home Assistant-tel

Most jön a móka része. Az eszközök párosítása a Zigbee2MQTT frontend felületén történik. A jelenlegi 2.2.1-es frontend szerint bal oldalon van egy "Csatlakozás engedélyezése" gomb, ezt kell megnyomni, majd az zigbee eszközt párosító módba kell tenni. Aztán indul a csatlakozás. Ha sikeres, akkor az eszköz megjelenik a listában.

Érdemes először a "router"-eket csatlakoztatni az egyszerűség érdekében, majd utána a "end device"-okat.

Az eszköz barátságos nevének átírása esetén a Home Assistant a néven fogja érzékelni az esközt. A Home Assistantban ott még egyszer adhatunk neki egy barátságos nevet. 

Érdemes valamilyen konvencióban megegyezni (magunkkal), a skálázhatóság az könnyebb debuggolás stb érdekében. Én például a következőképpen neveztem el az eszközöket:
- `<eszköz helye>_<eszköz funkciója>`. Ha esetleg egy helyen két azonos funkciójú van, akkor közbeékeltem valamit megkülönböztetés céljából. Pl: `nappali_sarok_mozgás` 

Home Assistantban kitöröltem a ZHA integrációt. Hozzáadtam az MQTT integrációt. A "What do you want to add" kérdésre az "MQTT" választ adtam (volt ott sok lehetőség még, amiket egyelőre nem próbáltam ki). 

A host-nál próbálkoztam mindenfélével, végül a "localhost" -ot fogadta el. Port maradt az alapértelmezett 1883. Username és jelszó üresen maradt, mivel az anonim hozzáférést engedélyeztem a mosquitto konfigurációban.

### Tapasztalatok

- Szuperül lehet látni a zigbee2mqtt frontenden az eszközök képességeit az "Exportál funkciók" alatt. Ez nagy segítség az automatizációk megírásához.
- Nagyon hasznos dolog lehet vásárlás előtt megnézni, hogy egy új eszköz milyen paramétereihez férünk majd hozzá: https://www.zigbee2mqtt.io/supported-devices/
- Nagyon fontos betartani az elnevezési konvenciókat. Egy hét eltelt, de még mindig találok olyan automatizációt, aminél az entity_id el van írva, mert korábban vagy rosszul neveztem el, vagy most hibásan adtam meg a nevét.
- Van rá esély hogy elveszítesz bizonyos funkciókat. Pl van egy Aqara kockám, aminél a rázás funkciót nem találtam expose-olva a zigbee2mqtt frontenden. A másik veszteség az Aqara light strip, aminek elvileg működnie kellene a zigbee2mqtt-n, de nálam (és a github issue-k szerint másiknak sem) működik tökéletesen.
- Ennek ellenére jó hogy sikerült mivel a mmwave szenzoroknál is például nem csak két állása van sok szenzornak, hanem távolságot is becsülnek, valamint a fali kapcsolóim is gyönyörűen fognak muzsikálni.


## Sok sikert mindenkinek az átálláshoz!