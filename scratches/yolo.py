from PIL import Image
import random
import os
import codecs
for files in range(0, 2500):
    til = Image.open(r"C:\Users\YuvalMund\Documents\data\blankpage.jpg")
    til.thumbnail((416,416) ,Image.ANTIALIAS)
    width, height = til.size
    f = codecs.open(r"C:\Users\YuvalMund\Documents\data\Yolo\\" + str(files) + ".txt", "a", "utf-8")
    for j in range (0,random.randint(10, 14)):
        for i in range(0, random.randint(20,24)):
            letter = chr(ord('א') + random.randint(0, 26))
            randFile = random.choice(os.listdir(r"C:\Users\YuvalMund\Documents\data\dataset\\" + letter))
            im = Image.open(os.path.join(r"C:\Users\YuvalMund\Documents\data\dataset", letter, randFile))
            randwidth = random.randint(15, 23)
            randhight = random.randint(15, 23)
            im.thumbnail((randwidth, randhight), Image.ANTIALIAS)

            til.paste(im,(0 + i * 20 ,0 + j * 60))
            print(letter)
           # f.write(letter + " " + str(12 + i * 20 / width) + " " + str(12 + j * 60 / height) + ' ' + str(24 / width) + ' ' + str(24 / height) + '\n')
            f.writelines("0" + " " + str(((randwidth / 2) + i * 20) / width) + " " + str(
                ((randhight / 2) + j * 60) / height) + ' ' + str(randwidth / width) + ' ' + str(
                randhight / height) + '\n')

    til.save(r"C:\Users\YuvalMund\Documents\data\Yolo\\" + str(files) + ".png")