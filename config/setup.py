import json
import csv
import os
import os.path
from sys import platform


# TODO: Make sure that the requests work

def datajsonformat(serverID, shoppinglist):
    return {
        "server": [
            {
                "serverid": serverID,
                "shoppinglist": shoppinglist
            }
        ],
        "requests" : [

        ]
    }
def jsonalreadycreated(serverID, shoppinglist):
    return {
        "serverid":serverID,
        "shoppinglist": shoppinglist
    }

BOT_TOKEN = input("What is your discord bot token?\n")
PREFIX = input("What one character call do you want for your bot prefix?\n")
BOT_OWNER = input("What is your personal discord ID?\n")
BABY_BOT = input("Were you using the baby_bot discord bot before? Y or N\n")

print(platform)


if platform == 'linux' or platform == 'linux2':
    DATA_LOCATION = "src/data/botdata.json"

    if not os.path.exists(DATA_LOCATION):
        with open(DATA_LOCATION, 'w') as json_file:
            toWrite = datajsonformat("testserver", ['testlist'])
            json.dump(toWrite, json_file)

    if BABY_BOT.lower() == "y":
        retrieveData = input("Would you like us to retrieve the data you had as a part of baby-bot? Y or N\n")
    if retrieveData.lower() == 'y':
        dataLocation = input("Please enter the path to the root of the baby-bot folder\n")

        currentDirectory = os.getcwd()
        
        with open(DATA_LOCATION, 'r') as json_file:
            readData = json.load(json_file)

        for root,dirs,files in os.walk(dataLocation):
            for file in files:
                if file.endswith(".csv") and len(file) == 30:
                    # TODO: Make it so that for each file it analyzes the current json file and writes the server ID etc to the datajsonformat using the function
                    serverID = file[8:-4]
                    print(serverID)
                    

                    with open(dataLocation + "//" + file) as csv_file:
                        reader = csv.DictReader(csv_file)
                        shoppinglist = []
                        for row in reader:
                            shoppinglist.append(row['Shopping List'])


                    createdjson = jsonalreadycreated(serverID, shoppinglist)
                    readData["server"].append(createdjson)


elif platform == 'win32':
    DATA_LOCATION = "src\\data\\botdata.json"

    if not os.path.exists(DATA_LOCATION):
        with open(DATA_LOCATION, 'w') as json_file:
            toWrite = datajsonformat("testserver", ['testlist'])
            json.dump(toWrite, json_file)

    if BABY_BOT.lower() == "y":
        retrieveData = input("Would you like us to retrieve the data you had as a part of baby-bot? Y or N\n")
    if retrieveData.lower() == 'y':
        dataLocation = input("Please enter the path to the root of the baby-bot folder\n")

        currentDirectory = os.getcwd()
        
        with open(DATA_LOCATION, 'r') as json_file:
            readData = json.load(json_file)

        for root,dirs,files in os.walk(dataLocation):
            for file in files:
                if file.endswith(".csv") and len(file) == 30:
                    # TODO: Make it so that for each file it analyzes the current json file and writes the server ID etc to the datajsonformat using the function
                    serverID = file[8:-4]
                    print(serverID)
                    

                    with open(dataLocation + "\\" + file) as csv_file:
                        reader = csv.DictReader(csv_file)
                        shoppinglist = []
                        for row in reader:
                            shoppinglist.append(row['Shopping List'])


                    createdjson = jsonalreadycreated(serverID, shoppinglist)
                    readData["server"].append(createdjson)
                 
with open(DATA_LOCATION, 'w') as json_file:
    json.dump(readData, json_file, indent=4)                    

with open('.env', 'w') as environment:
     environment.write('BOT_TOKEN={0}\nPREFIX={1}\nBOT_OWNER={2}'.format(BOT_TOKEN, PREFIX, BOT_OWNER))

print("Great! Your discord bot should be all setup. Remember, if you run into any issues or bugs at all to leave an issue at https://github.com/therealkeyisme/JSbot/issues")

