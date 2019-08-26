import pymongo
maindb = pymongo.MongoClient("mongodb://admin:adminsnsnsteam@153.92.5.101/hc-main?authSource=admin")['hc-main']
localdb = pymongo.MongoClient("mongodb://localhost:27017/admin")['hc-main']
for i in ['questions', 'answers']:
    currcol = maindb[i]
    result = localdb.insert_many(currcol)
    for r in result.inserted_ids:
        print("%s inserted in local collection %s", (r, i))