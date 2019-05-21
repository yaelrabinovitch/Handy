import time
import os
import cv2
import numpy as np
import glob
import shutil
import time

inputDirectory =  r'C:\Users\YuvalMund\Documents\data\TRY\heb_raw'
outputDirectory =  r'C:\Users\YuvalMund\Documents\data\TRY\dataset'
start_char = "א"

#for start_chat in range(1, 26):
    #print (os.path.join(inputDirectory, filename))
    # print(dirname)
for i in range(0, 28):
    if not os.path.exists(outputDirectory + "\\" + start_char) :
        os.mkdir(outputDirectory + "\\" + start_char)
    for filename in glob.glob(inputDirectory + "/*.png") :
        print(filename)
            #imgSrc = cv2.imread(os.path.join(inputDirectory, filename))
            #if imgSrc.shape[0] > 20 :
            # img = word_normalization(imgSrc, height=64)
        if (start_char in filename) :
            print (filename)
            os.rename(filename, os.path.join(outputDirectory, start_char, start_char + "_" + "1_" + str(time.time()) + ".png"))
            time.sleep(0.05)

       # start_char = chr(ord(start_char) + 1)
            #shutil.copyfile(os.path.join(inputDirectory, str(dirname), filename), outputDirectory + "/" + start_char + "_" + "1_" + str(time.time()) + ".png")
        #start_char = chr((ord(start_char) + 1))
            #cv2.imwrite(os.path.join(outputDirectory, "N_" + filename), img)
    start_char = chr(ord(start_char) + 1)


