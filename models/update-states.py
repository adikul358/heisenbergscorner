import pymongo
maindb = pymongo.MongoClient("mongodb://admin:adminsnsnsteam@153.92.5.101/hc-main?authSource=admin")['hc-main']
# answers = maindb['questions'].find_one({"week": 33})["answers"]
result = maindb['answers'].update_many({}, { "$set": { "state": [None, None] } })
print("%s documents updated" % (result.modified_count))
result = maindb['answers'].update_many({"week": 33}, { "$set": { "state": [True, } })
print("%s documents updated" % (result.modified_count))