import pymongo, bson
maindb = pymongo.MongoClient("mongodb://admin:adminsnsnsteam@153.92.5.101/hc-main?authSource=admin")['hc-main']
answers = maindb['answers'].find({"week": int(input("Week no. "))})
for i in answers:
    item_id = bson.objectid.ObjectId(i['_id']).generation_time
    print("%s [%s %s] \t\t %s" % (i['name'], i['grade'], i['section'], item_id))
    