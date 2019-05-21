from PIL import Image
import os
import glob

for dir in os.scandir(r"C:\Users\YuvalMund\Desktop\letters"):
    print (dir.path)
    for filename in glob.glob(dir.path + "/*.png"):
        print (filename)
        til = Image.open(filename)
        til = til.resize((64,64) ,Image.ANTIALIAS)
        til.save(filename);